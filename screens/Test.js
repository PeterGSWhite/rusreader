import React from 'react';
import { View, Text } from 'react-native';

const Test = ({route}) => (
    <View>
        <Text>{route.params.info.title}</Text>
    </View>
)

export default Test