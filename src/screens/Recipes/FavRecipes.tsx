import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Keyboard, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { RecipesContext } from '../../context/RecipesContext';
import { useContext } from 'react';
import ConsMenuCardRecipe from '../../components/BigCards/ConsMenuCardRecipe';
import ConsMenuCardSmallRecipe from '../../components/SmallCards/ConsMenuCardSmallRecipe';
import CategoryHeader from '../../components/form/categories/CategoryHeader';
import IconToggle from '../../components/form/IconToggle';

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
              <CategoryHeader title={"Улюблені"} backRoute="MainMenu" />

              {filteredData.length > 0 ? (
                <IconToggle isBigIcon={isBigIcon} onToggle={toggleIcon} />
              ) : (
                <Text style={styles.noFavMessage}>Поки немає улюблених рецептів!</Text>
              )}
              
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

  // message when no fav
  noFavMessage: {
    fontSize: hp(3), 
    marginTop: hp(3),
    color: 'grey', 
    textAlign: 'center' 
  },
});
