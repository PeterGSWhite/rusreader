import matchAll from 'string.prototype.matchall';
// matchAll.shim()

import { View, StyleSheet, Text, Dimensions  } from "react-native";
import verb_aspect_map from './verbal_aspect_map'

import store from '../redux/store'

import RNFetchBlob from 'rn-fetch-blob'
const dirs = RNFetchBlob.fs.dirs

const processNewBook = async (cacheDir, uri) => {
    const settings = store.getState().settings
    //     fontSize: 22,
    //     fontWidth: 11.97,
    //     wordSpacing: 0,
    //     realWordSpacing: 5.46,
    //     pageMarginHorizontal: 10,
    //     pageMarginVertical: 10,
    //     lineSpacing: 0,
    //   },

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const linewidth = windowWidth - settings.pageMarginHorizontal
    const linesPerPage = Math.floor( (windowHeight - settings.pageMarginVertical) / (settings.fontSize + settings.lineSpacing) )

    let result

    const ext = uri.split('.')
    if(ext[ext.length - 1] === 'fb2') {
        result = await parseFb2(uri) // result =  {coverInfo:{}, chapterList: [], sections:[]}
        console.log('result', result)
    }

    let currentPages = 0
    result.sections.forEach((section, sectionIndex) => {
        // need result.chapterList[sectionIndex][1] = currentPages
        let sectionPages = 0

        // Logic for pagination

        // currentPages += sectionPages

        
    })
    result.totalPages = currentPages
    
    
    
}

const cacheSection = async (cacheDir, page, section) => {
    let chunk_path = dirs.CacheDir  + '/' +  cacheDir + '_' + page + '.txt'
    await RNFetchBlob.fs.writeFile(chunk_path, section, 'utf8')
}

function* lineGenerator(section, index, linewidth, fontWidth, wordSpacing) {
    "Yield lines with hyphens on wordbreak"
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
        let chapterTitle = section.match(/<p>(.*?)<\/p>\s+<\/title>/gm)[1]
        chapterList.push([chapterTitle, -1])
        
        // replace all non-html tags with html
        section = fb2XmlToHtml(section)
        
        // check each word against db, replace the entries which exist
        section = await wrapVerbs(section)
        
        processedSections.push(section.slice(0,200))
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
    
    // Replace Section Titles
    section = section.replace(/<title>\s+<p>(.*?)<\/p>\s+<p>(.*?)<\/p>\s+<\/title>/gm, '<h1>$1</h1><h1>$2</h1>')

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
    console.log(words.length)
    words.forEach((word) => {
        aspect_id = verb_aspect_map[word]
        let className = ''
        if(aspect_id == 1) {
            className = 'nsv'
        } else if(aspect_id == 2) {
            className = 'sv'
        } else if(aspect_id == 3) {
            className = 'ns-ud'
        } else if(aspect_id == 4) {
            className = 'ns-md'
        }
        let re = new RegExp(`(?:\\s|[\\e202F\\e00A0>…(\\[«"'])(${word})(?=\\s|[\\e202F\\e00A0<)\\]»…"',.:;\\!\\?-])`, 'gi');
        section = section.replace(re,  `<span class="${className}">$1</span>`)
    })
    return section
}

const parseFb2CoverInfo = (section) => {
    let title = section.match(/<book-title>(.*)<\/book-title>/gm)[1] 
    let authorFirstname = section.match(/<first-name>(.*)<\/first-name>/gm)[1] 
    let authorLastname = section.match(/<last-name>(.*)<\/last-name>/gm)[1]
    return {title: title, author: authorFirstname + ' ' + authorLastname}
}

const parseFb2CoverImage = (section) => {
    let match = section.match(/<binary .*? content-type="(.*?)">((?:.|\s)*?)<\/binary>/gm)
    return {imageFormat: match[1], imageb64: match[2]}
}

export default processNewBook