import React, { useState } from 'react';
import { View, Text, Image, Pressable, TouchableNativeFeedback, StyleSheet, Dimensions } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CARD_WIDTH = Dimensions.get('window').width / 2 - 40;

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
                <Text
                  style={styles.nameText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>

                <View style={styles.jarsRow}>
                  <Text style={styles.jarText}>{item.num}</Text>
                  <Image
                    source={require('../../assets/icons/jar.png')}
                    style={styles.jarIcon}
                  />
                  <Text style={styles.jarText}> Банок</Text>
                </View>      
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
      height: hp(25),   // ⬅️ ФІКСОВАНА ВИСОТА КАРТКИ
    },
    imageContainer: {
      marginLeft: 15,
      marginRight: 15,
      marginTop: 5,
      overflow: 'hidden',
      // marginBottom: hp(0.8),
    },
    image: {
      width: '100%',        // залишаємо ширину повною
      height: undefined,
      aspectRatio: 1,       // щоб картинка залишалась квадратною
      transform: [{ scaleY: 0.85 }], // зменшення тільки по висоті
      borderRadius: 10,
    },
    nameText: {
      color: 'black',
      fontWeight: 'bold',
      marginLeft: 15,
      marginRight: 15,
      lineHeight: hp(1.5),   // висота одного рядка
      height: hp(1.8),       // 2 рядки × lineHeight
      fontSize: hp(1.8),
      marginTop: hp(0.5),
    },     
    jarsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 15,
      marginTop: hp(2), // ⬅️ відступ від назви
    },
    jarText: {
      color: 'grey',
      fontWeight: 'bold',
      fontSize: hp(1.2),
    },
    jarIcon: {
      width: hp(2.2),
      height: hp(2.2),
      marginHorizontal: 4,
      resizeMode: 'contain',
    },
    
  })