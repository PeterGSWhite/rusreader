import React, {useState, useEffect} from 'react';
import { View, Text, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux' 
import {
    updateBook,
    selectBookById,
} from '../redux/booksSlice'

import RNFetchBlob from 'rn-fetch-blob'
const dirs = RNFetchBlob.fs.dirs
const PageContainer = ({route}) => {
    console.log('id in pagecontainer', route.params.id)
    const book = useSelector(state => selectBookById(state, route.params.id))
    console.log('book in pagecontainer', book)
    const dispatch = useDispatch()

    const [pageContent, setPageContent] = useState('empty')

    const readchunkfoo = (cacheDir, page) => {
        console.log('readingchunkfoo', cacheDir, page)
        let chunk_path = dirs.CacheDir + '/' + cacheDir + '_' + page + '.txt'
        RNFetchBlob.fs.readFile(chunk_path, 'utf8')
           .then((data) => {
             setPageContent(data)
            })
    }
    useEffect(() => readchunkfoo(book.cacheDir, book.currentPage), [book.currentPage,])
    return (
        <View>
            <Button onPress={() => {dispatch(updateBook({id: route.params.id, changes: {currentPage: book.currentPage + 1}}))}} title="oi" ></Button>
            <Text>{pageContent}</Text>
        </View>
    )
}

export default PageContainer