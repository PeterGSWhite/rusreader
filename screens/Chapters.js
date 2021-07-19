import React, { useState } from 'react';
import { View, FlatList, StyleSheet, StatusBar, TouchableOpacity, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import {
    selectBookById,
} from '../redux/booksSlice'

const Chapters = () => {
    const settings = useSelector(state => state.settings)
    const book = useSelector(state => selectBookById(state, settings.currentBookId))
    console.log('book in chapters', book)
    const renderChapter = chapter => (
        <Text>{chapter['title']} - {chapter['from']} - {chapter['to']}</Text>
    )

    return (
        <View>
            <TouchableOpacity>
              <FlatList
                data={book.chapterList}
                renderItem={renderChapter}
                keyExtractor={item => item.title}/>
            </TouchableOpacity>
            
        </View>
    );
}

export default Chapters