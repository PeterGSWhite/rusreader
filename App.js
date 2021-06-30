// Example of File Picker in React Native
// https://aboutreact.com/file-picker-in-react-native/

// Import React
import { red } from 'kleur';
import React, {useState} from 'react';
// Import required components
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Button,
  TextInput
} from 'react-native';

import MyWeb from './helloworld/MyWeb'

const App = () => {
  const [singleFile, setSingleFile] = useState('');
  const [multipleFile, setMultipleFile] = useState([]);
  const [path, setPath] = useState('')
  const [sectionno, setSectionno] = useState('0')
  const [fontSize, setFontSize] = useState(24)
  const [pixelWidth, setPixelWidth] = useState(14.40)
  const [html, setHtml] = useState(`
  <p>calibrating 1 2 3 ! " £ -</p>
  <p>CALIBRATING 1 2 3 ! " £ -</p>
  <p><span class="perf">калибратинг</span> 1 2 3 ! " £ -</p>
  <p>КАЛИБРАТИНГ 1 2 3 ! " £ -</p>
  `)
  const [styles, setStyles] = useState(`
    .perf {background-color:rgba(28, 28, 108, 0.4);}
    .imperf {background-color:blue;}
    p {font-family: 'Droid Sans Mono', 'Courier New';font-size: ${fontSize}px; margin:8;}
  `)
  6
  return (
    <SafeAreaView style={{flex: 1, margin:8}}>
      <Text>{pixelWidth}</Text>
      <MyWeb
      section={html}
      styles={styles}
      fontSize={fontSize}
      setPixelWidth={setPixelWidth} 
      />
    </SafeAreaView>
    
  );
};

export default App;
