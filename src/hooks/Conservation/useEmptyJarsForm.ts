import { useState, useEffect } from 'react';
import { useConservation } from '../../context/ConservationContext';
import { JarCounts } from './useJarManager'; 

/**
 * Hook for managing local empty jar counts and syncing with context.
 */

export const useEmptyJarsForm = () => {
  const { emptyJars, updateEmptyJars } = useConservation();
  const [localJars, setLocalJars] = useState<JarCounts>(emptyJars);

  // context synchronize
  useEffect(() => {
    setLocalJars(emptyJars);
  }, [emptyJars]);

  const totalJars = Object.values(localJars).reduce((sum, val) => sum + val, 0);

  const saveChanges = () => {
    updateEmptyJars(localJars);
  };

  return {
    localJars,
    setLocalJars,
    totalJars,
    saveChanges,
  };
};
