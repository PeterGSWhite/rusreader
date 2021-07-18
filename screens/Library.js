import React, { useState } from 'react';
import { View, FlatList, StyleSheet, StatusBar, TouchableOpacity, Text } from 'react-native';
import CoverInfo from './CoverInfo';
import DocumentPicker from 'react-native-document-picker';
import { useSelector, useDispatch } from 'react-redux'
import {
  addBook,
  selectAllBooks
} from '../redux/booksSlice'
import { nanoid } from '@reduxjs/toolkit'
import { DrawerContentScrollView } from '@react-navigation/drawer';
import processNewBook from '../cachingFunctions/processNewBook'

const Library = ({navigation}) => {
  const dispatch = useDispatch()
  const books = useSelector(selectAllBooks)
  console.log('boooooks', books)
  const [loadingBook, setLoadingBook] = useState(false)

  const openBookFile = async () => {
    setLoadingBook(true)
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );
      let book = await processNewBook(res.uri)
      dispatch(addBook({
        cacheDir: book.cacheDir,
        title: book.coverInfo.title,
        author: book.coverInfo.author,
        totalPages:book.totalPages,
        // coverArt
      })) 
      // Instantiate new book here and redirect
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    } finally {
      setLoadingBook(false)
    }
  }  

  // Render books
  const renderBook = book => (
    <CoverInfo 
      key={book.id}
      book={book}
      navigation={navigation}
    />
  )

  return (
      <View style={styles.container}>
            <TouchableOpacity
             onPress={openBookFile}
             style={styles.cover}>
              <Text style={{}}>{loadingBook ? '...' : '➕'}</Text>
              <Text>{loadingBook ? 'Processing book' : 'Add Book'}</Text>
            </TouchableOpacity>
            <FlatList
                data={books}
                renderItem={renderBook}
                keyExtractor={item => item.id}
            />
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
  },
  title: {
    fontSize: 32,
  },
});

export default Library;