import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@others';

export const loadOthersFromStorage = async () => {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
};

export const saveOthersToStorage = async (data: any) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
