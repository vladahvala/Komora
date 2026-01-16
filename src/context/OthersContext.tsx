import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@others';

export type OthersItem = {
  name: string;
  imageUri: string | null;
  packsCount: number;
  date: string;
};

export type OthersContextType = {
  others: OthersItem[];
  loading: boolean;
  addOther: (item: OthersItem) => Promise<void>;
  loadOthers: () => Promise<void>;
  updateImage: (itemName: string, newUri: string) => Promise<void>;
  deleteOther: (itemName: string) => Promise<void>;
  updateCount: (itemName: string, newCount: number) => Promise<void>;
  updateDate: (itemName: string, newDate: string) => Promise<void>;
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

  const addOther = async (item: OthersItem) => {
    try {
      setOthers(prev => {
        const newList = [...prev, item];
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList)).catch(e =>
          console.error('Failed to save new other', e)
        );
        return newList;
      });
    } catch (e) {
      console.error('Failed to add other', e);
    }
  };
  
  

  const updateImage = async (itemName: string, newUri: string) => {
    try {
      setOthers(prev => {
        const updated = prev.map(item =>
          item.name === itemName ? { ...item, imageUri: newUri } : item
        );
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(e =>
          console.error('Failed to save updated image', e)
        );
        return updated;
      });
    } catch (e) {
      console.error('Failed to update image', e);
    }
  };
  
  const deleteOther = async (itemName: string): Promise<void> => {
    try {
      const updated = others.filter(item => item.name !== itemName);
      setOthers(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete other', e);
    }
  };

  const updateCount = async (itemName: string, newCount: number) => {
    try {
      setOthers(prev => {
        const updated = prev.map(item =>
          item.name === itemName ? { ...item, packsCount: newCount } : item
        );
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(e =>
          console.error('Failed to save updated count', e)
        );
        return updated;
      });
    } catch (e) {
      console.error('Failed to update count', e);
    }
  };
  

  // в OthersProvider додати:
  const updateDate = async (itemName: string, newDate: string) => {
    try {
      setOthers(prev => {
        const updated = prev.map(item =>
          item.name === itemName ? { ...item, date: newDate } : item
        );
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
      }}
    >
      {children}
    </OthersContext.Provider>
  );
};
