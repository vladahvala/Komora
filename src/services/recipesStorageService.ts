import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecipeItem } from '../context/RecipesContext';

const RECIPES_KEY = '@recipes';
const FAVORITES_KEY = '@favorites';

export const loadRecipesFromStorage = async (): Promise<RecipeItem[]> => {
  try {
    const json = await AsyncStorage.getItem(RECIPES_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Failed to load recipes', e);
    return [];
  }
};

export const saveRecipesToStorage = async (recipes: RecipeItem[]) => {
  try {
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  } catch (e) {
    console.error('Failed to save recipes', e);
  }
};

export const loadFavoritesFromStorage = async (): Promise<string[]> => {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Failed to load favorites', e);
    return [];
  }
};

export const saveFavoritesToStorage = async (favorites: string[]) => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to save favorites', e);
  }
};
