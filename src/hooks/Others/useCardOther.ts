import { useState, useEffect  } from 'react';
import { useOthers } from '../../context/OthersContext';

/**
 * Custom hook for managing the "Other" product card page.
 * Handles current product, image updates, history selection,
 * count updates, deletion by date, and saving changes.
 */

const normalizeName = (name: string) => name.trim().replace(/\s+/g, ' ').toLowerCase();

export const useCardOther = (itemName: string) => {
  const { 
    others, 
    updateCount, 
    updateImage, 
    deleteHistory,
    deleteOther
  } = useOthers();

    // Find the current product by normalized name
    const currentItem = others.find(o => normalizeName(o.name) === normalizeName(itemName));

  const history = currentItem?.history ?? [];

  const [draftHistory, setDraftHistory] = useState(history);
  // Get sorted history by date (earliest first)

  const sortedHistory = [...draftHistory].sort((a, b) => {
    const [d1, m1, y1] = a.date.split('.');
    const [d2, m2, y2] = b.date.split('.');
    return new Date(`${y1}-${m1}-${d1}`).getTime() -
           new Date(`${y2}-${m2}-${d2}`).getTime();
  });

  // Image URI state
  const [imageUri, setImageUri] = useState<string | null>(currentItem?.imageUri || null);

  // Selected date in history dropdown
  const [selectedDate, setSelectedDate] = useState<string | null>(sortedHistory[0]?.date || null);

  // Dropdown visibility state
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const editedTotal = draftHistory.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const editedCount =
  draftHistory.find(h => h.date === selectedDate)?.count ?? 0;

  useEffect(() => {
    if (!currentItem) return;
  
    setDraftHistory(currentItem.history);
  
    setSelectedDate(currentItem.history[0]?.date || null);
  
    setImageUri(currentItem.imageUri || null);
  }, [currentItem]);

  // Update image locally and in context
  const handleImageChange = (uri: string) => {
    setImageUri(uri);
  };

  // Delete history entry by date
  const handleDeleteDate = (date: string) => {
    if (!currentItem) return;
  
    const updated = draftHistory.filter(h => h.date !== date);
  
    setDraftHistory(updated);
  
    setSelectedDate(updated[0]?.date || null);

  };
  // Update count for selected date
  const handleUpdateCount = (count: number) => {
    if (!selectedDate) return;
  
    setDraftHistory(prev =>
      prev.map(h =>
        h.date === selectedDate ? { ...h, count } : h
      )
    );
  };

  // Save changes (image updates) and optionally call onFinish
  const handleSave = (onFinish?: () => void) => {
    if (!currentItem) return;
  
    // якщо всього 0 — видаляємо всю картку
    if (editedTotal <= 0) {
      deleteOther(currentItem.name);
  
      if (onFinish) onFinish();
      return;
    }
  
    if (imageUri) {
      updateImage(currentItem.name, imageUri);
    }
  
    // видаляємо дати яких більше нема
    currentItem.history.forEach(h => {
      const stillExists = draftHistory.find(d => d.date === h.date);
  
      if (!stillExists) {
        deleteHistory(currentItem.name, h.date);
      }
    });
  
    // оновлюємо count
    draftHistory.forEach(h => {
      updateCount(currentItem.name, h.count, h.date);
    });
  
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
    editedCount,

    editedTotal,
  };
};
