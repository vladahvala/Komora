import { renderHook, act } from '@testing-library/react';

// mock data
const mockRecipes = [
  { name: 'Soup', category: 'Food', imageUri: null, recipeText: '' },
  { name: 'Cake', category: 'Dessert', imageUri: null, recipeText: '' },
];

// MOCK useContext BEFORE importing hook
jest.mock('react', () => {
  const actual = jest.requireActual('react');

  return {
    ...actual,
    useContext: () => ({
      recipes: mockRecipes,
    }),
  };
});

// IMPORTANT: mock whole context module so JSX never executes
jest.mock('../../../context/RecipesContext', () => ({}));

import { useCategoryPageRecipe } from '../useCategoryPageRecipe';

describe('useCategoryPageRecipe', () => {
  test('filters recipes by category', () => {
    const { result } = renderHook(() =>
      useCategoryPageRecipe('Dessert')
    );

    expect(result.current.filteredRecipes).toHaveLength(1);
    expect(result.current.filteredRecipes[0].name).toBe('Cake');
  });

  test('toggle icon works', () => {
    const { result } = renderHook(() =>
      useCategoryPageRecipe('Dessert')
    );

    expect(result.current.isBigIcon).toBe(true);

    act(() => {
      result.current.toggleIcon();
    });

    expect(result.current.isBigIcon).toBe(false);
  });
});