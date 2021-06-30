import React from "react";
import { View, Text, Image } from "react-native";

const CoverInfo = ({info}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        height: 100,
        padding: 20,
        marginBottom: 5,
        marginHorizontal: 20,
        backgroundColor: 'grey'
      }}
    >
      <View style={{ flex: 0.3 }} >
        <Image
            source={require('../img/froggyboi.png')}
        />
      </View>
      <View style={{flex: 0.7 }} >
          <Text>{info.title}</Text>
          <Text>{info.author}</Text>
          <Text>{info.currentPage}</Text>
          <Text>{info.totalPages}</Text>
      </View>
    </View>
  );
};

export default CoverInfo;