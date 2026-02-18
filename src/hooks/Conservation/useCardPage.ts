import { useState, useMemo } from 'react';
import { useConservation } from '../../context/ConservationContext';
import { useJarManager } from './useJarManager';

/**
 * Custom hook for managing state and actions on the CardPage.
 * Handles the current conservation item, category selection, image updates,
 * available years, saving changes, and integrates jar management via useJarManager.
 */

export const useCardPage = (item: any) => {
  const { conservations, updateJarHistory, updateImage } = useConservation();

  // look for currentItem
  const currentItem = useMemo(() => {
    return conservations.find(c => c.name === item.name);
  }, [conservations, item.name]);

  // add Jar Manager
  const jarManager = useJarManager(currentItem);

  // CATEGORY
  const [selectedCategory, setSelectedCategory] = useState<string>(
    item.category
  );
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);

  // IMAGE
  const [imageUri, setImageUri] = useState<string | null>(item.imageUri || null);

  // Dropdown control
  const [openDropdown, setOpenDropdown] = useState<null | 'category' | 'year'>(null);

  // list of available Years 
  const availableYears = useMemo(() => {
    return currentItem
      ? Object.keys(currentItem.history).sort((a, b) => Number(a) - Number(b))
      : [];
  }, [currentItem]);

  // Image Update
  const handleImageChange = (uri: string) => {
    setImageUri(uri);
    if (currentItem) updateImage(currentItem.name, uri);
  };

  // save changes
  const handleSave = (navigation: any) => {
    if (!currentItem) return;

    updateJarHistory(currentItem.name, jarManager.selectedYear, jarManager.jarCounts);

    // clear drafts
    jarManager.setDrafts(d => {
      const copy = { ...d };
      delete copy[jarManager.selectedYear];
      return copy;
    });

    navigation.goBack();
  };

  return {
    // Current Item
    currentItem,
  
    // Category Selection
    selectedCategory,
    setSelectedCategory,
    categoryDropdownVisible,
    setCategoryDropdownVisible,
  
    // Image Handling 
    imageUri,
    handleImageChange,
  
    // Years 
    availableYears,
  
    // Save Action 
    handleSave,
  
    // Jar Management (from useJarManager)
    ...jarManager,
  
    // Dropdown Control 
    openDropdown,
    setOpenDropdown,
  };
};
