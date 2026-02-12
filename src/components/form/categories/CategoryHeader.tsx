import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation';

interface CategoryHeaderProps {
  title: string;
  backRoute: keyof RootStackParamList; 
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ title, backRoute }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate(backRoute)}
        style={styles.arrowWrapper}
        activeOpacity={1}
      >
        <View style={styles.arrowTouchArea}>
          <Image
            source={require('../../../assets/icons/arrow.png')}
            style={styles.arrowIcon}
          />
        </View>
      </TouchableOpacity>

      <Text style={styles.menuTitle}>{title}</Text>
    </View>
  );
};

export default CategoryHeader;

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: hp(2),
    paddingBottom: hp(1),
    alignItems: 'center',
  },
  arrowWrapper: {
    position: 'absolute',
    left: 0,
  },
  arrowTouchArea: {
    padding: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    width: hp(3.2),
    height: hp(3),
    resizeMode: 'contain',
  },
  menuTitle: {
    fontSize: hp(3.5),
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    marginTop: hp(6),
    width: '100%',
  },
});
