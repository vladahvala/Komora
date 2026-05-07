import { RecipeItem, Ingredient } from '../context/RecipesContext';

export const addRecipeLogic = (
  prev: RecipeItem[],
  item: RecipeItem
): RecipeItem[] => {
  const exists = prev.some(r => r.name === item.name);

  if (exists) return prev;

  return [...prev, item];
};

export const deleteRecipeLogic = (
  prev: RecipeItem[],
  name: string
): RecipeItem[] => {
  return prev.filter(r => r.name !== name);
};

export const updateImageLogic = (
  prev: RecipeItem[],
  name: string,
  newUri: string
): RecipeItem[] => {
  return prev.map(r =>
    r.name === name ? { ...r, imageUri: newUri } : r
  );
};

export const updateCategoryLogic = (
  prev: RecipeItem[],
  name: string,
  newCategory: string
): RecipeItem[] => {
  return prev.map(r =>
    r.name === name ? { ...r, category: newCategory } : r
  );
};

export const updateRecipeTextLogic = (
  prev: RecipeItem[],
  name: string,
  newText: string
): RecipeItem[] => {
  return prev.map(r =>
    r.name === name ? { ...r, recipeText: newText } : r
  );
};

export const addIngredientLogic = (
  prev: RecipeItem[],
  recipeName: string,
  ingredient: Ingredient
): RecipeItem[] => {
  return prev.map(r =>
    r.name === recipeName
      ? {
          ...r,
          ingredients: r.ingredients
            ? [...r.ingredients, ingredient]
            : [ingredient],
        }
      : r
  );
};

export const toggleFavoriteLogic = (
  prev: string[],
  name: string
): string[] => {
  return prev.includes(name)
    ? prev.filter(f => f !== name)
    : [...prev, name];
};