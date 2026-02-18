import React from 'react';
import { FlatList, StyleSheet, Keyboard, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ConsMenuCardRecipe from '../../components/BigCards/ConsMenuCardRecipe';
import ConsMenuCardSmallRecipe from '../../components/SmallCards/ConsMenuCardSmallRecipe';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import HeaderWithSearch from '../../components/form/common/HeaderWithSearch';
import { useRecipeMain } from '../../hooks/Recipes/useRecipeMain';

const RecipeMain = () => {
  const { filteredRecipes, searchText, setSearchText, isBigIcon, toggleIcon } = useRecipeMain();

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
          title="Рецепти"
          backRoute="MainMenu"
          searchText={searchText}
          onSearchChange={setSearchText}
          showToggle
          isBigIcon={isBigIcon}
          onToggle={toggleIcon}
        />

        {/* LIST */}
        <FlatList
          key={isBigIcon ? 'big' : 'small'}
          data={filteredRecipes}
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
});
