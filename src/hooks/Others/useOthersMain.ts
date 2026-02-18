import { useState, useEffect } from 'react';
import { useOthers } from '../../context/OthersContext';

/**
 * Custom hook for OthersMain page
 * Handles loading products, search/filtering, and toggle between big/small cards
 */

export const useOthersMain = () => {
  const { others, loadOthers, loading } = useOthers();
  const [searchText, setSearchText] = useState('');
  const [isBigIcon, setIsBigIcon] = useState(true);

  useEffect(() => {
    loadOthers();
  }, []);

  const toggleIcon = () => setIsBigIcon(prev => !prev);

  const filteredData = others.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return {
    // search field
    searchText,
    setSearchText,
    filteredData,

    // toggle icon
    isBigIcon,
    toggleIcon,
    loading,
  };
};
