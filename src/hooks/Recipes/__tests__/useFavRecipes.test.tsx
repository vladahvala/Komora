import { renderHook, act } from '@testing-library/react-hooks';
import { useFavRecipes } from '../useFavRecipes';
import { RecipesContext } from '../../../context/RecipesContext';
import React from 'react';

const mockRecipes = [
  { name: 'Jam', category: 'Fruits', imageUri: '', recipeText: '' },
  { name: 'Pickles', category: 'Солені', imageUri: '', recipeText: '' },
  { name: 'Apple Jam', category: 'Fruits', imageUri: '', recipeText: '' },
];

const mockFavorites = ['Jam', 'Apple Jam'];

const mockContextValue = {
  recipes: mockRecipes,
  favorites: mockFavorites,
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RecipesContext.Provider value={mockContextValue as any}>
    {children}
  </RecipesContext.Provider>
);

describe('useFavRecipes hook', () => {
  it('filters only favorite recipes', () => {
    const { result } = renderHook(() => useFavRecipes(), { wrapper });

    expect(result.current.filteredFavorites).toHaveLength(2);

    expect(result.current.filteredFavorites.map(r => r.name)).toEqual([
      'Jam',
      'Apple Jam',
    ]);
  });

  it('returns empty array if no favorites match', () => {
    const customWrapper = ({ children }: { children: React.ReactNode }) => (
      <RecipesContext.Provider
        value={{
          recipes: mockRecipes,
          favorites: [],
        } as any}
      >
        {children}
      </RecipesContext.Provider>
    );

    const { result } = renderHook(() => useFavRecipes(), {
      wrapper: customWrapper,
    });

    expect(result.current.filteredFavorites).toEqual([]);
  });

  it('toggles icon state', () => {
    const { result } = renderHook(() => useFavRecipes(), { wrapper });

    expect(result.current.isBigIcon).toBe(true);

    act(() => {
      result.current.toggleIcon();
    });

    expect(result.current.isBigIcon).toBe(false);
  });
});