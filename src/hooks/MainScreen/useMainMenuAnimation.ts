import { useRef, useCallback } from 'react';
import { Animated, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Hook for handling main menu fade-in animation and app exit.
 */

export const useMainMenuAnimation = () => {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      opacityAnim.setValue(0);

      const animation = Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
      });

      animation.start();

      return () => animation.stop();
    }, [])
  );

  const exitApp = () => BackHandler.exitApp();

  return { opacityAnim, exitApp };
};
