import React, { useState } from 'react';
import { View, FlatList, StyleSheet, StatusBar, TouchableOpacity, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import {
    updateBook,
    selectBookById,
} from '../redux/booksSlice'

const Chapters = ({navigation}) => {
    const settings = useSelector(state => state.settings)
    const dispatch = useDispatch()
    const book = useSelector(state => selectBookById(state, settings.currentBookId))
    console.log('book in chapters', book)

    const renderChapter = ({item}) => (
        <TouchableOpacity
        onPress={() => {
                dispatch(updateBook({
                    id: book.id,
                    changes: {
                        currentPage: item.from
                    }
                }))
              navigation.navigate('PageContainer', book)
            }
          }>
        <Text style={styles.cover}>{item.title} - {item.from}</Text>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <Text>{book.title} - {book.author} | {book.currentPage}/{book.totalPages}</Text>
         
            <FlatList
            data={book.chapterList}
            renderItem={renderChapter}
            keyExtractor={(item, index) => item.from}/>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      marginTop: StatusBar.currentHeight || 0,
    },
    cover: {
      backgroundColor: 'grey',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    }
  });

export default Chapters