import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useContext } from 'react';
import { configureNotifications, sendExpirationNotification } from '../services/notifications';
import { 
  loadConservationsFromStorage, 
  saveConservationsToStorage,
  loadEmptyJarsFromStorage,
  saveEmptyJarsToStorage 
} from '../services/storageService';

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
  notified?: boolean;
};

// type for empty jars
export type JarCounts = {
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
      let loadedConservations = await loadConservationsFromStorage();
  
      // Міграція старого формату
      loadedConservations = loadedConservations.map((item: any) => {
        const newHistory: any = {};
  
        Object.entries(item.history || {}).forEach(([year, data]: any) => {
          if (data && typeof data === 'object' && !('jarCounts' in data)) {
            newHistory[year] = {
              jarCounts: data,
              period: 0,
              notified: false,
            };
          } else {
            newHistory[year] = data;
          }
        });
  
        return { ...item, history: newHistory };
      });
  
      const updatedConservations = await Promise.all(
        loadedConservations.map(async (item) => {
          if (!item.history) return item;
  
          const updatedHistory = { ...item.history };
  
          for (const [year, data] of Object.entries(item.history)) {
            const period = data.period ?? 0;
  
            const startDate = new Date(Number(year), 0, 1);
            const expirationDate = new Date(startDate);
            expirationDate.setFullYear(expirationDate.getFullYear() + period);
  
            if (new Date() >= expirationDate && !data.notified) {
              await sendExpirationNotification(item.name);
  
              updatedHistory[year] = {
                ...data,
                notified: true,
              };
            }
          }
  
          return { ...item, history: updatedHistory };
        })
      );
  
      setConservations(updatedConservations);
      await saveConservationsToStorage(updatedConservations);
  
      const empty = await loadEmptyJarsFromStorage();
      setEmptyJars(empty);
  
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
      await saveConservationsToStorage(newConservations);
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
              notified: false,
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
      await saveConservationsToStorage(newList);
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
      await saveConservationsToStorage(newConservations);
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
      await saveConservationsToStorage(newConservations);
    } catch (e) {
      console.error('Failed to update category', e);
    }
  };

  // updating empty jar count
  const updateEmptyJars = async (newCounts: JarCounts) => {
    setEmptyJars(newCounts);
    await saveEmptyJarsToStorage(newCounts);
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
  
        // diff
        (Object.keys(prevJarCounts) as (keyof JarCounts)[]).forEach(key => {
          const diff = prevJarCounts[key] - newJarCounts[key];
          if (diff > 0) {
            jarsToReturn[key] = diff;
          }
        });
  
        // перевірка: чи всі банки = 0
        const allZero = Object.values(newJarCounts).every(v => v === 0);
  
        // якщо всі 0 -> видаляємо рік з history
        const updatedHistory = { ...item.history };
        if (allZero) {
          delete updatedHistory[year];
        } else {
          updatedHistory[year] = {
            jarCounts: newJarCounts,
            period: item.history[year]?.period ?? 0,
            notified: item.history[year]?.notified ?? false,
          };
        }
  
        return {
          ...item,
          history: updatedHistory,
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
  
        saveEmptyJarsToStorage(updated);
        return updated;
      });
  
      setConservations(newConservations);
      await saveConservationsToStorage(newConservations);
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

