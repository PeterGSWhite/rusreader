import matchAll from 'string.prototype.matchall';
// matchAll.shim()

import { View, StyleSheet, Text, Dimensions  } from "react-native";


import store from '../redux/store'

import RNFetchBlob from 'rn-fetch-blob'
const dirs = RNFetchBlob.fs.dirs

import SQlite from 'react-native-sqlite-storage'

const db = SQlite.openDatabase(
    {
        name: 'russiandb',
        location: '../db/russian.db'
    },
    () => {},
    error => { console.log(error) }
);

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
    console.log('outside', ext[ext.length - 1])
    if(ext[ext.length - 1] === 'fb2') {
        
        console.log('inside')
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
    
    console.log('preee')
    // coverimage b64 comes with last section when split on opening tag
    let last = sections.pop()
    let breakLast = last.split('</section>')
    sections.push(breakLast[0])

    let coverInfo = parseFb2CoverInfo(sections[0])
    let imageInfo = parseFb2CoverImage(breakLast[1])
    coverInfo = {...coverInfo, ...imageInfo}
    let chapterList = []
    let processedSections = []
    sections.slice(1,).forEach(section => {
        
        // Parse out title from each section and build up a chapter list
        //let chapterTitle = section.match(/<title>\s+<p>(.*?)<\/p>\s+<\/title>/)[1]
        let chapterTitle = 'one thing at a time'
        chapterList.push([chapterTitle, -1])

        // replace all non-html tags with html
        section = fb2XmlToHtml(section)
        
        // check each word against db, replace the entries which exist
        section = wrapVerbs(section)
        processedSections.push(section)
    })
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
    section = section.replace(/<title>\s+<p>(.*?)<\/p>\s+<\/title>/, '<h1>$1</h1>')

    // Poems
    section = section.replace('<poem>', '<div class="poem">')
    section = section.replace('</poem>', '</div>')
    section = section.replace('<stanza>', '')
    section = section.replace('</stanza>', '')
    section = section.replace(/<v>(.*?)<\/v>/, '<p>$1</p>')

    // Cite
    section = section.replace('<cite>', '<div class="cite">')
    section = section.replace('</cite>', '</div>')

    // subtitle
    section = section.replace(/<subtitle>(.*?)<\/subtitle>/, '<p>$1</p>')

    // empty-line
    section = section.replace('<empty-line/>', '<p></p>')

    return section

}
const wrapVerbs = async (section) => {
    let wordRe = new RegExp(`(?:\\s|[\\e202F\\e00A0>…(\\[«"'])([аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]*)(?=\\s|[\\e202F\\e00A0<)\\]»…"',.:;\\!\\?-])`, 'gm')
    let words = []
    let matches = matchAll(section, wordRe)
    
    for(let match of matches ) {
        let word = match[1].toLowerCase()
        if(word) {
            words.push(word)
        }
    }
    // Not working yet - (?:\s|[\e202F\e00A0>(\[«"'])([аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]*)(?=\s|[\e202F\e00A0<)\]»"',.:;-])
    aspect_map = await wordsLookup(words) // This is a map of word -> aspect_id for the words which where in the db
    console.log('aspect map workeD!', aspect_map)
    for(verb in aspect_map) {
        aspect_id = aspect_map[verb]
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
        replacement = `<span class="${className}">${verb}</span>`
        let re = new RegExp(`(?:whitespace)(${verb})(?:whitespace)`, 'gi');
        section.replace(re,  `<span class="${className}">$1</span>`)
    }
    return section
}

const wordsLookup = async (words) => {
    console.log(db)
    // This function is easy to inject with - would be a big no-no if there was sensitive data
    // The db only contains wikipedia data on Russian verbs so *shrugs*
    aspect_map = {}
    words = words.join(', ')
    console.log('words', typeof words, words.length)
    await db.transaction((tx) => {
        tx.executeSql(
            "SELECT word, aspect_id FROM verbal_aspects WHERE word = 'шел'",
            [],
            (tx, results) => {  
                console.log('results', results)
                results.rows.forEach((item) => {
                    aspect_map[item.word] = item.aspect_id
                })
            }
        )
    })
    console.log('why must i suffer', aspect_map)
    return aspect_map
}

const parseFb2CoverInfo = (section) => {
    return {author: 'J K ROWLING', title: 'filisiopfia jamen'}
    let book = {}
    book.title = section.match(/<book-title>(.*)<\/book-title>/)[1] 
    let authorFirstname = section.match(/<first-name>(.*)<\/first-name>/)[1] 
    let authorLastname = section.match(/<last-name>(.*)<\/last-name>/)[1]
    book.author = authorFirstname + ' ' + authorLastname
    return book
}

const parseFb2CoverImage = (section) => {
    return {imageFormat: 'image/jpeg', imageb64: 'im a fuck'}
    let match = section.match(/<binary .*? content-type="(.*?)">((?:.|\s)*?)<\/binary>/)
    return {imageFormat: match[1], imageb64: match[2]}
}

export default processNewBook

// let pages = 0
//     let book
//     // Get Cover info

//     // Chunk it up
//     let data = await RNFetchBlob.fs.readFile(uri, "text/xml")
//     let sections = data.split("<section")
//     for ( const [i, section] of sections.entries()) {
//         if(i == 0) {
//             console.log(section)
//             book = parseCoverInfo(section)
//         }
//         else {
//             sectionPages = 0
//             for(let i = 0; i < section.length; i += 1000) {
//                 let stop = Math.min(i+1000, section.length)
//                 await cacheSection(cacheDir, pages+sectionPages, section.slice(i, stop))
//                 sectionPages += 1
//             }
//             pages += sectionPages
//         }
//     }
//     book.totalPages = pages
//     return book