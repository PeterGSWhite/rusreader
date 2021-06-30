import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import CoverInfo from './CoverInfo';

const DATA = {
  'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba': {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'филосовский камень',
      author: 'дж к роалинг',
      currentPage: 403,
      totalPages: 403
    },
    '3ac68afc-c605-48d3-a4f8-fbd91aa097f63': {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'орден феникса',
      author: 'дж к роалинг',
      currentPage: 42,
      totalPages: 508
    },
    '58694a0f-3d8a1-471f-bd96-145571e29d72': {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'кубок онгня',
      author: 'дж к роалинг',
      currentPage: 0,
      totalPages: 507
    },
    'bd7acbea-c1b1-46c2-aed5-3ad53a7bb28ba': {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'филосовский камень',
        author: 'дж к роалинг',
        currentPage: 403,
        totalPages: 403
      },
      '3ac68afc-c605-48d36-a4f8-fbd91aa97f63': {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'орден феникса',
        author: 'дж к роалинг',
        currentPage: 42,
        totalPages: 508
      },
      '58694a0f-36da1-471f-bd96-145571e29d72': {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'кубок онгня',
        author: 'дж к роалинг',
        currentPage: 0,
        totalPages: 507
      },
      'bd7acbea-c1b1-46c2-aed65-3ad53abb28ba': {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'филосовский камень',
        author: 'дж к роалинг',
        currentPage: 403,
        totalPages: 403
      },
      '3ac68afc-c605-48d3-6a4f8-fbd91aa97f63': {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'орден феникса',
        author: 'дж к роалинг',
        currentPage: 42,
        totalPages: 508
      },
      '58694a0f-3da1-471f-bd96-1456571e29d72': {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'кубок онгня',
        author: 'дж к роалинг',
        currentPage: 0,
        totalPages: 507
      },
      'bd7acbea-c1b1-46c62-aed5-3ad53abb28ba': {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'филосовский камень',
        author: 'дж к роалинг',
        currentPage: 403,
        totalPages: 403
      },
      '3ac68afc-c605-48d63-a4f8-fbd91aa97f63': {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'орден феникса',
        author: 'дж к роалинг',
        currentPage: 42,
        totalPages: 508
      },
      '58694a0f-3da1-471f-6bd96-145571e29d72': {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'кубок онгня',
        author: 'дж к роалинг',
        currentPage: 0,
        totalPages: 507
      },
  }

const Library = () => {
  const renderItem = ({ item }) => (
    <CoverInfo style={styles.cover} info={DATA[item]} />
  );

  return (
      <View style={styles.container}>
            
            <FlatList
                data={Object.keys(DATA)}
                renderItem={renderItem}
                keyExtractor={item => item}
            />
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0,
  },
  cover: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default Library;