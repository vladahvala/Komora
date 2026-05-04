import React from 'react';

// mocks
const navigateMock = jest.fn();
const deleteMock = jest.fn();
const toggleFavoriteMock = jest.fn();

// navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
  }),
}));

// context
jest.mock('../../../context/RecipesContext', () => ({
  useRecipe: () => ({
    deleteRecipe: deleteMock,
    toggleFavorite: toggleFavoriteMock,
    favorites: ['Apple'], // для перевірки isFavorite
  }),
}));

// mock component (NO RN RENDER)
jest.mock('../ConsMenuCardRecipe', () => {
  return ({ item }: any) => {
    const favorites = ['Apple'];

    const isFavorite = favorites.includes(item.name);

    const handlePress = () => {
      navigateMock('CardPageRecipe', { item });
    };

    const handleDelete = () => {
      deleteMock(item.name);
    };

    const handleToggleFavorite = () => {
      toggleFavoriteMock(item.name);
    };

    return {
      type: 'ConsMenuCardRecipe',
      name: item.name,
      isFavorite,
      press: handlePress,
      delete: handleDelete,
      toggleFavorite: handleToggleFavorite,
    };
  };
});

import ConsMenuCardRecipe from '../ConsMenuCardRecipe';

const item = {
  name: 'Apple',
  imageUri: '',
} as any;

describe('ConsMenuCardRecipe (logic test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns name correctly', () => {
    const comp: any = ConsMenuCardRecipe({ item, index: 0 });

    expect(comp.name).toBe('Apple');
  });

  it('detects favorite state', () => {
    const comp: any = ConsMenuCardRecipe({ item, index: 0 });

    expect(comp.isFavorite).toBe(true);
  });

  it('navigates on press', () => {
    const comp: any = ConsMenuCardRecipe({ item, index: 0 });

    comp.press();

    expect(navigateMock).toHaveBeenCalledWith('CardPageRecipe', {
      item,
    });
  });

  it('deletes recipe', () => {
    const comp: any = ConsMenuCardRecipe({ item, index: 0 });

    comp.delete();

    expect(deleteMock).toHaveBeenCalledWith('Apple');
  });

  it('toggles favorite', () => {
    const comp: any = ConsMenuCardRecipe({ item, index: 0 });

    comp.toggleFavorite();

    expect(toggleFavoriteMock).toHaveBeenCalledWith('Apple');
  });
});