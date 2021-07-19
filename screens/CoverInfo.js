import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from 'react-redux'

const CoverInfo = ({navigation, book}) => {
  const dispatch = useDispatch()
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        height: 100,
        padding: 20,
        marginBottom: 5,
        marginHorizontal: 20,
        backgroundColor: 'grey'
      }}
      onPress={() => {
        console.log('WOW COVER ID ITS HERE WOW', book.item.id, 'end')
          dispatch({
            type: 'settings/edit',
            payload: {
              currentBookId: book.item.id
            }
          })
          navigation.navigate('PageContainer', book.item)
        }
      }
    >
      <View style={{ flex: 0.3 }} >
        <Image
            source={require('../img/froggyboi.png')}
        />
      </View>
      <View style={{flex: 0.7 }} >
          <Text>{book.item.title}</Text>
          <Text>{book.item.author}</Text>
          <Text>{book.item.currentPage}</Text>
          <Text>{book.item.totalPages}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CoverInfo;