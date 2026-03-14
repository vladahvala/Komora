import { useState, useEffect } from 'react';
import { useConservation } from '../../context/ConservationContext';
import { JarCounts } from './useJarManager'; 
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';

/**
 * Hook for managing local empty jar counts and syncing with context.
 */

export const useEmptyJarsForm = () => {
  const { emptyJars, updateEmptyJars } = useConservation();
  const [localJars, setLocalJars] = useState<JarCounts>(emptyJars);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // context synchronize
  useEffect(() => {
    setLocalJars(emptyJars);
  }, [emptyJars]);

  const totalJars = Object.values(localJars).reduce((sum, val) => sum + val, 0);

  const saveChanges = () => {
    updateEmptyJars(localJars);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return {
    localJars,
    setLocalJars,
    totalJars,
    saveChanges,
    handleBack,
  };
};
