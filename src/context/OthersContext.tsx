import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@others';

export type OthersItem = {
  name: string;
  imageUri: string | null;
  totalCount: number; // сума всіх count
  history: { date: string; count: number }[];
};

export type OthersContextType = {
  others: OthersItem[];
  loading: boolean;
  addOther: (item: { name: string; imageUri: string | null; count: number; date: string }) => Promise<void>;
  loadOthers: () => Promise<void>;
  updateImage: (itemName: string, newUri: string) => Promise<void>;
  deleteOther: (itemName: string) => Promise<void>;
  updateCount: (itemName: string, newCount: number, date?: string) => Promise<void>;
  updateDate: (itemName: string, oldDate: string, newDate: string) => Promise<void>;
  deleteHistory: (itemName: string, date: string)  => Promise<void>;
};

export const OthersContext = createContext<OthersContextType>({
  others: [],
  loading: false,
  addOther: async () => {},
  loadOthers: async () => {},
  updateImage: async () => {},
  deleteOther: async () => {},
  updateCount: async () => {},
  updateDate: async () => {},
  deleteHistory: async () => {},
});

export const useOthers = () => {
  const context = useContext(OthersContext);
  if (!context) {
    throw new Error('useOthers must be used within OthersProvider');
  }
  return context;
};

type Props = { children: ReactNode };

export const OthersProvider = ({ children }: Props) => {
  const [others, setOthers] = useState<OthersItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOthers = async (): Promise<void> => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) setOthers(JSON.parse(json));
    } catch (e) {
      console.error('Failed to load others', e);
    } finally {
      setLoading(false);
    }
  };

  const normalizeName = (name: string) =>
    name.trim().replace(/\s+/g, ' ').toLowerCase();

  const addOther = async (item: {
    name: string;
    imageUri: string | null;
    count: number;
    date: string;
  }) => {
    try {
      const normalizedNewName = normalizeName(item.name);
  
      setOthers(prev => {
        let foundName = false;
  
        const updated: OthersItem[] = prev.map(p => {
          if (normalizeName(p.name) === normalizedNewName) {
            foundName = true;
  
            // перевіряємо, чи є запис з такою датою
            let foundDate = false;
            const newHistory = (p.history ?? []).map(h => {
              if (h.date === item.date) {
                foundDate = true;
                return { ...h, count: (h.count ?? 0) + (item.count ?? 0) }; // додаємо до існуючої кількості
              }
              return h; // інші записи без змін
            });
  
            // якщо такої дати ще немає — додаємо новий рядок
            if (!foundDate) {
              newHistory.push({ date: item.date, count: item.count ?? 0 });
            }
  
            // перераховуємо totalCount
            const totalCount = newHistory.reduce((sum, h) => sum + (h.count ?? 0), 0);
  
            return {
              ...p,
              history: newHistory,
              totalCount,
              // НЕ міняємо imageUri, якщо продукт вже існує
            };
          }
          return p;
        });
  
        // якщо продукту ще немає — додаємо новий
        if (!foundName) {
          updated.push({
            name: item.name.trim(),
            imageUri: item.imageUri,
            totalCount: item.count ?? 0,
            history: [{ date: item.date, count: item.count ?? 0 }],
          });
        }
  
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
  
        return updated;
      });
    } catch (e) {
      console.error('Failed to add/update other', e);
    }
  };
  

  const updateImage = async (itemName: string, newUri: string) => {
    try {
      setOthers(prev => {
        const updated = prev.map(item =>
          normalizeName(item.name) === normalizeName(itemName) ? { ...item, imageUri: newUri } : item
        );
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
        return updated;
      });
    } catch (e) {
      console.error('Failed to update image', e);
    }
  };

  const deleteOther = async (itemName: string) => {
    try {
      const updated = others.filter(item => normalizeName(item.name) !== normalizeName(itemName));
      setOthers(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete other', e);
    }
  };

  const deleteHistory = async (itemName: string, date: string) => {
    try {
      setOthers(prev => {
        const updated = prev.map(item => {
          if (normalizeName(item.name) === normalizeName(itemName)) {
            const newHistory = item.history.filter(h => h.date !== date);
            const totalCount = newHistory.reduce((sum, h) => sum + Number(h.count ?? 0), 0);
            return { ...item, history: newHistory, totalCount };
          }
          return item;
        });
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
        return updated;
      });
    } catch (e) {
      console.error('Failed to delete history', e);
    }
  };
  

  const updateCount = async (itemName: string, newCount: number, date?: string) => {
    try {
      setOthers(prev => {
        const updated = prev.map(item => {
          if (normalizeName(item.name) === normalizeName(itemName)) {
            let newHistory = item.history.map(h => ({ ...h, count: Number(h.count ?? 0) }));
            if (date) {
              newHistory = newHistory.map(h =>
                h.date === date ? { ...h, count: Number(newCount ?? 0) } : h
              );
            }
            const totalCount = newHistory.reduce((sum, h) => sum + Number(h.count ?? 0), 0);
            return { ...item, history: newHistory, totalCount };
          }
          return item;
        });

        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
        return updated;
      });
    } catch (e) {
      console.error('Failed to update count', e);
    }
  };

  const updateDate = async (itemName: string, oldDate: string, newDate: string) => {
    try {
      setOthers(prev => {
        const updated = prev.map(item => {
          if (normalizeName(item.name) === normalizeName(itemName)) {
            const newHistory = item.history?.map(h =>
              h.date === oldDate ? { ...h, date: newDate } : h
            ) ?? [];
            return { ...item, history: newHistory };
          }
          return item;
        });

        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
        return updated;
      });
    } catch (e) {
      console.error('Failed to update date', e);
    }
  };

  useEffect(() => {
    loadOthers();
  }, []);

  return (
    <OthersContext.Provider
      value={{
        others,
        loading,
        addOther,
        loadOthers,
        updateImage,
        deleteOther,
        updateCount,
        updateDate,
        deleteHistory,
      }}
    >
      {children}
    </OthersContext.Provider>
  );
};
