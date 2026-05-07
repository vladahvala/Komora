import { renderHook, act } from '@testing-library/react';

// mock data
const mockRecipes = [
  { name: 'Cake', category: 'Dessert', imageUri: null, recipeText: '' },
  { name: 'Soup', category: 'Food', imageUri: null, recipeText: '' },
];

// mock useContext BEFORE hook import
jest.mock('react', () => {
  const actual = jest.requireActual('react');

  return {
    ...actual,
    useContext: () => ({
      recipes: mockRecipes,
      favorites: ['Cake'],
    }),
  };
});

// IMPORTANT: prevent real context import crash
jest.mock('../../../context/RecipesContext', () => ({
  RecipesContext: {},
}));

import { useFavRecipes } from '../useFavRecipes';

describe('useFavRecipes', () => {
  test('filters favorites correctly', () => {
    const { result } = renderHook(() => useFavRecipes());

    expect(result.current.filteredFavorites).toHaveLength(1);
    expect(result.current.filteredFavorites[0].name).toBe('Cake');
  });

  test('toggle icon works', () => {
    const { result } = renderHook(() => useFavRecipes());

    expect(result.current.isBigIcon).toBe(true);

    act(() => {
      result.current.toggleIcon();
    });

    expect(result.current.isBigIcon).toBe(false);
  });
});