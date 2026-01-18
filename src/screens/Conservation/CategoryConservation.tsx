import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import cat_data from '../../../data/cat_data.js';
import CatCard from '../../components/CardsInCards/CatCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryPage from './CategoryPage';

const CategoryConservation = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const cards = cat_data; 

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* HEADER */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainMenu')}
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

          <Text style={styles.menuTitle}>Категорії</Text>
        </View>

        {/* CATEGORIES CARDS */}
        <View>
          {cards.map(item => (
            <CatCard
              key={item.id}
              item={{
                name: item.title,
                image: item.image,
                cansCount: Math.floor(Math.random() * 20 + 1),
                  category: item.category, 
                }}
                onPress={() =>
                  navigation.navigate('CategoryPage', { category: item.category })
                }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryConservation;

const styles = StyleSheet.create({
  // main container
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    paddingHorizontal: hp(3.2),
    paddingBottom: hp(4),
  },

  // header
  headerContainer: {
    marginBottom: hp(2), 
    paddingBottom: hp(1),     
    alignItems: 'center',      
  },
  
  // arrow styles
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

  // menu title
  menuTitle: {
    fontSize: hp(3.5),
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    marginTop: hp(6),
    width: '100%',
  }
});
