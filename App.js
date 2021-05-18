import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import PDF from './src/screens/pdf';
import PdfList from './src/screens/pdfList';

const Stack = createStackNavigator();

//Stack Navigator containing Pdf List Screen (consisting of list of PDF's uploaded to the App)
//and Pdf Screen (displaying individual PDF)

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="PdfList" component={PdfList} />
        <Stack.Screen name="Pdf" component={PDF} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
