import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConservationItem, JarCounts } from '../context/ConservationContext';

const CONSERVATIONS_KEY = '@conservations';
const EMPTY_JARS_KEY = '@emptyJars';

export const loadConservationsFromStorage = async (): Promise<ConservationItem[]> => {
  const json = await AsyncStorage.getItem(CONSERVATIONS_KEY);
  if (!json) return [];
  return JSON.parse(json);
};

export const saveConservationsToStorage = async (items: ConservationItem[]) => {
  await AsyncStorage.setItem(CONSERVATIONS_KEY, JSON.stringify(items));
};

export const loadEmptyJarsFromStorage = async (): Promise<JarCounts> => {
  const json = await AsyncStorage.getItem(EMPTY_JARS_KEY);
  if (!json) return { jar2_3l:0, jar4_2l:0, jar7_15l:0, jar2_1l:0, jar1_05l:0 };
  return JSON.parse(json);
};

export const saveEmptyJarsToStorage = async (jars: JarCounts) => {
  await AsyncStorage.setItem(EMPTY_JARS_KEY, JSON.stringify(jars));
};
