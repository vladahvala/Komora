import { StyleSheet, Text, View, Image, Animated, Pressable } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useRef, useState } from 'react';

import { Shadow } from 'react-native-shadow-2';

type MenuCardProps = {
  imageSource: any;
  caption: string;
  onPress?: () => void; 
};

const MenuCard = ({ imageSource, caption, onPress }: MenuCardProps) => {
  const [pressed, setPressed] = useState(false);

  return (
    // blue shadow for card (when pressed)
    <Pressable
        onPress={onPress}  
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={{ margin: 10, alignItems: 'center' }}
    >
    <Shadow
      distance={pressed ? 15 : 8} // shadow power
      startColor={pressed ? 'rgba(7, 181, 189, 0.6)' : 'rgba(0,0,0,0.3)'}
      offset={[0, 0]}
      radius={15}
      containerViewStyle={{ alignSelf: 'center', alignItems: 'center' }}
      viewStyle={{ width: hp(24), borderRadius: 15 }}
    >
        {/* MENU CARD */}
      <Animated.View style={styles.cardContainer}>
        <Image style={styles.blueBox} source={imageSource} />
        <Text style={styles.caption}>{caption}</Text>
      </Animated.View>
    </Shadow>
  </Pressable>
  );
};

export default MenuCard;

const styles = StyleSheet.create({
  // main card
  cardContainer: {
    backgroundColor: '#F6F6F6',
    borderRadius: 15,
    padding: 14,
    alignItems: 'center',
    width: hp(24),
  },

  // image card
  blueBox: {
    borderRadius: 10,
    width: '100%',
    height: hp(11),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  // card title 
  caption: {
    fontSize: hp(3),
    fontWeight: '600',
    textAlign: 'center',
    color: '#2596be',
    borderColor: 'black',
    borderRadius: hp(4),
  },
});
