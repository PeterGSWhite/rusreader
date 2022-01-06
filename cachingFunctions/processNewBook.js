import matchAll from 'string.prototype.matchall';
// matchAll.shim()

import { View, StyleSheet, Text, Dimensions  } from "react-native";
import verb_aspect_map from './verbal_aspect_map'

import store from '../redux/store'

import RNFetchBlob from 'rn-fetch-blob'
import { nanoid } from '@reduxjs/toolkit';
const dirs = RNFetchBlob.fs.dirs

const processNewBook = async (uri) => {
    const settings = store.getState().settings
    

    const windowWidth = 572.2 //Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const linewidth = windowWidth - 2*settings.pageMarginHorizontal + settings.fontWidth
    const linesPerPage = Math.floor( (windowHeight - 2*settings.pageMarginVertical) / (settings.fontSize + settings.lineSpacing) )
    let result

    const ext = uri.split('.')
    if(ext[ext.length - 1] === 'fb2') {
        result = await parseFb2(uri) // result =  {coverInfo:{}, chapterList: [], sections:[]}
    }
    
    let cacheDir = nanoid()
    let currentPages = 0
    let sectionIndex = 0
    
    for(let section of result.sections) {
        result.chapterList[sectionIndex].from = currentPages
        let pagesInSection = await paginateSection(
            section,
            currentPages,
            linesPerPage,
            linewidth,
            settings.fontWidth,
            settings.wordSpacing,
            cacheDir
        )
        currentPages += pagesInSection
        result.chapterList[sectionIndex].to = currentPages - 1
        sectionIndex += 1
        // currentPages += sectionPages
        //     fontSize: 22,
        //     fontWidth: 11.97,
        //     wordSpacing: 0,
        //     realWordSpacing: 5.46,
        //     pageMarginHorizontal: 10,
        //     pageMarginVertical: 10,
        //     lineSpacing: 0,
        //   },
        
    }
    //result.totalPages = currentPages
    
    result = {...result, 
        ...{
            cacheDir: cacheDir,
            totalPages: currentPages
        }
    }
    return result
}

const paginateSection = async (
        section,
        currentPages,
        linesPerPage,
        linewidth,
        fontWidth,
        wordSpacing,
        cacheDir
    ) => {
        let line_no = 0
        let current_line_width = 0

        let pages = []
        let spaceWidth = fontWidth + wordSpacing
        let tag_reading = false
        let closing_tag_reading = false
        let open_tags = []
        let open_tag_name_chars = []
        let closing_tag_name_chars = []
        let current_page = []
        let i = -1
        for(let c of section) {
            i += 1
            if(c != '\n' && c != '\r') {
                current_page.push(c)
            }
            if(c == '/') {
                if(tag_reading) {
                    open_tags.push(open_tag_name_chars.join(''))
                    open_tag_name_chars = []
                    tag_reading = false
                }
                continue
            }
            else if(c == '<') {
                if(section[i+1] == '/') {
                    closing_tag_reading = true
                }
                else {
                    tag_reading = true
                }       
            }
            else if(c == '>') {
                if(tag_reading) {
                    open_tags.push(open_tag_name_chars.join(''))
                    open_tag_name_chars = []
                    
                    tag_reading = false
                }
                else if(closing_tag_reading) {
                    open_tags.pop()
                    tag = closing_tag_name_chars.join('')
                    if(tag == 'p' || tag == 'h1') {
                        line_no += 1
                        current_line_width = 0
                    }
                    closing_tag_name_chars = []
                    closing_tag_reading = false
                }       
            }
            // Else, not <, > or \>
            else {
                if(tag_reading) {
                    open_tag_name_chars.push(c)
                }
                else if(closing_tag_reading) {
                    closing_tag_name_chars.push(c)
                }
                // Else it's not within a tag
                else {
                    if(c != ' ' && c != '\n' && c != '\r') {
                        current_line_width += fontWidth
                    }
                    else if(current_line_width > 0) {
                        current_line_width += spaceWidth
                    }
                }
            }
            if(current_line_width > linewidth - fontWidth) {
                line_no += 1 
                current_line_width = 0    
            }
            if(line_no > linesPerPage) {
                open_tags.slice().reverse().forEach((tag) => {
                    if(tag && tag != ' ') {
                        current_page.push('</' + tag.split(' ')[0] + '>')
                    }
                })
                pages.push(current_page.join(''))
                current_page = []
                open_tags.forEach((tag) => {
                    if(tag && tag != ' ') {
                        current_page.push('<' + tag + '>')
                    }
                })   
                line_no = 0

            }
        }
        if(current_page.length > 1) {
            pages.push(current_page.join(''))
        }
        for(let page of pages) {
            await cacheSection(cacheDir, currentPages, page)
            currentPages += 1
        }
        return pages.length
}

const cacheSection = async (cacheDir, page, section) => {
    let chunk_path = dirs.CacheDir  + '/' +  cacheDir + '_' + page + '.txt'
    await RNFetchBlob.fs.writeFile(chunk_path, section, 'utf8')
}


