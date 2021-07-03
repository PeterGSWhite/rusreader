import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useSelector } from 'react-redux'

const CoverInfo = ({navigation, book}) => {
  console.log(book)
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
      onPress={() =>
        navigation.navigate('Test', { book })
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