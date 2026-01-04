import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Shadow } from 'react-native-shadow-2';

type ConsMenuCardSmallProps = {
  item: {
    name: string;
    image: any;       // шлях до картинки
    cansCount: number; // кількість банок
  };
  onPress?: () => void;
};

const ConsMenuCardSmall = ({ item, onPress }: ConsMenuCardSmallProps) => {
    const [pressed, setPressed] = useState(false);
  return (
    <Pressable
    style={{ marginBottom: hp(2) }}
    onPress={onPress}
    onPressIn={() => setPressed(true)}
    onPressOut={() => setPressed(false)}
  >
    <Shadow
      distance={pressed ? 15 : 7}
      startColor={pressed ? 'rgba(7,181,189,0.6)' : 'rgba(0,0,0,0.3)'}
      radius={12}
      offset={[0, 0]}
      viewStyle={{ width: '100%', borderRadius: 12, backgroundColor: '#fff' }}
    >
      {/* Один контейнер всередині Shadow */}
      <View style={styles.cardContainer}>
        <Image source={item.image} style={styles.image} />
  
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitle}>{item.cansCount}</Text>
            <Image
              source={require('../../assets/icons/jar.png')}
              style={styles.jarIcon}
            />
            <Text style={styles.subtitle}> Банок</Text>
          </View>
        </View>
      </View>
    </Shadow>
  </Pressable>
  
  );
};

export default ConsMenuCardSmall;

const styles = StyleSheet.create({
    cardContainer: {
      flexDirection: 'row',
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
    },
    image: {
      width: hp(9),
      height: hp(9),
      borderRadius: 8,
      marginRight: hp(2),
    },
    textContainer: {
      flex: 1,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: hp(2.2),
      fontWeight: '600',
      color: '#000',
      marginBottom: hp(3),
    },
    subtitleRow: {
      flexDirection: 'row',      // рядок: текст + іконка
      alignItems: 'center',
    },
    subtitle: {
      fontSize: hp(1.7),
      color: 'grey',
    },
    jarIcon: {
      width: hp(2.2),
      height: hp(2.2),
      marginLeft: 4,            // відстань між текстом і іконкою
      resizeMode: 'contain',
    },
  });