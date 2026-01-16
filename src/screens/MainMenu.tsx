import { StyleSheet, View, Text, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import MenuCard from '../components/MenuCard';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

export default function MainMenu({ navigation }: Props) {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,  
      delay: 100,     
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.screen}>
      <Text style={styles.menuText}>Меню</Text>

      {/* CARDS */}
      <Animated.View style={{ opacity: opacityAnim }}>
        <MenuCard
          imageSource={require('../../assets/images/консервація.jpg')}
          caption="Консервація"
          onPress={() => navigation.navigate('ConservationNavigation')}
        />
        <MenuCard 
          imageSource={require('../../assets/images/інші_продукти.jpg')} 
          caption="Інші продукти" 
          onPress={() => navigation.navigate('OthersNavigation')}
        />
        <MenuCard 
          imageSource={require('../../assets/images/рецепти.jpg')} 
          caption="Рецепти" 
          onPress={() => navigation.navigate('RecipesNavigation')}
        />
        <MenuCard 
          imageSource={require('../../assets/images/нагадування.jpg')} 
          caption="Нагадування" 
          onPress={() => navigation.navigate('RemaindersMain')}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  // title menu
  menuText: {
    fontSize: hp(4),
    fontWeight: '600',
    textAlign: 'center',
    color: '#2596be',
    marginBottom: hp(2),
  },
});
