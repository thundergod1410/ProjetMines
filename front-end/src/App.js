import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Root from "./Root.react";
import MyPage from "./MyPage/Userpage.react";
import AllAnn from "./Ann/Welcome.react";
import MainView from "./main/MainView.react";



const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Root">
          <Stack.Screen name="Root" component={Root} />
          <Stack.Screen name="MainView" component={MainView} />
          <Stack.Screen name="AllAnn" component={AllAnn} />
          <Stack.Screen name="MyPage" component={MyPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}