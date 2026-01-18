import { StyleSheet, View, Text, Animated, TouchableOpacity, BackHandler, Image } from 'react-native';
import React, { useRef } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import MenuCard from '../components/CardsInCards/MenuCard';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import AnimatedButton from '../animations/AnimatedButton';

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

export default function MainMenu({ navigation }: Props) {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      opacityAnim.setValue(0);

      const animation = Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
      });

      animation.start();

      return () => animation.stop();
    }, [])
  );

  return (
    <View style={styles.screen}>

      {/* ---- HEADER ROW (title + exit) ---- */}
      <View style={styles.headerRow}>
        {/* Порожній View для вирівнювання по центру */}
        <View style={{ width: hp(5) }} />

        <Text style={styles.menuText}>Меню</Text>
        
        <AnimatedButton
            style={styles.exitButton}
            onPress={() => BackHandler.exitApp()}
        >
            <Image
                source={require('../../assets/icons/exit.png')}
                style={{ width: hp(3.5), height: hp(3.5), resizeMode: 'contain' }}
            />
        </AnimatedButton>
      </View>

      <Animated.View style={{ opacity: opacityAnim }}>
        <MenuCard
          imageSource={require('../../assets/images/conservation.jpg')}
          caption="Консервація"
          onPress={() => navigation.navigate('ConservationNavigation')}
        />
        <MenuCard
          imageSource={require('../../assets/images/other_products.jpg')}
          caption="Інші продукти"
          onPress={() => navigation.navigate('OthersNavigation')}
        />
        <MenuCard
          imageSource={require('../../assets/images/recipes.jpg')}
          caption="Рецепти"
          onPress={() => navigation.navigate('RecipesNavigation')}
        />
        <MenuCard
          imageSource={require('../../assets/images/remainders.jpg')}
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

  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: hp(2),
    marginBottom: hp(1),
    marginTop: hp(0.5),
  },

  menuText: {
    fontSize: hp(4),
    fontWeight: '600',
    textAlign: 'center',
    color: '#2596be',
  },

  exitIcon: {
    width: hp(4),
    height: hp(4),
    resizeMode: 'contain',
  },

  exitButton: {
    height: hp(5),
    width: hp(5),
    backgroundColor: '#00B4BF',
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: hp(2),
  },
  
});
