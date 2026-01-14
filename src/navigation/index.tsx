import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import MainMenu from '../screens/MainMenu';
import ConservationMain from '../screens/Conservation/ConservationMain';
import RecipesNavigation from '../screens/Recipes/RecipesNavigation';
import CardPage from '../components/CardPage';
import CardPageRecipe from '../components/CardPageRecipe';
import ConservationNavigation from '../screens/Conservation/ConservationNavigation';
import { ConservationItem, ConservationProvider } from '../context/ConservationContext';
import CategoryPage from '../screens/Conservation/CategoryPage';
import { RecipeItem, RecipeProvider } from '../context/RecipesContext';

export type RootStackParamList = {
  Welcome: undefined;
  MainMenu: undefined;
  ConservationNavigation: undefined;
  RecipesNavigation: undefined;
  ConservationMain: undefined;
  Details: { itemId: number };
  CardPage: { item: ConservationItem };
  CardPageRecipe: { item: RecipeItem };
  CategoryPage: { category: string };
};

// Створюємо Stack перед використанням
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <RecipeProvider>
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
            <Stack.Screen name="RecipesNavigation" component={RecipesNavigation} />
            <Stack.Screen name="CardPage" component={CardPage} />
            <Stack.Screen name="CardPageRecipe" component={CardPageRecipe} />
            <Stack.Screen name="ConservationMain" component={ConservationMain} />
            <Stack.Screen name="CategoryPage" component={CategoryPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </ConservationProvider>
    </RecipeProvider>
  );
}
