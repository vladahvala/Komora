import { renderHook, act } from '@testing-library/react';

// mocks
const updateImageMock = jest.fn();
const updateCategoryMock = jest.fn();
const addIngredientMock = jest.fn();
const updateRecipeTextMock = jest.fn();
const toggleFavoriteMock = jest.fn();

jest.mock('../../../context/RecipesContext', () => ({
  useRecipe: () => ({
    recipes: [
      {
        name: 'Cake',
        category: 'Dessert',
        imageUri: 'old.jpg',
        ingredients: [],
        recipeText: 'old text',
      },
    ],
    updateImage: updateImageMock,
    updateCategory: updateCategoryMock,
    addIngredient: addIngredientMock,
    updateRecipeText: updateRecipeTextMock,
    favorites: ['Cake'],
    toggleFavorite: toggleFavoriteMock,
  }),
}));

import { useCardPageRecipe } from '../useCardPageRecipe';

describe('useCardPageRecipe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns current item correctly', () => {
    const { result } = renderHook(() =>
      useCardPageRecipe({
        name: 'Cake',
        category: 'Dessert',
        imageUri: null,
        ingredients: [],
        recipeText: '',
      })
    );

    expect(result.current.currentItem?.name).toBe('Cake');
    expect(result.current.isFavorite).toBe(true);
  });

  test('changeImage updates state and context', () => {
    const { result } = renderHook(() =>
      useCardPageRecipe({
        name: 'Cake',
        category: 'Dessert',
        imageUri: null,
        ingredients: [],
        recipeText: '',
      })
    );

    act(() => {
      result.current.changeImage('new.jpg');
    });

    expect(updateImageMock).toHaveBeenCalledWith('Cake', 'new.jpg');
    expect(result.current.imageUri).toBe('new.jpg');
  });

  test('changeCategory updates category', () => {
    const { result } = renderHook(() =>
      useCardPageRecipe({
        name: 'Cake',
        category: 'Dessert',
        imageUri: null,
        ingredients: [],
        recipeText: '',
      })
    );

    act(() => {
      result.current.changeCategory('Солені');
    });

    expect(updateCategoryMock).toHaveBeenCalledWith(
      'Cake',
      'Солені'
    );

    expect(result.current.selectedCategory).toBe('Солені');
  });

  test('addNewIngredient calls context', () => {
    const { result } = renderHook(() =>
      useCardPageRecipe({
        name: 'Cake',
        category: 'Dessert',
        imageUri: null,
        ingredients: [],
        recipeText: '',
      })
    );

    act(() => {
      result.current.setNewIngredient({
        amount: '2',
        unit: 'ст л',
        name: 'Sugar',
      });
    });

    act(() => {
      result.current.addNewIngredient();
    });

    expect(addIngredientMock).toHaveBeenCalledWith('Cake', {
      amount: '2 ст л',
      name: 'Sugar',
    });
  });

  test('saveRecipeText updates text', () => {
    const { result } = renderHook(() =>
      useCardPageRecipe({
        name: 'Cake',
        category: 'Dessert',
        imageUri: null,
        ingredients: [],
        recipeText: 'old',
      })
    );

    act(() => {
      result.current.saveRecipeText('new text');
    });

    expect(updateRecipeTextMock).toHaveBeenCalledWith(
      'Cake',
      'new text'
    );

    expect(result.current.editableRecipeText).toBe('new text');
  });

  test('toggleFavorite works', () => {
    const { result } = renderHook(() =>
      useCardPageRecipe({
        name: 'Cake',
        category: 'Dessert',
        imageUri: null,
        ingredients: [],
        recipeText: '',
      })
    );

    act(() => {
      result.current.toggleFavorite('Cake');
    });

    expect(toggleFavoriteMock).toHaveBeenCalledWith('Cake');
  });
});