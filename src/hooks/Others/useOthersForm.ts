import { useState, useContext } from 'react';
import { OthersContext } from '../../context/OthersContext';

/**
 * Custom hook for managing the "Other Products" form,
 * including field state, validation, modal messages, and submission.
 */

export const useOthersForm = (onFinish?: () => void) => {
  const { addOther } = useContext(OthersContext);

  // form state
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [packsCount, setPacksCount] = useState('');
  const [date, setDate] = useState(new Date());

  // modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // validation 
  const validateForm = () => {
    if (!name.trim()) return 'Введіть назву продукту!';
    if (!packsCount.trim()) return 'Введіть кількість упаковок/пляшок/банок!';
    if (Number(packsCount) <= 0) return 'Кількість має бути більшою за 0!';
    return null;
  };

  // form reset 
  const resetForm = () => {
    setName('');
    setPacksCount('');
    setImageUri(null);
    setDate(new Date());
    setModalVisible(false);
    setModalMessage('');
  };

  // format date 
  const formatDate = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // submit
  const handleAddOther = () => {
    const error = validateForm();
    if (error) {
      setModalMessage(error);
      setModalVisible(true);
      return;
    }

    const newItem = {
      name: name.trim(),
      imageUri,
      count: Number(packsCount),
      date: formatDate(date),
    };

    addOther(newItem);
    resetForm();

    if (onFinish) onFinish();
  };

  return {
    // form fields
    imageUri,
    setImageUri,
    name,
    setName,
    packsCount,
    setPacksCount,

    // date
    date,
    setDate,

    // modal alerts
    modalVisible,
    setModalVisible,
    modalMessage,

    // actions
    handleAddOther,
    validateForm,
    resetForm,
  };
};
