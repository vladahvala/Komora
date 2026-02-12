import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import cat_data from '../../../data/cat_data.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryHeader from '../../components/form/categories/CategoryHeader';
import CategoryCardList from '../../components/form/categories/CategoryCardList';

const CategoryConservation = () => { 

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* HEADER */}
        <CategoryHeader title="Категорії" backRoute="MainMenu" />

        {/* CATEGORIES CARDS */}
        <CategoryCardList cards={cat_data} />
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

});
