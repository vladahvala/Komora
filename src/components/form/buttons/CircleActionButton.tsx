import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, Pressable, Animated } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface CircleActionButtonProps {
    icon: any;
    onPress: () => void;
    style?: any; // ← додаємо
  }
  
  const CircleActionButton: React.FC<CircleActionButtonProps> = ({
    icon,
    onPress,
    style,
  }) => {
    const [scale] = useState(new Animated.Value(1));
  
    const onPressIn = () => {
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 80,
        useNativeDriver: true,
      }).start();
    };
  
    const onPressOut = () => {
      Animated.timing(scale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }).start();
    };
  
    return (
      <Animated.View
        style={[
          styles.smallDot,
          style, // ← тепер можна керувати позицією
          { transform: [{ scale }] },
        ]}
      >
        <Pressable
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image source={icon} style={styles.dotIcon} />
        </Pressable>
      </Animated.View>
    );
  };
  

  export default CircleActionButton;
  
  const styles = StyleSheet.create({
    smallDot: {
        width: hp(2.5),
        height: hp(2.5),
        borderRadius: hp(1.25),
        backgroundColor: '#000',
        position: 'absolute',
    
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotIcon: {
        width: hp(2.5),
        height: hp(2.5),
        resizeMode: 'contain',
        tintColor: '#fff', 
    },
});
