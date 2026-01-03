import React, { useState } from 'react';
import { View, Text, Image, Pressable, TouchableNativeFeedback, StyleSheet, Dimensions } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CARD_WIDTH = Dimensions.get('window').width / 2 - 24;

const ConsMenuCard = ({ item, index }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
        onPress={() => console.log('CARD PRESS', index)}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={{ width: CARD_WIDTH }}>
        <Shadow
            distance={pressed ? 15 : 7}
            startColor={pressed ? 'rgba(7,181,189,0.6)' : 'rgba(0,0,0,0.3)'}
            offset={[0, 0]}
            radius={15}
            viewStyle={{ width: '100%', borderRadius: 15 }}>
            <View style={styles.listContainer}>
                <View style={styles.imageContainer}>
                    <Image source={item.image} style={styles.image} />
                </View>
                <Text style={styles.nameText}>{item.name}</Text>
                <Text style={styles.priceText}>{item.price}</Text>
            </View>
        </Shadow>
    </Pressable>
  );
};

export default ConsMenuCard;

const styles = StyleSheet.create({
    listContainer: {
      backgroundColor: 'white',
      paddingBottom: 12, 
      borderRadius: 20,
    },
    imageContainer: {
      margin: 15,
      borderRadius: 10,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: undefined,
      aspectRatio: 1,
    },
    nameText: {
      color: 'black',
      fontWeight: 'bold',
      marginLeft: 15,
    },
    priceText: {
      color: 'orange',
      fontWeight: 'bold',
      marginLeft: 15,
      marginTop: 10,
    },
  })