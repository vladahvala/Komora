import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Тип для одного елементу консервації
export type ConservationItem = {
  name: string;
  category: string;
  imageUri: string | null;
  history: {
    [year: string]: {
      jar2_3l: number;
      jar4_2l: number;
      jar7_15l: number;
      jar2_1l: number;
      jar1_05l: number;
    };
  };
};


// Тип контексту
export type ConservationContextType = {
  conservations: ConservationItem[];
  addConservation: (item: ConservationItem) => void;
  loadConservations: () => void;
};

// Контекст
export const ConservationContext = createContext<ConservationContextType>({
  conservations: [],
  addConservation: () => {},
  loadConservations: () => {},
});

type Props = {
  children: ReactNode;
};

export const ConservationProvider = ({ children }: Props) => {
  const [conservations, setConservations] = useState<ConservationItem[]>([]);
  const [loading, setLoading] = useState(true); // щоб чекати завантаження

  // Завантаження з AsyncStorage
  const loadConservations = async () => {
    try {
      const json = await AsyncStorage.getItem('@conservations');
      if (json) {
        setConservations(JSON.parse(json));
      }
    } catch (e) {
      console.error('Failed to load conservations', e);
    } finally {
      setLoading(false); // закінчили завантаження
    }
  };

  // Додавання нової консервації
  const addConservation = async (item: ConservationItem) => {
    try {
      const newList = [...conservations, item];
      setConservations(newList);
      await AsyncStorage.setItem('@conservations', JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to save conservation', e);
    }
  };

  useEffect(() => {
    loadConservations();
  }, []);

  // Поки завантажуємо — можна повернути null або спіннер
  if (loading) return null;

  return (
    <ConservationContext.Provider
      value={{ conservations, addConservation, loadConservations }}
    >
      {children}
    </ConservationContext.Provider>
  );
};
