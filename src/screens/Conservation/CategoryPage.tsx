import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ConsMenuCard from '../../components/BigCards/ConsMenuCard';
import ConsMenuCardSmall from '../../components/SmallCards/ConsMenuCardSmall';
import CategoryHeader from '../../components/form/categories/CategoryHeader';
import IconToggle from '../../components/form/common/IconToggle';
import { useCategoryPage } from '../../hooks/Conservation/useCategoryPage';

type CategoryPageRouteProp = RouteProp<RootStackParamList, 'CategoryPage'>;

const CategoryPage = () => {
  const route = useRoute<CategoryPageRouteProp>();
  const category = route.params?.category ?? '';

  const { filteredConservations, isBigIcon, toggleIcon } = useCategoryPage(category);

  return (
    <SafeAreaProvider style={styles.container}>
      <FlatList
        key={isBigIcon ? 'big' : 'small'}
        data={filteredConservations}
        renderItem={({ item, index }) =>
          isBigIcon ? <ConsMenuCard item={item} index={index} /> : <ConsMenuCardSmall item={item} index={index} />
        }
        numColumns={isBigIcon ? 2 : 1}
        columnWrapperStyle={isBigIcon ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <View style={styles.listHeaderContainer}>
            <CategoryHeader title={category} backRoute="MainMenu" />
            {filteredConservations.length > 0 ? (
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

export default CategoryPage;

const styles = StyleSheet.create({
  // main container
  container: { 
    flex: 1, 
    backgroundColor: '#FFF',
  },

  // other styles
  columnWrapper: {
    justifyContent: 'space-between', 
    marginBottom: hp(3),
  },
  contentContainer: {
    paddingHorizontal: hp(3),
  },
  listHeaderContainer: {
    paddingTop: hp(5), 
    marginBottom: hp(2), 
  },

  // no cat message
  noCatMessage: {
    fontSize: hp(3), 
    marginTop: hp(3),
    color: 'grey', 
    textAlign: 'center' 
  },
});
