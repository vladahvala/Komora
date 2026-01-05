import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Shadow } from 'react-native-shadow-2';

const CatCard = ({ item, onPress }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{  marginBottom: hp(2.5) }}
    >

      {/* GLOWING SHADOW */}
      <Shadow
        distance={pressed ? 15 : 7}
        startColor={pressed ? 'rgba(7,181,189,0.6)' : 'rgba(0,0,0,0.3)'}
        offset={[0,0]}
        radius={15}
        viewStyle={{ width: '95%', borderRadius: 15, alignSelf: 'center' }} 
      > 

        {/* CARDS */}
        <View style={styles.cardContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          <Image source={item.image} style={styles.image} />
        </View>

      </Shadow>
    </Pressable>
  );
};

export default CatCard;
const styles = StyleSheet.create({
  // main container
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: hp(1.7),
    width: '100%',
  },

  // card styles
  image: {
    width: hp(4.3),
    height: hp(4.3),
    marginLeft: hp(2), 
    resizeMode: 'contain', 
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: hp(2.7),
    fontWeight: '600',
    marginLeft: hp(1), 
    color: '#000',
  },
});
