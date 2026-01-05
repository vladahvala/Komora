import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Shadow } from 'react-native-shadow-2';

type ConsMenuCardSmallProps = {
  item: {
    name: string;
    image: any;       
    cansCount: number;
  };
  onPress?: () => void;
};

const ConsMenuCardSmall = ({ item, onPress }: ConsMenuCardSmallProps) => {
  // shadow glowing efect
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      style={{ marginBottom: hp(2) }}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >

      {/* GLOWING SHADOW */}
      <Shadow
        distance={pressed ? 15 : 7}
        startColor={pressed ? 'rgba(7,181,189,0.6)' : 'rgba(0,0,0,0.3)'}
        radius={12}
        offset={[0, 0]}
        viewStyle={{ width: '100%', borderRadius: 12, backgroundColor: '#fff' }}
      >
        {/* CARD STYLES */}
        <View style={styles.cardContainer}>
          {/* CARD IMG */}
          <Image source={item.image} style={styles.image} />
    
          {/* CARD INFO */}
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
  // main container
  cardContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F6F6F6',
    borderRadius: hp(1.5),
    padding: hp(1.5),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.1) },
    shadowOpacity: 0.1,
    shadowRadius: hp(0.2),
    elevation: 3,
  },

  // img styles
  image: {
    width: hp(9),
    height: hp(9),
    borderRadius: hp(1),
    marginRight: hp(2),
  },

  // text styles
  textContainer: {
    flex: 1,
    justifyContent: 'space-between', 
  },
  title: {
    fontSize: hp(2.2),
    fontWeight: '600',
    color: '#000',
    marginBottom: hp(3.5),  
  },
  subtitleRow: {
    flexDirection: 'row',    
    alignItems: 'center',
  },
  subtitle: {
    fontSize: hp(1.7),
    color: 'grey',
  },
  jarIcon: {
    width: hp(2.2),
    height: hp(2.2),
    marginLeft: hp(0.5),        
    resizeMode: 'contain',
  },
});
