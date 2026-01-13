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

// type for empty jars
type JarCounts = {
  jar2_3l: number;
  jar4_2l: number;
  jar7_15l: number;
  jar2_1l: number;
  jar1_05l: number;
};

// context type
export type ConservationContextType = {
  conservations: ConservationItem[];  // all conservations array
  emptyJars: JarCounts; // array of empty jars
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
  deleteConservation: (itemName: string) => void; // delete card
  updateEmptyJars: (newCounts: JarCounts) => void; // updating empty jars count 
};

// Context
export const ConservationContext = createContext<ConservationContextType>({
  conservations: [],
  emptyJars: {
    jar2_3l: 0,
    jar4_2l: 0,
    jar7_15l: 0,
    jar2_1l: 0,
    jar1_05l: 0,
  },  
  addConservation: () => {},
  loadConservations: () => {},
  updateJarHistory: () => {},
  updateImage: () => {},
  updateCategory: () => {},
  deleteConservation: () => {},
  updateEmptyJars: () => {},
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

  // array of empty jars
  const [emptyJars, setEmptyJars] = useState<JarCounts>({
    jar2_3l: 0,
    jar4_2l: 0,
    jar7_15l: 0,
    jar2_1l: 0,
    jar1_05l: 0,
  });
  
  // loading from AsyncStorage
  const loadConservations = async () => {
    try {
      const json = await AsyncStorage.getItem('@conservations');
      if (json) {
        setConservations(JSON.parse(json));
      }

      // empty jars 
      const empty = await AsyncStorage.getItem('@emptyJars');
      if (empty) {
        setEmptyJars(JSON.parse(empty));
      } else {
        await AsyncStorage.setItem(
          '@emptyJars',
          JSON.stringify({
            jar2_3l: 0,
            jar4_2l: 0,
            jar7_15l: 0,
            jar2_1l: 0,
            jar1_05l: 0,
          })
        );
      }
    } catch (e) {
      console.error('Failed to load conservations', e);
    } finally {
      setLoading(false); // end of loading
    }
  };

  // deleting card
  const deleteConservation = async (itemName: string) => {
    try {
      const newConservations = conservations.filter(
        item => item.name !== itemName
      );
  
      setConservations(newConservations);
      await AsyncStorage.setItem(
        '@conservations',
        JSON.stringify(newConservations)
      );
    } catch (e) {
      console.error('Failed to delete conservation', e);
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

  // updating empty jar count
  const updateEmptyJars = async (newCounts: JarCounts) => {
    setEmptyJars(newCounts);
    await AsyncStorage.setItem('@emptyJars', JSON.stringify(newCounts));
  };
  
  // updating jar count for a year
  const updateJarHistory = async (
    itemName: string,
    year: string,
    newJarCounts: JarCounts
  ) => {
    try {
      let jarsToReturn: JarCounts = {
        jar2_3l: 0,
        jar4_2l: 0,
        jar7_15l: 0,
        jar2_1l: 0,
        jar1_05l: 0,
      };
  
      const newConservations = conservations.map(item => {
        if (item.name !== itemName) return item;
  
        const prevJarCounts = item.history[year] || {
          jar2_3l: 0,
          jar4_2l: 0,
          jar7_15l: 0,
          jar2_1l: 0,
          jar1_05l: 0,
        };
  
        // counting the diff between jar arrays
        (Object.keys(prevJarCounts) as (keyof JarCounts)[]).forEach(key => {
          const diff = prevJarCounts[key] - newJarCounts[key];
          if (diff > 0) {
            jarsToReturn[key] = diff;
          }
        });
  
        return {
          ...item,
          history: {
            ...item.history,
            [year]: newJarCounts,
          },
        };
      });
  
      // adding jars to empty
      setEmptyJars(prev => {
        const updated = {
          jar2_3l: prev.jar2_3l + jarsToReturn.jar2_3l,
          jar4_2l: prev.jar4_2l + jarsToReturn.jar4_2l,
          jar7_15l: prev.jar7_15l + jarsToReturn.jar7_15l,
          jar2_1l: prev.jar2_1l + jarsToReturn.jar2_1l,
          jar1_05l: prev.jar1_05l + jarsToReturn.jar1_05l,
        };
      
        AsyncStorage.setItem('@emptyJars', JSON.stringify(updated));
        return updated;
      });
  
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
      emptyJars,
      addConservation, 
      loadConservations, 
      updateJarHistory,
      updateImage,  
      updateCategory, 
      deleteConservation, 
      updateEmptyJars, 
    }}
  >
    {children}
  </ConservationContext.Provider>
  
  );
};

