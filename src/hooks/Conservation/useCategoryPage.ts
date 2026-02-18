import { useContext, useState, useMemo } from 'react';
import { ConservationContext } from '../../context/ConservationContext';

/**
 * Custom hook for CategoryPage.
 * Handles filtering conservations by category and managing the view toggle (big/small cards).
 */
export const useCategoryPage = (category: string) => {
  const { conservations } = useContext(ConservationContext);

  // Toggle between big and small card view
  const [isBigIcon, setIsBigIcon] = useState(true);
  const toggleIcon = () => setIsBigIcon(prev => !prev);

  // Filter conservations by category
  const filteredConservations = useMemo(() => {
    return conservations.filter(
      item => item.category.toLowerCase() === category.toLowerCase()
    );
  }, [conservations, category]);

  return {
    filteredConservations,
    isBigIcon,
    toggleIcon,
  };
};
