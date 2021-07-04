import RNFetchBlob from 'rn-fetch-blob'
const dirs = RNFetchBlob.fs.dirs

const processNewBook = async (id, uri) => {
    // return new Promise(function(resolve, reject) {
        let pages = 0
        let book
        // Get Cover info
        console.log('entry to pronebo')
        // Chunk it up
        let data = await RNFetchBlob.fs.readFile(uri, "text/xml")
        // .then((data) => {
        console.log(typeof(data))
        let sections = data.split("<section")
        sections.forEach((section, i) => {
            if(i == 0) {
                console.log(section)
                book = parseCoverInfo(section)
            }
            else {
                sectionPages = 0
                for(let i = 0; i < section.length; i += 1000) {
                    sectionPages += 1
                    let stop = Math.min(i+1000, section.length)
                    cacheSection(id, pages+sectionPages, section.slice(i, stop)).then(() => {

                    })
                }
                pages += sectionPages
            }
        })
        book.totalPages = pages
        console.log('got here', book)
        return book
        // })
        // reject('failed to process book')
    // })
}

const parseCoverInfo = (section) => {
    let book = {}
    book.title = section.match('<book-title>(.*)</book-title>')[1] 
    let authorFirstname = section.match('<first-name>(.*)<\/first-name>')[1] 
    let authorLastname = section.match('<last-name>(.*)<\/last-name>')[1]
    book.author = authorFirstname + ' ' + authorLastname
    console.log('book', book)
    return book
}

const cacheSection = async (id, page, section) => {
    let chunk_path = dirs.CacheDir + id + '_' + page + '.txt'
    await RNFetchBlob.fs.writeFile(chunk_path, section, 'utf8')
}

export default processNewBook