// FB2 Parse Functions
const parseFb2 = async (uri) => {
    let data = await RNFetchBlob.fs.readFile(uri, "text/xml")
    let sections = data.split("<section>")
    
    // coverimage b64 comes with last section when split on opening tag
    let last = sections.pop()
    let breakLast = last.split('</section>')
    sections.push(breakLast[0])

    let coverInfo = parseFb2CoverInfo(sections[0])
    let imageInfo = parseFb2CoverImage(breakLast[1])
    coverInfo = {...coverInfo, ...imageInfo}
    let chapterList = []
    let processedSections = []
    for(section of sections.slice(1,)) {
        // Parse out title from each section and build up a chapter list
        let chapterTitle
        try {
            chapterTitle = section.match(/<p>(.+?)<\/p>\s*\n*?\s*?<\/title>/m)[1]
        } catch {
            continue
        }
        
        chapterList.push({
            title: chapterTitle, 
            from: -1,
            to: -1
        })
        
        // replace all non-html tags with html
        section = fb2XmlToHtml(section)
        
        // check each word against db, replace the entries which exist
        section = await wrapVerbs(section)
        processedSections.push(section)
    }
    return {
        coverInfo: coverInfo,
        chapterList: chapterList,
        sections: processedSections
    }
}
const fb2XmlToHtml = (section) => {
    // All text in the document is stored in the following paragraph-type elements: p, v, and subtitle. 
    // An empty-line element that has no content is used to insert one line of vertical space. 
    // A few more complex containers are built from these basic elements: 
    // title (contains any number of p and empty-line), annotation, poem, cite, epigraph.
    let sentenceRe = new RegExp(`([аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ][аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ,\\- \\\\p{Z}]+?)(?![аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ, \\-\\\\p{Z}])`, 'gm')
    section = section.replace(sentenceRe, `<span onClick="window.ReactNativeWebView.postMessage('speak££' + this.textContent)">$1</span>`)
    
    // Replace Section Titles
    let titleRe = new RegExp(`<title>(.*?)<\/title>`, 'gms')
    section = section.replace(titleRe, '<h1>$1</h1>')
    // Poems
    section = section.replace('<poem>', '<div class="poem">')
    section = section.replace('</poem>', '</div>')
    
    section = section.replace('<stanza>', '')
    section = section.replace('</stanza>', '')
    section = section.replace(/<v>(.*?)<\/v>/gm, '<p>$1</p>')


    // Cite
    section = section.replace('<cite>', '<div class="cite">')
    section = section.replace('</cite>', '</div>')
    
    // subtitle
    section = section.replace(/<subtitle>(.*?)<\/subtitle>/gm, '<p>$1</p>')

    // empty-line
    section = section.replace(`empty-line`, 'br')
    
    return section

}
const wrapVerbs = async (section) => {
    let wordRe = new RegExp(`(?:\\s|[\\e202F\\e00A0>…(\\[«"'])([аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]*)(?=\\s|[\\e202F\\e00A0<)\\]»…"',.:;\\!\\?-])`, 'gm')
    let words = []
    let matches =  matchAll(section, wordRe)
    let uniques = new Set()
    for(let match of matches ) {
        let word = match[1].toLowerCase()
        if(word && word in verb_aspect_map && !(word in uniques)) {
            words.push(word)
            uniques.add(word)
        }
    }
    
    words.forEach((word) => {
        aspect_id = verb_aspect_map[word]
        let className = ''
        if(aspect_id == 1) {
            className = 'nsv'
        } else if(aspect_id == 2) {
            className = 'sv'
        } else if(aspect_id == 3) {
            className = 'nsv-ud'
        } else if(aspect_id == 4) {
            className = 'nsv-md'
        }
        let re = new RegExp(`(\\s|t\\)">|[\\e202F\\e00A0…(\\[«"'])(${word})(?=\\s|[\\e202F\\e00A0<)\\]»…"',.:;\\!\\?-])`, 'gmi');
        section = section.replace(re,  `$1<span class="${className} highlighted" onClick="toggleHighlight(event, this); return false;">$2</span>`)
    })
    return section
}

const parseFb2CoverInfo = (section) => {
    let titleRe = new RegExp(`<book-title>([a-zA-z0-9 \--,.!?"':&%\u0401\u0451\u0410-\u044f]*?)<\/book-title>`, 'gm')
    let title = section.match(titleRe)[0].replace(titleRe, '$1')
    let firstnameRe = new RegExp(`<first-name>([a-zA-z0-9 \--,.!?"':&%\u0401\u0451\u0410-\u044f]*?)<\/first-name>`, 'gm')
    let authorFirstname = section.match(firstnameRe)[0].replace(firstnameRe, '$1')
    let lastnameRe = new RegExp(`<last-name>([a-zA-z0-9 \--,.!?"':&%\u0401\u0451\u0410-\u044f]*?)<\/last-name>`, 'gm')
    let authorLastname = section.match(lastnameRe)[0].replace(lastnameRe, '$1')

    return {title: title, author: authorFirstname + ' ' + authorLastname}
}

const parseFb2CoverImage = (section) => {
    // console.log(section)
    // let imageFormatRe = new RegExp(`content-type="(.*?)">`, 'gm')
    // let imageB64Re = new RegExp(`>((?:.|[\n\s])*?)<\/binary>`, 'gm')
    // let imageFormat = section.match(imageFormatRe)[0].replace(imageFormatRe, '$1')
    // let imageb64 = section.match(imageB64Re)[0].replace(imageB64Re, '$1')
    return {imageFormat: 'a', imageb64: 'b'}
}

export default processNewBook