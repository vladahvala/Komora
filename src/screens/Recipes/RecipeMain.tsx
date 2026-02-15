import React, { useState, useContext } from 'react';
import { FlatList, StyleSheet, Keyboard, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ConsMenuCardRecipe from '../../components/BigCards/ConsMenuCardRecipe';
import ConsMenuCardSmallRecipe from '../../components/SmallCards/ConsMenuCardSmallRecipe';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { RecipesContext } from '../../context/RecipesContext';
import HeaderWithSearch from '../../components/form/HeaderWithSearch';

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
});
