import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Keyboard, Pressable, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ConsMenuCard from '../../components/BigCards/ConsMenuCard';
import ConsMenuCardSmall from '../../components/SmallCards/ConsMenuCardSmall'; 
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { ConservationContext } from '../../context/ConservationContext';
import { useContext, useEffect } from 'react';

const ConservationMain = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
  
          <Text style={styles.menuTitle}>Консервація</Text>
  
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <Image
                source={require('../../../assets/icons/search.png')}
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Шукати консервацію..."
                style={styles.searchInput}
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
                onPressIn={(e) => e.stopPropagation()}
              />
            </View>
  
            <Pressable onPress={toggleIcon} style={styles.bigIconContainer}>
              <Image
                source={
                  isBigIcon
                    ? require('../../../assets/icons/big_icons.png')
                    : require('../../../assets/icons/small_icons.png')
                }
                style={styles.bigIconImage}
              />
            </Pressable>
          </View>
        </View>
  
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
  // header container
  headerContainer: { 
    paddingTop: hp(5), 
    marginBottom: hp(2), 
    paddingHorizontal: hp(4), 
  },

  // arrow style
  arrowWrapper: {
    alignSelf: 'flex-start',
    marginLeft: -hp(1),
  },
  arrowTouchArea: {
    padding: hp(1.2),          
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: { 
    width: hp(3.2), 
    height: hp(3),
    resizeMode: 'contain',
  },  

  // menu text
  menuTitle: { 
    fontSize: hp(3.5), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'center', 
  },

  // search bar styles
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2.3),
    marginBottom: hp(0.7),
  },
  searchContainer: {
    flex: 1,
    marginLeft: -hp(1), 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderColor: '#00B4BF',
    borderWidth: hp(0.15),
    borderRadius: hp(1.5),
    paddingHorizontal: hp(1.5),
    height: hp(6),
  },
  searchIcon: {
    width: hp(2.2),
    height: hp(2.2),
    marginRight: hp(1),
  },
  searchInput: {
    flex: 1,
    fontSize: hp(2.2),
    color: '#000',
  },

  // cards style change styles
  bigIconContainer: {
    width: hp(6),
    height: hp(6),
    marginLeft: hp(2),         
    backgroundColor: '#00B4BF66',
    borderRadius: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigIconImage: {
    width: hp(3),           
    height: hp(3),
    resizeMode: 'contain',
  },
});
