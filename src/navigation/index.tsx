import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import MainMenu from '../screens/MainMenu';
import ConservationMain from '../screens/Conservation/ConservationMain';
import RecipesNavigation from '../screens/Recipes/RecipesNavigation';
import OthersNavigation from '../screens/Others/OthersNavigation';
import CardPage from '../screens/Pages/CardPage';
import CardPageRecipe from '../screens/Pages/CardPageRecipe';
import CardPageOther from '../screens/Pages/CardPageOther';
import ConservationNavigation from '../screens/Conservation/ConservationNavigation';
import { ConservationItem, ConservationProvider } from '../context/ConservationContext';
import CategoryPage from '../screens/Conservation/CategoryPage';
import { RecipeItem, RecipeProvider } from '../context/RecipesContext';
import CategoryPageRecipe from '../screens/Recipes/CategoryPageRecipe';
import { OthersItem, OthersProvider } from '../context/OthersContext';
import RemaindersMain from '../screens/Conservation/RemaindersMain';

export type RootStackParamList = {
  Welcome: undefined;
  MainMenu: undefined;
  ConservationNavigation: undefined;
  OthersNavigation: undefined;
  RecipesNavigation: undefined;
  ConservationMain: undefined;
  Details: { itemId: number };
  CardPage: { item: ConservationItem };
  CardPageRecipe: { item: RecipeItem };
  CardPageOther: { item: OthersItem };
  CategoryPage: { category: string };
  CategoryPageRecipe: { category: string }; 
  RemaindersMain: undefined;
};

// Створюємо Stack перед використанням
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <OthersProvider>
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
              <Stack.Screen name="OthersNavigation" component={OthersNavigation} />
              <Stack.Screen name="CardPage" component={CardPage} />
              <Stack.Screen name="CardPageRecipe" component={CardPageRecipe} />
              <Stack.Screen name="CardPageOther" component={CardPageOther} />
              <Stack.Screen name="ConservationMain" component={ConservationMain} />
              <Stack.Screen name="CategoryPage" component={CategoryPage} />
              <Stack.Screen name="CategoryPageRecipe" component={CategoryPageRecipe} />
              <Stack.Screen name="RemaindersMain" component={RemaindersMain} />
            </Stack.Navigator>
          </NavigationContainer>
        </ConservationProvider>
      </RecipeProvider>
    </OthersProvider>
  );
}
