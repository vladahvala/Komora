import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import MainMenu from '../screens/MainMenu';
import ConservationMain from '../screens/Conservation/ConservationMain';
import CardPage from '../components/CardPage';
import ConservationNavigation from '../screens/Conservation/ConservationNavigation';
import { ConservationItem, ConservationProvider } from '../context/ConservationContext';

export type RootStackParamList = {
  Welcome: undefined;
  MainMenu: undefined;
  ConservationNavigation: undefined;
  ConservationMain: undefined;
  Details: { itemId: number };
  CardPage: { item: ConservationItem };
};

// Створюємо Stack перед використанням
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <ConservationProvider>
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
          <Stack.Screen name="CardPage" component={CardPage} />
          <Stack.Screen name="ConservationMain" component={ConservationMain} />
        </Stack.Navigator>
      </NavigationContainer>
    </ConservationProvider>
  );
}
