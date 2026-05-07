import { renderHook, act } from '@testing-library/react';

// mock data
const mockRecipes = [
  { name: 'Cake', category: 'Dessert', imageUri: null, recipeText: '' },
  { name: 'Soup', category: 'Food', imageUri: null, recipeText: '' },
];

// IMPORTANT: mock BEFORE importing hook
jest.mock('react', () => {
  const actual = jest.requireActual('react');

  return {
    ...actual,
    useContext: () => ({
      recipes: mockRecipes,
    }),
  };
});

// avoid JSX crash from context file
jest.mock('../../../context/RecipesContext', () => ({
  RecipesContext: {},
}));

import { useRecipeMain } from '../useRecipeMain';

describe('useRecipeMain', () => {
  test('returns all recipes initially', () => {
    const { result } = renderHook(() => useRecipeMain());

    expect(result.current.filteredRecipes).toHaveLength(2);
  });

  test('filters by search text', () => {
    const { result } = renderHook(() => useRecipeMain());

    act(() => {
      result.current.setSearchText('Cake');
    });

    expect(result.current.filteredRecipes).toHaveLength(1);
    expect(result.current.filteredRecipes[0].name).toBe('Cake');
  });

  test('toggle icon works', () => {
    const { result } = renderHook(() => useRecipeMain());

    expect(result.current.isBigIcon).toBe(true);

    act(() => {
      result.current.toggleIcon();
    });

    expect(result.current.isBigIcon).toBe(false);
  });
});