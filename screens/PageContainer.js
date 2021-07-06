import React, {useState, useEffect} from 'react';
import { View, Text, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux' 
import {
    updateBook,
    selectBookById,
} from '../redux/booksSlice'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import RNFetchBlob from 'rn-fetch-blob'
const dirs = RNFetchBlob.fs.dirs

import PageContent from './PageContent'

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

    const onSwipeLeft = (gestureState) => {
        dispatch(updateBook({
            id: route.params.id,
            changes: {
                currentPage: Math.min(book.currentPage + 1, book.totalPages)
            }
        }))
    }
    const onSwipeRight = (gestureState) => {
        console.log('right')
        dispatch(updateBook({
            id: route.params.id, 
            changes: {
                currentPage: Math.max(book.currentPage - 1, 0)
            }
        }))
    }


    useEffect(() => readchunkfoo(book.cacheDir, book.currentPage), [book.currentPage,])
    return (
        <GestureRecognizer
            onSwipeLeft={(state) => onSwipeLeft(state)}
            onSwipeRight={(state) => onSwipeRight(state)}
            style= {{flex: 1}}
        >   
            <PageContent
                pageContent = {pageContent}
            />
        </GestureRecognizer>  
            
    )
}

export default PageContainer