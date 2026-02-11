import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import {
  loadRecipesFromStorage,
  saveRecipesToStorage,
  loadFavoritesFromStorage,
  saveFavoritesToStorage
} from '../services/recipesStorageService';

export type RecipeItem = {
  name: string;
  category: string;
  imageUri: string | null;
  recipeText: string;
  ingredients?: Ingredient[]; // нове поле
};

export type Ingredient = {
  amount: string; // кількість + одиниці (наприклад "2 ст. л.")
  name: string;   // назва інгредієнта
};

type Props = { children: ReactNode };

export type RecipesContextType = {
  recipes: RecipeItem[];
  favorites: string[]; 
  addRecipe: (item: RecipeItem) => void;
  toggleFavorite: (name: string) => void;
  updateImage: (name: string, newUri: string) => void;
  updateCategory: (name: string, newCategory: string) => void;
  updateRecipeText: (name: string, newText: string) => void;
  deleteRecipe: (name: string) => void;
  addIngredient: (recipeName: string, ingredient: Ingredient) => void; 
};

export const RecipesContext = createContext<RecipesContextType>({
  recipes: [],
  favorites: [],
  addRecipe: () => {},
  toggleFavorite: () => {},
  updateImage: () => {},
  updateCategory: () => {},
  updateRecipeText: () => {},
  deleteRecipe: () => {},
  addIngredient: () => {},
});

export const useRecipe = () => {
  const context = useContext(RecipesContext);
  if (!context) throw new Error('useRecipe must be used within a RecipeProvider');
  return context;
};

export const RecipeProvider = ({ children }: Props) => {
  const [recipes, setRecipes] = useState<RecipeItem[]>([]);

  const loadRecipes = async () => {
    const data = await loadRecipesFromStorage();
    setRecipes(data);
  };

  // Додавання нового рецепту (назва незмінна, якщо існує, не міняємо)
  const addRecipe = async (item: RecipeItem) => {
    try {
      const exists = recipes.some(r => r.name === item.name);
      if (!exists) {
        const newList = [...recipes, item];
        setRecipes(newList);
        await saveRecipesToStorage(newList);
      }
    } catch (e) {
      console.error('Failed to add recipe', e);
    }
  };

  // Оновлення картинки
  const updateImage = async (name: string, newUri: string) => {
    try {
      const newList = recipes.map(r =>
        r.name === name ? { ...r, imageUri: newUri } : r
      );
      setRecipes(newList);
      await saveRecipesToStorage(newList);
    } catch (e) {
      console.error('Failed to update image', e);
    }
  };

  // Оновлення категорії
  const updateCategory = async (name: string, newCategory: string) => {
    try {
      const newList = recipes.map(r =>
        r.name === name ? { ...r, category: newCategory } : r
      );
      setRecipes(newList);
      await saveRecipesToStorage(newList);
    } catch (e) {
      console.error('Failed to update category', e);
    }
  };

  // Оновлення тексту рецепту
  const updateRecipeText = async (name: string, newText: string) => {
    try {
      const newList = recipes.map(r =>
        r.name === name ? { ...r, recipeText: newText } : r
      );
      setRecipes(newList);
      await saveRecipesToStorage(newList);
    } catch (e) {
      console.error('Failed to update recipe text', e);
    }
  };

  // Видалення рецепту
  const deleteRecipe = async (name: string) => {
    try {
      const newList = recipes.filter(r => r.name !== name);
      setRecipes(newList);
      await saveRecipesToStorage(newList);
    } catch (e) {
      console.error('Failed to delete recipe', e);
    }
  };
  
  const addIngredient = async (recipeName: string, ingredient: Ingredient) => {
  try {
    const newList = recipes.map(r =>
      r.name === recipeName
        ? {
            ...r,
            ingredients: r.ingredients ? [...r.ingredients, ingredient] : [ingredient],
          }
        : r
    );

    setRecipes(newList);
    await saveRecipesToStorage(newList);
  } catch (e) {
    console.error('Failed to add ingredient', e);
  }
};

const [favorites, setFavorites] = useState<string[]>([]);

const toggleFavorite = async (name: string) => {
  try {
    let newFavorites: string[];
    if (favorites.includes(name)) {
      newFavorites = favorites.filter(f => f !== name);
    } else {
      newFavorites = [...favorites, name];
    }
    setFavorites(newFavorites);
    await saveFavoritesToStorage(newFavorites);
  } catch (e) {
    console.error('Failed to toggle favorite', e);
  }
};

// при завантаженні
const loadFavorites = async () => {
  const data = await loadFavoritesFromStorage();
  setFavorites(data);
};

useEffect(() => {
  loadRecipes();
  loadFavorites();
}, []);



  useEffect(() => {
    loadRecipes();
  }, []);

  return (
    <RecipesContext.Provider
    value={{ recipes, favorites, addRecipe, toggleFavorite, updateImage, updateCategory, updateRecipeText, deleteRecipe, addIngredient }}
  >
    {children}
  </RecipesContext.Provider>
  
  );
};
