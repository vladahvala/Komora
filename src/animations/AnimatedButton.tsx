import React, { useState } from 'react';
import { Animated, Pressable } from 'react-native';

type AnimatedButtonProps = {
  onPress: () => void;
  style?: any;
  children: React.ReactNode;
};

const AnimatedButton = ({ onPress, style, children }: AnimatedButtonProps) => {
  const [pressAnim] = useState(new Animated.Value(0));

  const onPressIn = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(pressAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const animatedStyle = {
    top: pressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 3] }),
    shadowOffset: {
      width: 0,
      height: pressAnim.interpolate({ inputRange: [0, 1], outputRange: [3, 1] }),
    },
    elevation: pressAnim.interpolate({ inputRange: [0, 1], outputRange: [3, 1] }),
  };

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedButton;
