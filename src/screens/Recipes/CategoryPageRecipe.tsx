import { useNavigation, NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { FlatList, View, Text, TouchableOpacity, Image, Pressable, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useContext, useState } from 'react';
import ConsMenuCardRecipe from '../../components/ConsMenuCardRecipe';
import ConsMenuCardSmallRecipe from '../../components/ConsMenuCardSmallRecipe';
import { RecipesContext } from '../../context/RecipesContext';

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
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
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

            <Text style={styles.menuTitle}>{category}</Text>

            {filteredRecipes.length > 0 ? (
              <View style={{ alignItems: 'center', marginTop: hp(2), marginBottom: hp(2) }}>
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
  headerContainer: { 
    paddingTop: hp(5), 
    marginBottom: hp(2), 
    paddingHorizontal: hp(1), 
  },

  // arrow back styles
  arrowWrapper: {
    alignSelf: 'flex-start',
    marginBottom: hp(2),
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

  // menu title style 
  menuTitle: { 
    fontSize: hp(3.5), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'center' 
  },

  // toggle icon styles
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

  // message when no cat
  noCatMessage: {
    fontSize: hp(3), 
    marginTop: hp(3),
    color: 'grey', 
    textAlign: 'center' 
  },
});
