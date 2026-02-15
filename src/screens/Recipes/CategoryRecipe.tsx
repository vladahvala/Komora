import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import cat_data from '../../../data/cat_data.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryHeader from '../../components/form/categories/CategoryHeader';
import CategoryCardList from '../../components/form/categories/CategoryCardList';

const CategoryConservation = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const cards = cat_data; 

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* HEADER */}
        <CategoryHeader title="Категорії" backRoute="MainMenu" />

        {/* CATEGORIES CARDS */}
        <CategoryCardList
          cards={cards}
          navigateTo="CategoryPageRecipe"
        />

      </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryConservation;

const styles = StyleSheet.create({
  // main container
  container: {
    flex: 1,
    backgroundColor: '#F7F9FD',
  },
  scrollContainer: {
    paddingHorizontal: hp(3.2),
    paddingBottom: hp(4),
  },

});
