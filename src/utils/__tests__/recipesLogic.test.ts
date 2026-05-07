import {
    addRecipeLogic,
    deleteRecipeLogic,
    updateImageLogic,
    updateCategoryLogic,
    updateRecipeTextLogic,
    addIngredientLogic,
    toggleFavoriteLogic
  } from '../recipesLogic';
  
  import { RecipeItem } from '../../context/RecipesContext';
  
  const mockRecipe: RecipeItem = {
    name: 'Soup',
    category: 'Food',
    imageUri: null,
    recipeText: 'Boil water',
    ingredients: [],
  };
  
  describe('recipesLogic', () => {
  
    test('addRecipeLogic adds new recipe if not exists', () => {
      const result = addRecipeLogic([], mockRecipe);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Soup');
    });
  
    test('addRecipeLogic does not duplicate recipe', () => {
      const result = addRecipeLogic([mockRecipe], mockRecipe);
      expect(result).toHaveLength(1);
    });
  
    test('deleteRecipeLogic removes recipe', () => {
      const result = deleteRecipeLogic([mockRecipe], 'Soup');
      expect(result).toHaveLength(0);
    });
  
    test('updateImageLogic updates imageUri', () => {
      const result = updateImageLogic([mockRecipe], 'Soup', 'new-url');
  
      expect(result[0].imageUri).toBe('new-url');
    });
  
    test('updateCategoryLogic updates category', () => {
      const result = updateCategoryLogic([mockRecipe], 'Soup', 'Dessert');
  
      expect(result[0].category).toBe('Dessert');
    });
  
    test('updateRecipeTextLogic updates text', () => {
      const result = updateRecipeTextLogic([mockRecipe], 'Soup', 'New text');
  
      expect(result[0].recipeText).toBe('New text');
    });
  
    test('addIngredientLogic adds ingredient', () => {
      const result = addIngredientLogic(
        [mockRecipe],
        'Soup',
        { name: 'Salt', amount: '1 tsp' }
      );
  
      expect(result[0].ingredients?.length).toBe(1);
      expect(result[0].ingredients?.[0].name).toBe('Salt');
    });
  
    test('toggleFavoriteLogic adds favorite', () => {
      const result = toggleFavoriteLogic([], 'Soup');
      expect(result).toContain('Soup');
    });
  
    test('toggleFavoriteLogic removes favorite', () => {
      const result = toggleFavoriteLogic(['Soup'], 'Soup');
      expect(result).not.toContain('Soup');
    });
  
  });