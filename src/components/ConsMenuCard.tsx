import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation'; // твій стек навігації
import { ConservationItem } from '../context/ConservationContext';

// fixed card width
const CARD_WIDTH = Dimensions.get('window').width / 2 - 40;

type ConsMenuCardProps = {
  item: ConservationItem; // беремо тип прямо з контексту
  index: number;
};

const ConsMenuCard = ({ item, index }: ConsMenuCardProps) => {
  // shadow glowing efect
  const [pressed, setPressed] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('CardPage', { item });
  };

   // підрахунок банок
   const totalJars = Object.values(item.history).reduce(
    (sum, yearData) => sum + Object.values(yearData).reduce((s, val) => s + val, 0),
    0
  );
  

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{ width: CARD_WIDTH }}>
        
      {/* GLOWING SHADOW */}
      <Shadow
        distance={pressed ? 15 : 7}
        startColor={pressed ? 'rgba(7,181,189,0.6)' : 'rgba(0,0,0,0.3)'}
        offset={[0, 0]}
        radius={15}
        viewStyle={{ width: '100%', borderRadius: 15 }}>
           
          {/* CARDS */}
          <View style={styles.listContainer}>
            {/* CARD IMG */}
            <View style={styles.imageContainer}>
            <Image
              source={
                item.imageUri
                  ? { uri: item.imageUri } // якщо користувач вибрав фото
                  : require('../../assets/images/default_conservation.png') // fallback
              }
              style={styles.image}
            />
            </View>
            <Text
              style={styles.nameText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>

            {/* CARD INFO */}
            <View style={styles.jarsRow}>
              <Text style={styles.jarText}>{totalJars}</Text>
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
  // main container
  listContainer: {
    backgroundColor: '#F6F6F6',
    paddingBottom: hp(2),    
    borderRadius: hp(2.5),
    height: hp(25),   
  },

  // image styles
  imageContainer: {
    marginLeft: hp(2),
    marginRight: hp(2),
    marginTop: hp(0.3),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,      
    transform: [{ scaleY: 0.85 }],  
    borderRadius: hp(1.5),
  },

  // title 
  nameText: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: hp(2),
    marginRight: hp(2),
    lineHeight: hp(1.5),  
    height: hp(1.8),    
    fontSize: hp(2),
    marginTop: hp(0.5),
  },     

  // card info styles 
  jarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: hp(2),
    marginTop: hp(2.5),
  },
  jarText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: hp(1.5),
  },
  jarIcon: {
    width: hp(2.2),
    height: hp(2.2),
    marginHorizontal: hp(0.5),
    resizeMode: 'contain',
  },
});
