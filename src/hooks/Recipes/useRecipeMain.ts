import { useContext, useMemo, useState } from 'react';
import { RecipesContext, RecipeItem } from '../../context/RecipesContext';

/**
 * Custom hook for managing the main recipes list.
 * Handles search filtering and big/small card toggle state.
 */

export const useRecipeMain = () => {
  const { recipes } = useContext(RecipesContext);

  const [searchText, setSearchText] = useState('');
  const [isBigIcon, setIsBigIcon] = useState(true);

  const toggleIcon = () => setIsBigIcon(prev => !prev);

  // search filter
  const filteredRecipes: RecipeItem[] = useMemo(() => {
    return recipes
      .filter(item => item)
      .filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [recipes, searchText]);

  return {
    filteredRecipes,
    searchText,
    setSearchText,
    isBigIcon,
    toggleIcon,
  };
};
