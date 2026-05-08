import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  loadRecipesFromStorage,
  saveRecipesToStorage,
  loadFavoritesFromStorage,
  saveFavoritesToStorage,
} from '../recipesStorageService';

// mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('recipesStorage service', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('loadRecipesFromStorage returns parsed recipes', async () => {
    const mockRecipes = [
      {
        name: 'Cake',
        category: 'Dessert',
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockRecipes)
    );

    const result = await loadRecipesFromStorage();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@recipes');
    expect(result).toEqual(mockRecipes);
  });

  test('loadRecipesFromStorage returns empty array if empty', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const result = await loadRecipesFromStorage();

    expect(result).toEqual([]);
  });

  test('loadRecipesFromStorage handles error', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
      new Error('storage error')
    );

    const result = await loadRecipesFromStorage();

    expect(console.error).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  test('saveRecipesToStorage saves recipes', async () => {
    const mockRecipes = [
      {
        name: 'Cake',
        category: 'Dessert',
      },
    ];

    await saveRecipesToStorage(mockRecipes as any);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@recipes',
      JSON.stringify(mockRecipes)
    );
  });

  test('saveRecipesToStorage handles error', async () => {
    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
      new Error('save error')
    );

    await saveRecipesToStorage([] as any);

    expect(console.error).toHaveBeenCalled();
  });

  test('loadFavoritesFromStorage returns parsed favorites', async () => {
    const mockFavorites = ['Cake'];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockFavorites)
    );

    const result = await loadFavoritesFromStorage();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@favorites');
    expect(result).toEqual(mockFavorites);
  });

  test('loadFavoritesFromStorage returns empty array if empty', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const result = await loadFavoritesFromStorage();

    expect(result).toEqual([]);
  });

  test('loadFavoritesFromStorage handles error', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
      new Error('favorites error')
    );

    const result = await loadFavoritesFromStorage();

    expect(console.error).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  test('saveFavoritesToStorage saves favorites', async () => {
    const mockFavorites = ['Cake'];

    await saveFavoritesToStorage(mockFavorites);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@favorites',
      JSON.stringify(mockFavorites)
    );
  });

  test('saveFavoritesToStorage handles error', async () => {
    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
      new Error('save favorites error')
    );

    await saveFavoritesToStorage([]);

    expect(console.error).toHaveBeenCalled();
  });
});