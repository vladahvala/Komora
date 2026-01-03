import React from 'react';
import { FlatList, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ConsMenuCard from '../../components/ConsMenuCard';
import data from '../../../data/data';

const ConservationMain = () => {
  return (
    <SafeAreaProvider style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <ConsMenuCard item={item} index={index} />
        )}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 25,     
        }}
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingTop: 12,
        }}
      />
    </SafeAreaProvider>
  );
};

export default ConservationMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FD',
  },
})