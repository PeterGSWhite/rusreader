import React from 'react';
import { View, FlatList, StyleSheet, StatusBar, TouchableOpacity, Text } from 'react-native';
import CoverInfo from './CoverInfo';
import DocumentPicker from 'react-native-document-picker';
import { useSelector, useDispatch } from 'react-redux' 
import { DrawerContentScrollView } from '@react-navigation/drawer';

const Library = ({navigation}) => {
  const dispatch = useDispatch()
  const books = useSelector(state => state.books)
  console.log(books)

  const openBookFile = async () => {
    console.log('oi')
    dispatch({type: 'books/bookAdded', payload: {title:'oi', author:'me', totalPages:131}})
    // try {
    //   const res = await DocumentPicker.pick({
    //     type: [DocumentPicker.types.allFiles],
    //   });
    //   console.log(
    //     res.uri,
    //     res.type, // mime type
    //     res.name,
    //     res.size
    //   );
    //   // Instantiate new book here and redirect
    // } catch (err) {
    //   if (DocumentPicker.isCancel(err)) {
    //     // User cancelled the picker, exit any dialogs or menus and move on
    //   } else {
    //     throw err;
    //   }
    // }
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
              <Text style={{}}>➕</Text>
              <Text>Add Book</Text>
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