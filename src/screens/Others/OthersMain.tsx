import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Keyboard, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ConsMenuCardOthers from '../../components/BigCards/ConsMenuCardOthers';
import ConsMenuCardOthersSmall from '../../components/SmallCards/ConsMenuCardOthersSmall';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { useOthers } from '../../context/OthersContext';
import { useEffect } from 'react';
import HeaderWithSearch from '../../components/form/HeaderWithSearch';

const OthersMain = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { others, loadOthers, loading } = useOthers();

  useEffect(() => {
    loadOthers();
  }, []);

  if (loading) return null;

  // search bar
  const [searchText, setSearchText] = useState('');
  const filteredData = others.filter(item =>
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
          extraData={others}
          renderItem={({ item, index }) =>
            isBigIcon
              ? <ConsMenuCardOthers item={item} index={index} />
              : <ConsMenuCardOthersSmall item={item} index={index} />
          }
          keyExtractor={item => item.name}
          numColumns={isBigIcon ? 2 : 1}
          columnWrapperStyle={isBigIcon ? { justifyContent: 'space-between', marginBottom: 25 } : undefined}
          contentContainerStyle={{
            paddingHorizontal: 27,
            paddingBottom: 50,
            paddingTop: hp(2),
          }}
        />
      </SafeAreaProvider>
    </Pressable>
  );
};

export default OthersMain;

const styles = StyleSheet.create({
  // main container
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
});
