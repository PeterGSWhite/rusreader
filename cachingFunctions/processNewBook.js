import { View, StyleSheet, Text, Dimensions  } from "react-native";


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
    const linesPerPage = Math.floor( (windowHeight - settings.pageMarginVertical) / (fontSize + settings.lineSpacing) )

    let result

    const ext = uri.split('.')[-1]
    if(ext === 'fb2') {
        result = parseFb2(uri) // result =  {coverInfo:{}, chapterList: [], sections:[]}
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
const parseFb2 = (uri) => {
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
    sections.slice(1,).forEach(section => {
        // Parse out title from each section and build up a chapter list
        let chapterTitle = section.match(/<title>\s+<p>(.*?)<\/p>\s+<\/title>/)[1]
        chapterList.push([chapterTitle, -1])

        // replace all non-html tags with html
        section = fb2XmlToHtml(section)

        // check each word against db, replace the entries which exist
        section = wrapVerbs(sections)

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
const wrapVerbs = (section) => {
    let words = section.split(' ')
    words.forEach((word) => {
        // Not working yet - (?:\s|[\e202F\e00A0>(\[«"'])([аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]*)(?=\s|[\e202F\e00A0<)\]»"',.:;-])
    })
}
const parseFb2CoverInfo = (section) => {
    let book = {}
    book.title = section.match('<book-title>(.*)</book-title>')[1] 
    let authorFirstname = section.match('<first-name>(.*)<\/first-name>')[1] 
    let authorLastname = section.match('<last-name>(.*)<\/last-name>')[1]
    book.author = authorFirstname + ' ' + authorLastname
    return book
}

const parseFb2CoverImage = (section) => {
    let match = section.match('/<binary .*? content-type="(.*?)">((?:.|\s)*?)<\/binary>/')
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