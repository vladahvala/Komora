import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Keyboard, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ConsMenuCard from '../../components/BigCards/ConsMenuCard';
import ConsMenuCardSmall from '../../components/SmallCards/ConsMenuCardSmall'; 
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { ConservationContext } from '../../context/ConservationContext';
import { useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConsMenuCardRemainders from '../../components/BigCards/ConsMenuCardRemainders';
import ConsMenuCardSmallRemainders from '../../components/SmallCards/ConsMenuCardSmallRemainders';

const RemaindersMain = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { conservations } = useContext(ConservationContext);

// search bar
const [searchText, setSearchText] = useState('');

const currentYear = new Date().getFullYear();

const isOlderThanOneYear = (item: any) => {
  return Object.keys(item.history).some(year => {
    const diff = currentYear - Number(year);
    return diff >= 1;
  });
};

const filteredData = conservations
  .filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  )
  .filter(isOlderThanOneYear);

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
        <FlatList
          // card style change
          key={isBigIcon ? 'big' : 'small'} 
          data={filteredData}
          renderItem={({ item, index }) =>
            isBigIcon ? (
              <ConsMenuCardRemainders item={item} index={index} />
            ) : (
              <ConsMenuCardSmallRemainders item={item} index={index} />
            )
          }
          numColumns={isBigIcon ? 2 : 1}  // column num
          columnWrapperStyle={
            isBigIcon
              ? { justifyContent: 'space-between', marginBottom: 25 }
              : undefined
          }
          contentContainerStyle={{
            paddingHorizontal: 27,
          }}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              {/* ARROW TO MAIN MENU */}
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
              
              {/* TITLE TEXT */}
              <Text style={styles.menuTitle}>Нагадування</Text>
              <Text style={styles.menuTextMain}>Консервацію потрібно терміново з’їсти!</Text>
              <Text style={styles.menuTextSecondary}>Якщо якійсь партії більше року - вона відобразиться тут</Text>

              
                {/* CARD STYLE CHANGE */}
                {/* SHOW TOGGLE ONLY IF DATA EXISTS */}
                {filteredData.length > 0 && (
                  <View style={styles.toggleWrapper}>
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
                )}

              </View>
           
          }
        />
      </SafeAreaProvider>
    </Pressable>
  );
};

export default RemaindersMain;

const styles = StyleSheet.create({
  // main container
  container: { 
    flex: 1, 
    backgroundColor: '#F7F9FD' 
  },
  // header container
  headerContainer: { 
    paddingTop: hp(5), 
    marginBottom: hp(2), 
    paddingHorizontal: hp(1), 
  },

  // arrow style
  arrowWrapper: {
    alignSelf: 'flex-start',
    // marginBottom: hp(1),
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
    marginBottom: hp(1), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'center' 
  },
  menuTextMain: { 
    fontSize: hp(3.2), 
    marginBottom: hp(1), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'left' 
  },
  menuTextSecondary: { 
    fontSize: hp(2.5), 
    fontWeight: '400', 
    color: 'grey', 
    textAlign: 'left' 
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
  toggleWrapper: {
    alignItems: 'center',
    marginTop: hp(2),
  },  
  bigIconImage: {
    width: hp(3),           
    height: hp(3),
    resizeMode: 'contain',
  },
});
