/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import MyWeb from '../MyWeb'
 import RNFetchBlob from 'rn-fetch-blob'
 const dirs = RNFetchBlob.fs.dirs
 // import { WebView } from 'react-native-webview';
 
 import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   useColorScheme,
   View,
   Button,
   PermissionsAndroid
 } from 'react-native';
 
 import {
   Colors,
   DebugInstructions,
   Header,
   LearnMoreLinks,
   ReloadInstructions,
 } from 'react-native/Libraries/NewAppScreen';
 
 const requestWritePermission = async () => {
   try {
     const granted = await PermissionsAndroid.request(
       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
       {
         title: "Rusreader Write Permission",
         message:
           "RusReader needs access to your files" +
           "so you can read books",
         buttonNeutral: "Ask Me Later",
         buttonNegative: "Cancel",
         buttonPositive: "OK"
       }
     );
     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
       console.log("You can write");
     } else {
       console.log("you have no hands");
     }
   } catch (err) {
     console.warn(err);
   }
 };
 
 const requestReadPermission = async () => {
   try {
     const granted = await PermissionsAndroid.request(
       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
       {
         title: "Rusreader Read Permission",
         message:
           "RusReader needs access to your files" +
           "so you can read books",
         buttonNeutral: "Ask Me Later",
         buttonNegative: "Cancel",
         buttonPositive: "OK"
       }
     );
     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
       console.log("You can read");
     } else {
       console.log("you are illiterate fuck");
     }
   } catch (err) {
     console.warn(err);
   }
 };
 
 const requestPermissions = async () => {
   requestReadPermission()
   requestWritePermission()
 }
 
 const App = () => {
   const isDarkMode = useColorScheme() === 'dark';
   const PATH = dirs.CacheDir + 'test.txt'
 
   const writefoo = () => {
     requestWritePermission().then(() => {
       RNFetchBlob.fs.writeFile(PATH, 'foo', 'utf8')
               .then(()=>{  })
     })
     
   }
 
   const readfoo = () => {
     requestReadPermission().then(() => {
       RNFetchBlob.fs.readFile(PATH, 'utf8')
       .then((data) => {
         console.log(data)
         alert(data)
       })
     })
   }
   
 
   const backgroundStyle = {
     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
   };
 
   return (
     // <MyWeb
     //   />
     <View>  
       <Button 
       onPress={writefoo}
       title="write foo" 
       />
       <Button 
       onPress={readfoo}
       title="read foo" 
       />
     </View>
   );
 };
 
 const styles = StyleSheet.create({
   
 });
 
 export default App;
 