import { renderHook, act } from '@testing-library/react-hooks';
import { useRecipeMain } from '../useRecipeMain';
import { RecipesContext } from '../../../context/RecipesContext';
import React from 'react';

const mockRecipes = [
  { name: 'Apple Jam', category: 'Fruits', imageUri: '', recipeText: '' },
  { name: 'Pickles', category: 'Солені', imageUri: '', recipeText: '' },
  { name: 'Apricot Jam', category: 'Fruits', imageUri: '', recipeText: '' },
];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RecipesContext.Provider
    value={
      {
        recipes: mockRecipes,
        favorites: [],
        addRecipe: jest.fn(),
        toggleFavorite: jest.fn(),
        updateImage: jest.fn(),
        updateCategory: jest.fn(),
        addIngredient: jest.fn(),
        updateRecipeText: jest.fn(),
      } as any
    }
  >
    {children}
  </RecipesContext.Provider>
);

describe('useRecipeMain', () => {
  it('returns all recipes initially', () => {
    const { result } = renderHook(() => useRecipeMain(), { wrapper });

    expect(result.current.filteredRecipes).toHaveLength(3);
  });

  it('filters recipes by search text', () => {
    const { result } = renderHook(() => useRecipeMain(), { wrapper });

    act(() => {
      result.current.setSearchText('jam');
    });

    expect(result.current.filteredRecipes).toHaveLength(2);
    expect(result.current.filteredRecipes.map(r => r.name)).toEqual([
      'Apple Jam',
      'Apricot Jam',
    ]);
  });

  it('toggles icon state', () => {
    const { result } = renderHook(() => useRecipeMain(), { wrapper });

    expect(result.current.isBigIcon).toBe(true);

    act(() => {
      result.current.toggleIcon();
    });

    expect(result.current.isBigIcon).toBe(false);
  });
});