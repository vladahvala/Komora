import { useState } from 'react';
import { useOthers } from '../../context/OthersContext';

/**
 * Custom hook for managing the "Other" product card page.
 * Handles current product, image updates, history selection,
 * count updates, deletion by date, and saving changes.
 */

const normalizeName = (name: string) => name.trim().replace(/\s+/g, ' ').toLowerCase();

export const useCardOther = (itemName: string) => {
  const { others, updateCount, updateImage, deleteHistory } = useOthers();

  // Find the current product by normalized name
  const currentItem = others.find(o => normalizeName(o.name) === normalizeName(itemName));

  // Get sorted history by date (earliest first)
  const history = currentItem?.history ?? [];
  const sortedHistory = [...history].sort((a, b) => {
    const [d1, m1, y1] = a.date.split('.');
    const [d2, m2, y2] = b.date.split('.');
    return new Date(`${y1}-${m1}-${d1}`).getTime() - new Date(`${y2}-${m2}-${d2}`).getTime();
  });

  // Image URI state
  const [imageUri, setImageUri] = useState<string | null>(currentItem?.imageUri || null);

  // Selected date in history dropdown
  const [selectedDate, setSelectedDate] = useState<string | null>(sortedHistory[0]?.date || null);

  // Dropdown visibility state
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Update image locally and in context
  const handleImageChange = (uri: string) => {
    setImageUri(uri);
    if (currentItem) updateImage(currentItem.name, uri);
  };

  // Delete history entry by date
  const handleDeleteDate = (date: string) => {
    if (!currentItem) return;
    deleteHistory(currentItem.name, date);
    const newHistory = currentItem.history.filter(h => h.date !== date);
    setSelectedDate(newHistory[0]?.date || null);
  };

  // Update count for selected date
  const handleUpdateCount = (count: number) => {
    if (currentItem && selectedDate) updateCount(currentItem.name, count, selectedDate);
  };

  // Save changes (image updates) and optionally call onFinish
  const handleSave = (onFinish?: () => void) => {
    if (currentItem && imageUri) updateImage(currentItem.name, imageUri);
    if (onFinish) onFinish();
  };

  return {
    // Current product
    currentItem,

    // Image state
    imageUri,
    setImageUri,

    // History selection
    selectedDate,
    setSelectedDate,
    sortedHistory,

    // Dropdown
    dropdownVisible,
    setDropdownVisible,

    // Actions
    handleImageChange,
    handleDeleteDate,
    handleUpdateCount,
    handleSave,
  };
};
