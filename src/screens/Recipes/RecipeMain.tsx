import React, { useState, useContext } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Keyboard, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ConsMenuCardRecipe from '../../components/BigCards/ConsMenuCardRecipe';
import ConsMenuCardSmallRecipe from '../../components/SmallCards/ConsMenuCardSmallRecipe';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { RecipesContext } from '../../context/RecipesContext';

const RecipeMain = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { recipes } = useContext(RecipesContext);

  const [searchText, setSearchText] = useState('');
  const filteredData = recipes
    .filter(item => item)
    .filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));

  const [isBigIcon, setIsBigIcon] = useState(true);
  const toggleIcon = () => setIsBigIcon(prev => !prev);

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

          <Text style={styles.menuTitle}>Рецепти</Text>

          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <Image
                source={require('../../../assets/icons/search.png')}
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Шукати рецепт..."
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

        {/* LIST */}
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
            paddingTop: hp(2), 
            paddingBottom: 50,
          }}
        />
      </SafeAreaProvider>
    </Pressable>
  );
};

export default RecipeMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FD'
  },
  headerContainer: {
    paddingTop: hp(5),
    marginBottom: hp(2),
    paddingHorizontal: hp(4),
  },

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

  menuTitle: {
    fontSize: hp(3.5),
    fontWeight: '600',
    color: 'black',
    textAlign: 'center'
  },

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
