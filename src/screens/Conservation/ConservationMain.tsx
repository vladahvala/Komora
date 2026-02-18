import React from 'react';
import { FlatList, StyleSheet, Keyboard, Pressable, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ConsMenuCard from '../../components/BigCards/ConsMenuCard';
import ConsMenuCardSmall from '../../components/SmallCards/ConsMenuCardSmall'; 
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import HeaderWithSearch from '../../components/form/common/HeaderWithSearch';
import { useConservationMain } from '../../hooks/Conservation/useConservationMain';

const ConservationMain = () => {
  const { 
    // search field
    searchText,
    setSearchText,
    filteredData,

    // toggle icon
    isBigIcon,
    toggleIcon,
  } = useConservationMain();

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => {
        Keyboard.dismiss();
        setSearchText('');
      }}
    >
      <SafeAreaProvider style={styles.container}>
  
        {/* FIXED HEADER */}
        <HeaderWithSearch
          title="Консервація"
          backRoute="MainMenu"
          searchText={searchText}
          onSearchChange={setSearchText}
          showToggle
          isBigIcon={isBigIcon}
          onToggle={toggleIcon}
        />
  
        {/* SCROLLABLE LIST */}
        <FlatList
          key={isBigIcon ? 'big' : 'small'}
          data={filteredData}
          renderItem={({ item, index }) =>
            isBigIcon ? <ConsMenuCard item={item} index={index} /> : <ConsMenuCardSmall item={item} index={index} />
          }
          numColumns={isBigIcon ? 2 : 1}
          columnWrapperStyle={isBigIcon ? styles.columnWrapper : undefined}
          contentContainerStyle={styles.contentContainer}
        />
      </SafeAreaProvider>
    </Pressable>
  );
};

export default ConservationMain;

const styles = StyleSheet.create({
  // main container
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },

  // other styles
  columnWrapper: {
    justifyContent: 'space-between', 
    marginBottom: 25,
  },
  contentContainer:{
    paddingHorizontal: 27, 
    paddingBottom: hp(3), 
    paddingTop: hp(2),
  },
});
