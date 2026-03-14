import { useState } from 'react';
import { Animated } from 'react-native';

/**
 * Hook for button press animation.
 */

export const usePressAnimation = (distance = 3, duration = 100) => {
  const [pressAnim] = useState(new Animated.Value(0));

  const onPressIn = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(pressAnim, {
      toValue: 0,
      duration,
      useNativeDriver: false,
    }).start();
  };

  const animatedStyle = {
    top: pressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, distance] }),
    shadowOffset: {
      width: 0,
      height: pressAnim.interpolate({ inputRange: [0, 1], outputRange: [3, 1] }),
    },
    elevation: pressAnim.interpolate({ inputRange: [0, 1], outputRange: [3, 1] }),
  };

  return { animatedStyle, onPressIn, onPressOut };
};
