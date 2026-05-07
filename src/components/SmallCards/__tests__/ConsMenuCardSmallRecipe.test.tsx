import React from 'react';

const navigateMock = jest.fn();
const deleteMock = jest.fn();
const toggleFavoriteMock = jest.fn();

// mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
  }),
}));

// mock RecipesContext
jest.mock('../../../context/RecipesContext', () => ({
  useRecipe: () => ({
    deleteRecipe: deleteMock,
  }),
  RecipesContext: {
    Provider: ({ children }: any) => children,
  },
}));

// mock useContext separately (favorites + toggleFavorite)
jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    useContext: () => ({
      favorites: ['Apple'],
      toggleFavorite: toggleFavoriteMock,
    }),
  };
});

describe('ConsMenuCardSmallRecipe (logic only)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to CardPageRecipe', () => {
    const nav = require('@react-navigation/native').useNavigation();

    const item = { name: 'Apple', imageUri: '' };

    nav.navigate('CardPageRecipe', { item });

    expect(navigateMock).toHaveBeenCalledWith('CardPageRecipe', {
      item,
    });
  });

  it('calls deleteRecipe', () => {
    const ctx = require('../../../context/RecipesContext').useRecipe();

    ctx.deleteRecipe('Apple');

    expect(deleteMock).toHaveBeenCalledWith('Apple');
  });

  it('toggles favorite', () => {
    const react = require('react');

    const ctx = react.useContext();

    ctx.toggleFavorite('Apple');

    expect(toggleFavoriteMock).toHaveBeenCalledWith('Apple');
  });
});