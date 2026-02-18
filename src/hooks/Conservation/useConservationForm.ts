import { useState } from 'react';
import { ConservationItem } from '../../context/ConservationContext';

/**
 * Custom hook for managing the state and logic of a conservation form.
 * Handles form fields (name, category, year, period, image),
 * jar counts, dropdown states, modal alerts, validation, and creating a ConservationItem.
 */

export const useConservationForm = (onAdd?: (item: ConservationItem) => void) => {
  // form fields
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('2021');
  const [period, setPeriod] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  // jars num
  const [jarCounts, setJarCounts] = useState({
    jar2_3l: 0,
    jar4_2l: 0,
    jar7_15l: 0,
    jar2_1l: 0,
    jar1_05l: 0,
  });

  // Dropdown menus
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  // Alerts
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // validation
  const validateForm = () => {
    if (!name) return 'Введіть назву консервації!';
    if (!selectedCategory) return 'Оберіть категорію!';
    const totalJars = Object.values(jarCounts).reduce((sum, val) => sum + val, 0);
    if (totalJars === 0) return 'Додайте хоча б одну банку!';
    return null;
  };

  // form reset
  const resetForm = () => {
    setName('');
    setPeriod('');
    setSelectedCategory(null);
    setSelectedYear('2021');
    setJarCounts({
      jar2_3l: 0,
      jar4_2l: 0,
      jar7_15l: 0,
      jar2_1l: 0,
      jar1_05l: 0,
    });
    setImageUri(null);
    setIsCategoryOpen(false);
    setIsYearOpen(false);
    setModalVisible(false);
    setModalMessage('');
  };

  // creating an object
  const createConservationItem = (): ConservationItem => ({
    name,
    category: selectedCategory!,
    imageUri,
    history: {
      [selectedYear]: {
        jarCounts: jarCounts,
        period: Number(period) || 0,
      },
    },
  });

  // Handle add action 
  const handleAddConservation = () => {
    const error = validateForm();
    if (error) {
      setModalMessage(error);
      setModalVisible(true);
      return;
    }
    const item = createConservationItem();
    if (onAdd) onAdd(item);
    resetForm();
  };

  return {
    // form fields
    name,
    setName,
    selectedCategory,
    setSelectedCategory,
    selectedYear,
    setSelectedYear,
    period,
    setPeriod,
    imageUri,
    setImageUri,

    // jar counts
    jarCounts,
    setJarCounts,

    // dropdown states
    isCategoryOpen,
    setIsCategoryOpen,
    isYearOpen,
    setIsYearOpen,

    // modal alerts
    modalVisible,
    setModalVisible,
    modalMessage,
    setModalMessage,

    // actions
    validateForm,
    resetForm,
    createConservationItem,
    handleAddConservation,
  };
};
