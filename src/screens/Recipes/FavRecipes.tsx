import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Keyboard, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { RecipesContext } from '../../context/RecipesContext';
import { useContext, useEffect } from 'react';
import ConsMenuCardRecipe from '../../components/ConsMenuCardRecipe';
import ConsMenuCardSmallRecipe from '../../components/ConsMenuCardSmallRecipe';

const FavRecipes = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { recipes, favorites } = useContext(RecipesContext);

  // filter: showing only favorite
  const filteredData = recipes
    .filter(item => item) // hide undefined/null
    .filter(item => favorites.includes(item.name)) // only fav

  // cards style
  const [isBigIcon, setIsBigIcon] = useState(true); 
  const toggleIcon = () => setIsBigIcon(prev => !prev);

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <SafeAreaProvider style={styles.container}>
        <FlatList
          key={isBigIcon ? 'big' : 'small'}
          data={filteredData}
          keyExtractor={(item) => item.name}
          renderItem={({ item, index }) =>
            isBigIcon ? (
              <ConsMenuCardRecipe item={item} index={index} />
            ) : (
              <ConsMenuCardSmallRecipe item={item} index={index} />
            )
          }     
          numColumns={isBigIcon ? 2 : 1}  
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
              <Text style={styles.menuTitle}>Улюблені</Text>

              {/* Кнопка зміни розміру карток по центру */}
              <View style={styles.centeredButton}>
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
          }
        />
      </SafeAreaProvider>
    </Pressable>
  );
};

export default FavRecipes;

const styles = StyleSheet.create({
  // container
  container: { 
    flex: 1, 
    backgroundColor: '#F7F9FD' 
  },
  headerContainer: { 
    paddingTop: hp(5), 
    marginBottom: hp(2), 
    paddingHorizontal: hp(1), 
  },

  // arrow back
  arrowWrapper: {
    alignSelf: 'flex-start',
    marginBottom: hp(1),
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

  // title 
  menuTitle: { 
    fontSize: hp(3.5), 
    marginBottom: hp(2), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'center' 
  },

  // toggle icon styles
  centeredButton: {
    alignItems: 'center',
    marginBottom: hp(2),
  },
  bigIconContainer: {
    width: hp(6),
    height: hp(6),
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
