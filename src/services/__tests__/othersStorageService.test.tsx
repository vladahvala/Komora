import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  loadOthersFromStorage,
  saveOthersToStorage,
} from '../othersStorageService';

// mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('othersStorage service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loadOthersFromStorage returns parsed data', async () => {
    const mockData = [{ name: 'Item1' }];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockData)
    );

    const result = await loadOthersFromStorage();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@others');
    expect(result).toEqual(mockData);
  });

  test('loadOthersFromStorage returns empty array if storage empty', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const result = await loadOthersFromStorage();

    expect(result).toEqual([]);
  });

  test('saveOthersToStorage saves data correctly', async () => {
    const mockData = [{ name: 'Item1' }];

    await saveOthersToStorage(mockData);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@others',
      JSON.stringify(mockData)
    );
  });
});