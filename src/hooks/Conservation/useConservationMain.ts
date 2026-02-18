import { useContext, useState, useMemo } from 'react';
import { ConservationContext } from '../../context/ConservationContext';

/**
 * Custom hook for ConservationMain.
 * Handles search input, filtering conservations, and card size toggle.
 */
export const useConservationMain = () => {
  const { conservations } = useContext(ConservationContext);

  // search state
  const [searchText, setSearchText] = useState('');

  // filter conservations by search
  const filteredData = useMemo(() => {
    return conservations.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [conservations, searchText]);

  // toggle card size
  const [isBigIcon, setIsBigIcon] = useState(true);
  const toggleIcon = () => setIsBigIcon(prev => !prev);

  return {
    // search field
    searchText,
    setSearchText,
    filteredData,

    // toggle icon
    isBigIcon,
    toggleIcon,
  };
};
