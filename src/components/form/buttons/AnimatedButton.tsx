import React from 'react';
import { Animated, Pressable } from 'react-native';
import { usePressAnimation } from '../../../hooks/Animations/usePressAnimation';

type AnimatedButtonProps = {
  onPress: () => void;
  style?: any;
  children: React.ReactNode;
};

const AnimatedButton = ({ onPress, style, children }: AnimatedButtonProps) => {
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedButton;
