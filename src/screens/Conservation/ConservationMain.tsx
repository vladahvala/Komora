import React, { useState } from 'react';
import { FlatList, StyleSheet, Keyboard, Pressable, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ConsMenuCard from '../../components/BigCards/ConsMenuCard';
import ConsMenuCardSmall from '../../components/SmallCards/ConsMenuCardSmall'; 
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ConservationContext } from '../../context/ConservationContext';
import { useContext } from 'react';
import HeaderWithSearch from '../../components/form/HeaderWithSearch';

const ConservationMain = () => {
  const { conservations } = useContext(ConservationContext);

  // search bar
  const [searchText, setSearchText] = useState('');
  const filteredData = conservations.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );
  // cards style
  const [isBigIcon, setIsBigIcon] = useState(true); 
  const toggleIcon = () => {
    setIsBigIcon(prev => !prev);
  };

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
            isBigIcon ? (
              <ConsMenuCard item={item} index={index} />
            ) : (
              <ConsMenuCardSmall item={item} index={index} />
            )
          }
          numColumns={isBigIcon ? 2 : 1}
          columnWrapperStyle={
            isBigIcon ? { justifyContent: 'space-between', marginBottom: 25 } : undefined
          }
          contentContainerStyle={{
            paddingHorizontal: 27,
            paddingBottom: hp(3),
            paddingTop: hp(2),
          }}
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

});
