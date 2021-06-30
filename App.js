import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import Library from './screens/Library';


const App = () => {

  return (
    <SafeAreaView>
      <Library />
    </SafeAreaView>
  );
}

export default App;