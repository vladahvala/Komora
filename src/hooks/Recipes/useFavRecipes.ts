import { useContext, useMemo, useState } from 'react';
import { RecipesContext, RecipeItem } from '../../context/RecipesContext';

/**
 * Custom hook for managing favorite recipes.
 * Filters recipes marked as favorites and handles big/small card toggle state.
 */

export const useFavRecipes = () => {
  const { recipes, favorites } = useContext(RecipesContext);

  // filtered fav recipes
  const filteredFavorites: RecipeItem[] = useMemo(() => {
    return recipes.filter(item => item && favorites.includes(item.name));
  }, [recipes, favorites]);

  // state of cards
  const [isBigIcon, setIsBigIcon] = useState(true);
  const toggleIcon = () => setIsBigIcon(prev => !prev);

  return {
    filteredFavorites,
    isBigIcon,
    toggleIcon,
  };
};
