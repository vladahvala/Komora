import { useState } from 'react';
import { RecipeItem, Ingredient, useRecipe } from '../../context/RecipesContext';

/**
 * Custom hook for managing a recipe card page.
 * Handles current recipe data, image, category, ingredients, recipe text, and favorites.
 */

export const useCardPageRecipe = (item: RecipeItem) => {
  const { 
    recipes, 
    updateImage, 
    updateCategory, 
    addIngredient, 
    updateRecipeText, 
    favorites, 
    toggleFavorite 
  } = useRecipe();

  // current card
  const currentItem = recipes.find(c => c.name === item.name);

  // favs
  const isFavorite = favorites.includes(item.name);

  // IMAGE
  const [imageUri, setImageUri] = useState<string | null>(item.imageUri || null);
  const changeImage = (uri: string) => {
    setImageUri(uri);
    if (currentItem) updateImage(currentItem.name, uri);
  };

  // CATEGORY
  const [selectedCategory, setSelectedCategory] = useState<string>(item.category);
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const categories = ['Мариновані', 'Солені', 'Квашені', 'Варення / Джеми', 'Компоти', 'Соуси / Кетчупи', 'Консерви в олії / жирі'];
  const changeCategory = (category: string) => {
    setSelectedCategory(category);
    if (currentItem) updateCategory(currentItem.name, category);
  };

  // INGREDIENTS
  const units = ['ст л', 'ст', 'чй л', 'кг', 'л', 'г'];
  const [unitDropdownVisible, setUnitDropdownVisible] = useState(false);
  const [newIngredient, setNewIngredient] = useState<{ amount: string; unit: string; name: string }>({ amount: '', unit: 'ст л', name: '' });

  const addNewIngredient = () => {
    if (!newIngredient.amount || !newIngredient.name) return;
    if (currentItem) {
      addIngredient(currentItem.name, { amount: `${newIngredient.amount} ${newIngredient.unit}`, name: newIngredient.name });
    }
    setNewIngredient({ amount: '', unit: 'ст л', name: '' });
  };

  const deleteIngredient = (index: number) => {
    if (currentItem) {
      const updated = currentItem.ingredients?.filter((_, i) => i !== index) || [];
      currentItem.ingredients = updated;
      updateCategory(currentItem.name, currentItem.category); // щоб зберегти state
    }
  };

  // RECIPE TEXT
  const [editableRecipeText, setEditableRecipeText] = useState(currentItem?.recipeText || '');
  const saveRecipeText = (text: string) => {
    setEditableRecipeText(text);
    if (currentItem) updateRecipeText(currentItem.name, text);
  };

  return {
    // Current Item
    currentItem,
    isFavorite,
    imageUri,
    changeImage,

    // Category Selection
    selectedCategory,
    setSelectedCategory,
    categoryDropdownVisible,
    setCategoryDropdownVisible,
    categories,
    changeCategory,

    // units
    units,
    unitDropdownVisible,
    setUnitDropdownVisible,

    // ingredients
    newIngredient,
    setNewIngredient,
    addNewIngredient,
    deleteIngredient,

    // recipe
    editableRecipeText,
    saveRecipeText,
    toggleFavorite,
  };
};
