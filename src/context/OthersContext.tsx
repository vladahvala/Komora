import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';

const STORAGE_KEY = '@others';

// others item type
export type OthersItem = {
    name: string;
    imageUri: string | null;
    packsCount: number; // num of packs
    date: string; 
};  


// context type
export type OthersContextType = {
    others: OthersItem[];
    addOther: (item: OthersItem) => void;
    loadOthers: () => void;
    updateImage: (itemName: string, newUri: string) => void;
    deleteOther: (itemName: string) => void;
};
  

// Context
export const OthersContext = createContext<OthersContextType>({
    others: [],
    addOther: () => {},
    loadOthers: () => {},
    updateImage: () => {},
    deleteOther: () => {},
  });
  
  export const useOthers = () => {
    const context = useContext(OthersContext);
    if (!context) {
      throw new Error('useOthers must be used within OthersProvider');
    }
    return context;
};

type Props = {
    children: ReactNode;
  };
  
  export const OthersProvider = ({ children }: Props) => {
    const [others, setOthers] = useState<OthersItem[]>([]);
    const [loading, setLoading] = useState(true);
  
    // LOAD
    const loadOthers = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          setOthers(JSON.parse(json));
        }
      } catch (e) {
        console.error('Failed to load others', e);
      } finally {
        setLoading(false);
      }
    };
  
    // ADD
    const addOther = async (item: OthersItem) => {
      try {
        const newList = [...others, item];
        setOthers(newList);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      } catch (e) {
        console.error('Failed to add other', e);
      }
    };
  
    // UPDATE IMAGE
    const updateImage = async (itemName: string, newUri: string) => {
      try {
        const updated = others.map(item =>
          item.name === itemName ? { ...item, imageUri: newUri } : item
        );
  
        setOthers(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update image', e);
      }
    };
  
    // DELETE
    const deleteOther = async (itemName: string) => {
      try {
        const updated = others.filter(item => item.name !== itemName);
        setOthers(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to delete other', e);
      }
    };
  
    useEffect(() => {
      loadOthers();
    }, []);
  
    if (loading) return null;
  
    return (
      <OthersContext.Provider
        value={{
          others,
          addOther,
          loadOthers,
          updateImage,
          deleteOther,
        }}
      >
        {children}
      </OthersContext.Provider>
    );
  };
  