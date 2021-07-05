import React, {useState, useEffect} from 'react';
import { View, Text } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
const dirs = RNFetchBlob.fs.dirs
const PageContent = ({route}) => {
    
    const [pageContent, setPageContent] = useState('empty')

    const readchunkfoo = (id, page) => {
        console.log(route.params)
        let chunk_path = dirs.CacheDir + id + '_' + page + '.txt'
        RNFetchBlob.fs.readFile(chunk_path, 'utf8')
           .then((data) => {
             setPageContent(data)
           })
      }
    useEffect(() => readchunkfoo(route.params.id, 19), [])
    return (
        <View>
            <Text>{pageContent}</Text>
        </View>
    )
}

export default PageContent