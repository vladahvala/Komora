import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';
import { useCategoryPageRecipe } from '../useCategoryPageRecipe';
import { RecipesContext } from '../../../context/RecipesContext';
import type { RecipesContextType } from '../../../context/RecipesContext';

const mockRecipes = [
  {
    name: 'Jam',
    category: 'Fruits',
    imageUri: '',
    recipeText: '',
  },
  {
    name: 'Pickles',
    category: 'Солені',
    imageUri: '',
    recipeText: '',
  },
  {
    name: 'Apple Jam',
    category: 'Fruits',
    imageUri: '',
    recipeText: '',
  },
];

const contextValue: RecipesContextType = {
  recipes: mockRecipes,
  favorites: [],
  addRecipe: jest.fn(),
  toggleFavorite: jest.fn(),
  updateImage: jest.fn(),
  updateCategory: jest.fn(),
  addIngredient: jest.fn(),
  updateRecipeText: jest.fn(),
  deleteRecipe: jest.fn(),
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RecipesContext.Provider value={contextValue}>
    {children}
  </RecipesContext.Provider>
);

describe('useCategoryPageRecipe', () => {
  it('filters recipes by category (case insensitive)', () => {
    const { result } = renderHook(
      () => useCategoryPageRecipe('fruits'),
      { wrapper }
    );

    expect(result.current.filteredRecipes).toHaveLength(2);
    expect(result.current.filteredRecipes.map(r => r.name)).toEqual([
      'Jam',
      'Apple Jam',
    ]);
  });

  it('returns empty array if no matches', () => {
    const { result } = renderHook(
      () => useCategoryPageRecipe('non-existing'),
      { wrapper }
    );

    expect(result.current.filteredRecipes).toEqual([]);
  });

  it('toggles icon state', () => {
    const { result } = renderHook(
      () => useCategoryPageRecipe('Fruits'),
      { wrapper }
    );

    expect(result.current.isBigIcon).toBe(true);

    act(() => {
      result.current.toggleIcon();
    });

    expect(result.current.isBigIcon).toBe(false);
  });
});