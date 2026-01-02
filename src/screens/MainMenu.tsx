// MainMenu.tsx
import { StyleSheet, View, Text } from 'react-native';
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import MenuCard from '../components/MenuCard';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

export default function MainMenu({ navigation }: Props) {
  return (
    <View style={styles.screen}>
    <Text style={styles.menuText}>Меню</Text>
      <MenuCard imageSource={require('../../assets/images/icons/spoon_fork.png')} caption="Рецепти" />
      <MenuCard imageSource={require('../../assets/images/icons/jar.png')} caption="Консервація" />
      <MenuCard imageSource={require('../../assets/images/icons/bell.png')} caption="Нагадування" />
      <MenuCard imageSource={require('../../assets/images/icons/bascket.png')} caption="Інші продукти" />
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
  menuText: {
    top: hp(1),
    fontSize: hp(3),
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginBottom: hp(2),
  },
});
