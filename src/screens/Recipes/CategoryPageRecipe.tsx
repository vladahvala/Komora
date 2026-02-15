import { useNavigation, NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useContext, useState } from 'react';
import ConsMenuCardRecipe from '../../components/BigCards/ConsMenuCardRecipe';
import ConsMenuCardSmallRecipe from '../../components/SmallCards/ConsMenuCardSmallRecipe';
import { RecipesContext } from '../../context/RecipesContext';
import CategoryHeader from '../../components/form/categories/CategoryHeader';
import IconToggle from '../../components/form/IconToggle';

type CategoryPageRouteProp = RouteProp<RootStackParamList, 'CategoryPageRecipe'>;

const CategoryPageRecipe = () => {
  const route = useRoute<CategoryPageRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const category = route.params?.category ?? '';

  const { recipes } = useContext(RecipesContext);

  // filtered according to category
  const filteredRecipes = recipes.filter(
    r => r.category.toLowerCase() === category.toLowerCase()
  );

  // toggle icon
  const [isBigIcon, setIsBigIcon] = useState(true);
  const toggleIcon = () => setIsBigIcon(prev => !prev);

  return (
    <SafeAreaProvider style={styles.container}>
      <FlatList
        key={isBigIcon ? 'big' : 'small'}
        data={filteredRecipes}
        renderItem={({ item, index }) =>
          isBigIcon ? (
            <ConsMenuCardRecipe item={item} index={index} />
          ) : (
            <ConsMenuCardSmallRecipe item={item} index={index} />
          )
        }
        numColumns={isBigIcon ? 2 : 1}
        columnWrapperStyle={
          isBigIcon ? { justifyContent: 'space-between', marginBottom: hp(3) } : undefined
        }
        contentContainerStyle={{ paddingHorizontal: hp(3) }}
        ListHeaderComponent={
          <View style={{ paddingTop: hp(5), marginBottom: hp(2) }}>
          
            <CategoryHeader title={category} backRoute="MainMenu" />

            {filteredRecipes.length > 0 ? (
              <IconToggle isBigIcon={isBigIcon} onToggle={toggleIcon} />
            ) : (
              <Text style={styles.noCatMessage}>Поки в цій категорії немає жодної картки!</Text>
            )}
          </View>
        }
      />
    </SafeAreaProvider>
  );
};

export default CategoryPageRecipe;

const styles = StyleSheet.create({
  // container
  container: { 
    flex: 1, 
    backgroundColor: '#F7F9FD',
  },

  // message when no cat
  noCatMessage: {
    fontSize: hp(3), 
    marginTop: hp(3),
    color: 'grey', 
    textAlign: 'center' 
  },
});
