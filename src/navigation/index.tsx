import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import MainMenu from '../screens/MainMenu';
import ConservationNavigation from '../screens/Conservation/ConservationNavigation';

export type RootStackParamList = {
  Welcome: undefined;
  MainMenu: undefined;
  ConservationNavigation: undefined;
  Details: { itemId: number };
};

// Створюємо Stack перед використанням
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false, 
          animation: 'none', // default animations off
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="ConservationNavigation" component={ConservationNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
