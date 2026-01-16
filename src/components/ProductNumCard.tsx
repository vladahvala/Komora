import React, { useState } from 'react';
import { View, Image, StyleSheet, TextInput, Pressable, Animated } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Shadow } from 'react-native-shadow-2';

interface ProductNumCardProps {
  image: any;
  style?: any;
  count: number;
  circleLabel: string;
  onChange: (newCount: number) => void;
}

const ProductNumCard: React.FC<ProductNumCardProps> = ({ image, style, count, circleLabel, onChange }) => {
  const [scaleMinus] = useState(new Animated.Value(1));
  const [scalePlus] = useState(new Animated.Value(1));

  const animate = (scale: Animated.Value, toValue: number) => {
    Animated.timing(scale, { toValue, duration: 80, useNativeDriver: true }).start();
  };

  return (
    <View style={style}>
      <Shadow
        distance={hp(1)}
        startColor="rgba(0,0,0,0.3)"
        offset={[0, 0]}
        radius={hp(2)}
        viewStyle={{ width: hp(14), borderRadius: hp(2), alignSelf: 'center' }}
      >
        <View style={styles.cardContainer}>
          <View style={styles.circle}>
            <Animated.View style={[styles.smallDot, styles.leftDot, { transform: [{ scale: scaleMinus }] }]}>
              <Pressable
                onPress={() => onChange(Math.max(count - 1, 0))}
                onPressIn={() => animate(scaleMinus, 1.2)}
                onPressOut={() => animate(scaleMinus, 1)}
                style={styles.dotPressable}
              >
                <Image source={require('../../assets/jar_icons/minus.png')} style={styles.dotIcon} />
              </Pressable>
            </Animated.View>

            <Image source={image} style={styles.icon} />

            <Animated.View style={[styles.smallDot, styles.rightDot, { transform: [{ scale: scalePlus }] }]}>
              <Pressable
                onPress={() => onChange(Math.min(count + 1, 99))}
                onPressIn={() => animate(scalePlus, 1.2)}
                onPressOut={() => animate(scalePlus, 1)}
                style={styles.dotPressable}
              >
                <Image source={require('../../assets/jar_icons/plus.png')} style={styles.dotIcon} />
              </Pressable>
            </Animated.View>
          </View>

          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={count.toString()}
            onChangeText={(text) => {
              let num = parseInt(text.replace(/[^0-9]/g, ''), 10);
              if (isNaN(num)) num = 0;
              if (num > 99) num = 99;
              onChange(num);
            }}
            maxLength={2}
            textAlign="center"
          />
        </View>
      </Shadow>
    </View>
  );
};

export default ProductNumCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: hp(22),
    height: hp(11),
    backgroundColor: '#F6F6F6',
    borderRadius: hp(4),
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: hp(2.5),
    overflow: 'visible',
  },
  circle: {
    width: hp(12),
    height: hp(12),
    borderRadius: hp(6),
    backgroundColor: '#00B4BF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: -hp(3),
    top: hp(-0.8),
  },
  icon: {
    width: hp(7.7),
    height: hp(7.7),
    resizeMode: 'contain',
  },
  smallDot: {
    width: hp(3),
    height: hp(3),
    borderRadius: hp(1.5),
    backgroundColor: '#000',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftDot: { left: -hp(0.7), top: '42%', transform: [{ translateY: -hp(1) }] },
  rightDot: { right: -hp(0.7), top: '42%', transform: [{ translateY: -hp(1) }] },
  dotIcon: { width: hp(3), height: hp(3), resizeMode: 'contain', tintColor: '#fff' },
  dotPressable: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: { fontSize: hp(3.5), fontWeight: '600', color: '#333', textAlign: 'center', marginLeft: hp(4) },
});
