import React from 'react';
import { FlatList, StyleSheet, Keyboard, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ConsMenuCardOthers from '../../components/BigCards/ConsMenuCardOthers';
import ConsMenuCardOthersSmall from '../../components/SmallCards/ConsMenuCardOthersSmall';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import HeaderWithSearch from '../../components/form/common/HeaderWithSearch';
import { useOthersMain } from '../../hooks/Others/useOthersMain';

const OthersMain = () => {
  const { 
    // search field
    filteredData, 
    searchText, 
    setSearchText, 
    
    // toggle icon
    isBigIcon, 
    toggleIcon 
  } = useOthersMain();

  return (
    <Pressable style={styles.pressable} onPress={() => { Keyboard.dismiss(); setSearchText(''); }}>
      <SafeAreaProvider style={styles.container}>
        {/* FIXED HEADER */}
        <HeaderWithSearch
          title="Інші продукти"
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
            isBigIcon
              ? <ConsMenuCardOthers item={item} index={index} />
              : <ConsMenuCardOthersSmall item={item} index={index} />
          }
          keyExtractor={item => item.name}
          numColumns={isBigIcon ? 2 : 1}
          columnWrapperStyle={isBigIcon ? styles.columnWrapper : undefined}
          contentContainerStyle={styles.contentContainer}
        />
      </SafeAreaProvider>
    </Pressable>
  );
};

export default OthersMain;

const styles = StyleSheet.create({
  // main container
  pressable: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },

  // other styles
  columnWrapper: {
    justifyContent: 'space-between', 
    marginBottom: 25,
  },
  contentContainer: {
    paddingHorizontal: 27,
    paddingBottom: 50,
    paddingTop: hp(2),
  },
});
