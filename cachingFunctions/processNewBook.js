import { View, StyleSheet, Text, useWindowDimensions } from "react-native";


import store from '../redux/store'

import RNFetchBlob from 'rn-fetch-blob'
const dirs = RNFetchBlob.fs.dirs
const processNewBook = async (cacheDir, uri) => {
    const settings = store.getState().settings
    console.log(settings)
    let pages = 0
    let book
    // Get Cover info

    // Chunk it up
    let data = await RNFetchBlob.fs.readFile(uri, "text/xml")
    let sections = data.split("<section")
    for ( const [i, section] of sections.entries()) {
        if(i == 0) {
            console.log(section)
            book = parseCoverInfo(section)
        }
        else {
            sectionPages = 0
            for(let i = 0; i < section.length; i += 1000) {
                let stop = Math.min(i+1000, section.length)
                await cacheSection(cacheDir, pages+sectionPages, section.slice(i, stop))
                sectionPages += 1
            }
            pages += sectionPages
        }
    }
    book.totalPages = pages
    return book
}

const parseCoverInfo = (section) => {
    let book = {}
    book.title = section.match('<book-title>(.*)</book-title>')[1] 
    let authorFirstname = section.match('<first-name>(.*)<\/first-name>')[1] 
    let authorLastname = section.match('<last-name>(.*)<\/last-name>')[1]
    book.author = authorFirstname + ' ' + authorLastname
    return book
}

const cacheSection = async (cacheDir, page, section) => {
    let chunk_path = dirs.CacheDir  + '/' +  cacheDir + '_' + page + '.txt'
    await RNFetchBlob.fs.writeFile(chunk_path, section, 'utf8')
}

export default processNewBook