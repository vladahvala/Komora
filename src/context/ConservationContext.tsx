import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { configureNotifications, sendExpirationNotification } from '../services/notifications';

// conservation item type
export type ConservationItem = {
  name: string;
  category: string;
  imageUri: string | null;
  history: {
    [year: string]: HistoryItem;
  };  
  isExpiredNotified?: boolean;
};

type HistoryItem = {
  jarCounts: JarCounts;
  period: number; 
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

      let loadedConservations: ConservationItem[] = [];

      if (json) {
        loadedConservations = JSON.parse(json);
      
        // Міграція старого формату (коли history[year] = JarCounts)
        loadedConservations = loadedConservations.map((item: any) => {
          const newHistory: any = {};
      
          Object.entries(item.history || {}).forEach(([year, data]: any) => {
            if (data && typeof data === 'object' && !('jarCounts' in data)) {
              // старий формат
              newHistory[year] = {
                jarCounts: data,
                period: 0
              };
            } else {
              // новий формат
              newHistory[year] = data;
            }
          });
      
          return { ...item, history: newHistory };
        });
      }
      

      const currentYear = new Date().getFullYear();

      const updatedConservations = await Promise.all(
        loadedConservations.map(async (item) => {
          if (!item.history || Object.keys(item.history).length === 0) {
            return item;
          }

          // checking expired (at least 1 year)
          const isExpired = Object.keys(item.history).some(
            (year) => currentYear - Number(year) >= 1
          );

          // if expired - notify
          if (isExpired && !item.isExpiredNotified) {
            console.log('Will send notification for:', item.name);

            await sendExpirationNotification(item.name);

            // Після відправки — ставимо прапорець
            return { ...item, isExpiredNotified: true };
          }

          return item;
        })
      );

      // saving updated array
      setConservations(updatedConservations);
      await AsyncStorage.setItem(
        '@conservations',
        JSON.stringify(updatedConservations)
      );

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
      setLoading(false);
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

  // editing name
  const normalizeName = (name: string) =>
    name
      .trim()
      .replace(/\s+/g, ' ') 
      .toLowerCase();  
  
  // adding new conservation
  const addConservation = async (item: ConservationItem) => {
    try {
      const normalizedName = normalizeName(item.name);

      const existingIndex = conservations.findIndex(
        c => normalizeName(c.name) === normalizedName
      );

      let newList: ConservationItem[];

      if (existingIndex !== -1) {
        // name exists 
        const existingItem = conservations[existingIndex];
        const newHistory = { ...existingItem.history };

        // years from card
        Object.entries(item.history).forEach(([year, newHistoryItem]) => {
          const newJarCounts = newHistoryItem.jarCounts;
          const newPeriod = newHistoryItem.period;

          if (newHistory[year]) {
            newHistory[year] = {
              jarCounts: {
                jar2_3l: newHistory[year].jarCounts.jar2_3l + newJarCounts.jar2_3l,
                jar4_2l: newHistory[year].jarCounts.jar4_2l + newJarCounts.jar4_2l,
                jar7_15l: newHistory[year].jarCounts.jar7_15l + newJarCounts.jar7_15l,
                jar2_1l: newHistory[year].jarCounts.jar2_1l + newJarCounts.jar2_1l,
                jar1_05l: newHistory[year].jarCounts.jar1_05l + newJarCounts.jar1_05l,
              },
              period: newHistory[year].period ?? newPeriod, // <- важливо
            };
          } else {
            newHistory[year] = {
              jarCounts: newJarCounts,
              period: newPeriod,
            };
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
  
        const prevJarCounts = item.history[year]?.jarCounts || {
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
            [year]: {
              jarCounts: newJarCounts,
              period: item.history[year]?.period ?? 0, // <- важливо
            },
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
    const init = async () => {
      await configureNotifications();
      await loadConservations();     
    };

    init();
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

