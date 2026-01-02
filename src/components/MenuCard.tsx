// MenuCard.tsx
import { StyleSheet, Text, View, Image } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React from 'react';

type MenuCardProps = {
  imageSource: any; // require('../../assets/...') або URL
  caption: string;
};

const MenuCard = ({ imageSource, caption }: MenuCardProps) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.blueBox}>
        <Image source={imageSource} style={styles.image} />
      </View>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
};

export default MenuCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#F6F6F6',
    borderRadius: 15,
    padding: 14,
    alignItems: 'center',
    width: hp(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
  },
  blueBox: {
    backgroundColor: '#07b5bd',
    borderRadius: 10,
    width: '100%',
    height: hp(11),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: hp(7),
    height: hp(7),
    resizeMode: 'contain',
  },
  caption: {
    fontSize: hp(3),
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});
