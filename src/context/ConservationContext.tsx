import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';

// conservation item type
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

// context type
export type ConservationContextType = {
  conservations: ConservationItem[];  // all conservations array
  addConservation: (item: ConservationItem) => void;  // adds new card/updates existed
  loadConservations: () => void;  // loads data from AsyncStorage
  updateJarHistory: (  // updates jar count of a card and a year 
    itemName: string,
    year: string,
    jarCounts: {
      jar2_3l: number;
      jar4_2l: number;
      jar7_15l: number;
      jar2_1l: number;
      jar1_05l: number;
    }
  ) => void;
  updateImage: (itemName: string, newUri: string) => void; // updating card img
  updateCategory: (itemName: string, newCategory: string) => void; // updating card cat
};

// Context
export const ConservationContext = createContext<ConservationContextType>({
  conservations: [],
  addConservation: () => {},
  loadConservations: () => {},
  updateJarHistory: () => {},
  updateImage: () => {},
  updateCategory: () => {},
});

// Custom hook to access the ConservationContext
export const useConservation = () => {
  const context = useContext(ConservationContext);
  if (!context) {
    throw new Error('useConservation must be used within a ConservationProvider');
  }
  return context;
};

type Props = {
  children: ReactNode;
};

// 
export const ConservationProvider = ({ children }: Props) => {
  // array of all conservation cards
  const [conservations, setConservations] = useState<ConservationItem[]>([]);
  // state of loading (from AsyncStorage)
  const [loading, setLoading] = useState(true); 

  // loading from AsyncStorage
  const loadConservations = async () => {
    try {
      const json = await AsyncStorage.getItem('@conservations');
      if (json) {
        setConservations(JSON.parse(json));
      }
    } catch (e) {
      console.error('Failed to load conservations', e);
    } finally {
      setLoading(false); // end of loading
    }
  };

  // adding new conservation
  const addConservation = async (item: ConservationItem) => { // params: new card
    try {
      const existingIndex = conservations.findIndex(
        c => c.name.trim().toLowerCase() === item.name.trim().toLowerCase()
      );
  
      let newList: ConservationItem[];
  
      if (existingIndex !== -1) {
        // name exists 
        const existingItem = conservations[existingIndex];
        const newHistory = { ...existingItem.history };
  
        // years from card
        Object.entries(item.history).forEach(([year, newJars]) => {
          if (newHistory[year]) {
            // if year exists — adding jars
            newHistory[year] = {
              jar2_3l: newHistory[year].jar2_3l + newJars.jar2_3l,
              jar4_2l: newHistory[year].jar4_2l + newJars.jar4_2l,
              jar7_15l: newHistory[year].jar7_15l + newJars.jar7_15l,
              jar2_1l: newHistory[year].jar2_1l + newJars.jar2_1l,
              jar1_05l: newHistory[year].jar1_05l + newJars.jar1_05l,
            };
          } else {
            // if year NOT exists — adding year
            newHistory[year] = newJars;
          }
        });
  
        // new card list
        newList = conservations.map((c, index) =>
          index === existingIndex
            ? { ...c, history: newHistory }
            : c
        );
      } else {
        // adding new card
        newList = [...conservations, item];
      }
  
      // new array in AsyncStorage
      setConservations(newList);
      await AsyncStorage.setItem('@conservations', JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to save conservation', e);
    }
  };

  // updating card img 
  const updateImage = async (itemName: string, newUri: string) => {
    try {
      const newConservations = conservations.map(item =>
        item.name === itemName
          ? { ...item, imageUri: newUri } 
          : item
      );

      setConservations(newConservations);
      await AsyncStorage.setItem('@conservations', JSON.stringify(newConservations));
    } catch (e) {
      console.error('Failed to update image', e);
    }
  };

  // update category
  const updateCategory = async (itemName: string, newCategory: string) => {
    try {
      const newConservations = conservations.map(item =>
        item.name === itemName
          ? { ...item, category: newCategory }
          : item
      );
  
      setConservations(newConservations);
      await AsyncStorage.setItem('@conservations', JSON.stringify(newConservations));
    } catch (e) {
      console.error('Failed to update category', e);
    }
  };
  

  // updating jar count for a year
  const updateJarHistory = async (
    itemName: string,
    year: string,
    jarCounts: {
      jar2_3l: number;
      jar4_2l: number;
      jar7_15l: number;
      jar2_1l: number;
      jar1_05l: number;
    }
  ) => {
    try {
      const newConservations = conservations.map(item => // going through all cards
        item.name === itemName
          ? {
              ...item,
              history: {
                ...item.history,
                [year]: jarCounts,
              },
            }
          : item
      );
  
      setConservations(newConservations);
      await AsyncStorage.setItem('@conservations', JSON.stringify(newConservations));
    } catch (e) {
      console.error('Failed to update jar history', e);
    }
  };
  
  // loads all conservations from AsyncStorage
  useEffect(() => {
    loadConservations();
  }, []);

  if (loading) return null;

  return (
    <ConservationContext.Provider
    value={{ 
      conservations, 
      addConservation, 
      loadConservations, 
      updateJarHistory,
      updateImage,  
      updateCategory, 
    }}
  >
    {children}
  </ConservationContext.Provider>
  
  );
};

