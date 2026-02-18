import { useState, useContext, useMemo } from 'react';
import { RecipesContext, RecipeItem } from '../../context/RecipesContext';

/**
 * Custom hook for managing a category page of recipes.
 * Filters recipes by category and handles big/small icon toggle state.
 */

export const useCategoryPageRecipe = (category: string) => {
  const { recipes } = useContext(RecipesContext);

  const [isBigIcon, setIsBigIcon] = useState(true);
  const toggleIcon = () => setIsBigIcon(prev => !prev);

  const filteredRecipes: RecipeItem[] = useMemo(() => {
    return recipes.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }, [recipes, category]);

  return {
    filteredRecipes,
    isBigIcon,
    toggleIcon,
  };
};
