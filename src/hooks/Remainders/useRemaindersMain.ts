import { useContext, useMemo, useState } from 'react';
import { ConservationContext, ConservationItem } from '../../context/ConservationContext';

/**
 * Custom hook for managing remainders/expired conservations.
 * Handles search filtering, expiration check (over 1 year), and big/small card toggle.
 */

export const useRemaindersMain = () => {
  const { conservations } = useContext(ConservationContext);

  const [searchText, setSearchText] = useState('');
  const [isBigIcon, setIsBigIcon] = useState(true);

  const toggleIcon = () => setIsBigIcon(prev => !prev);

  // chech if is more than a year
  const isExpiredOneYearPlus = (item: ConservationItem) => {
    const currentYear = new Date().getFullYear();
    return Object.entries(item.history).some(([year, data]: any) => {
      const period = data.period ?? 0;
      const expirationYear = Number(year) + period;
      return currentYear - expirationYear >= 1;
    });
  };

  // search and expiration date filter
  const filteredData: ConservationItem[] = useMemo(() => {
    return conservations
      .filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))
      .filter(isExpiredOneYearPlus);
  }, [conservations, searchText]);

  return {
    filteredData,
    searchText,
    setSearchText,
    isBigIcon,
    toggleIcon,
  };
};
