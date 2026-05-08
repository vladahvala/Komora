import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  loadConservationsFromStorage,
  saveConservationsToStorage,
  loadEmptyJarsFromStorage,
  saveEmptyJarsToStorage,
} from '../storageService';

// mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('conservationStorage service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loadConservationsFromStorage returns parsed data', async () => {
    const mockData = [
      { name: 'Jam', period: 2 },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockData)
    );

    const result = await loadConservationsFromStorage();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@conservations');
    expect(result).toEqual(mockData);
  });

  test('loadConservationsFromStorage returns empty array if no data', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const result = await loadConservationsFromStorage();

    expect(result).toEqual([]);
  });

  test('saveConservationsToStorage saves data correctly', async () => {
    const mockData = [{ name: 'Jam', period: 2 }];

    await saveConservationsToStorage(mockData as any);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@conservations',
      JSON.stringify(mockData)
    );
  });

  test('loadEmptyJarsFromStorage returns parsed jars', async () => {
    const mockJars = {
      jar2_3l: 1,
      jar4_2l: 2,
      jar7_15l: 0,
      jar2_1l: 3,
      jar1_05l: 5,
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockJars)
    );

    const result = await loadEmptyJarsFromStorage();

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@emptyJars');
    expect(result).toEqual(mockJars);
  });

  test('loadEmptyJarsFromStorage returns default object if empty', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const result = await loadEmptyJarsFromStorage();

    expect(result).toEqual({
      jar2_3l: 0,
      jar4_2l: 0,
      jar7_15l: 0,
      jar2_1l: 0,
      jar1_05l: 0,
    });
  });

  test('saveEmptyJarsToStorage saves jars correctly', async () => {
    const mockJars = {
      jar2_3l: 1,
      jar4_2l: 2,
      jar7_15l: 0,
      jar2_1l: 3,
      jar1_05l: 5,
    };

    await saveEmptyJarsToStorage(mockJars);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@emptyJars',
      JSON.stringify(mockJars)
    );
  });
});