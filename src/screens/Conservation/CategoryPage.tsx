import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useContext, useState } from 'react';
import ConsMenuCard from '../../components/BigCards/ConsMenuCard';
import ConsMenuCardSmall from '../../components/SmallCards/ConsMenuCardSmall';
import { ConservationContext } from '../../context/ConservationContext';
import CategoryHeader from '../../components/form/categories/CategoryHeader';
import IconToggle from '../../components/form/IconToggle';

type CategoryPageRouteProp = RouteProp<RootStackParamList, 'CategoryPage'>;

const CategoryPage = () => {
  const route = useRoute<CategoryPageRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // categories
  const category = route.params?.category ?? '';

  // conservation context
  const { conservations } = useContext(ConservationContext);

  // filter on category
  const filteredConservations = conservations.filter(
    item => item.category.toLowerCase() === category.toLowerCase()
  );

  // toggle icon
  const [isBigIcon, setIsBigIcon] = useState(true);
  const toggleIcon = () => setIsBigIcon(prev => !prev);

  return (
    <SafeAreaProvider style={styles.container}>
      <FlatList
        key={isBigIcon ? 'big' : 'small'}
        data={filteredConservations}
        renderItem={({ item, index }) =>
          isBigIcon ? (
            <ConsMenuCard item={item} index={index} />
          ) : (
            <ConsMenuCardSmall item={item} index={index} />
          )
        }
        numColumns={isBigIcon ? 2 : 1}
        columnWrapperStyle={isBigIcon ? { justifyContent: 'space-between', marginBottom: hp(3) } : undefined}
        contentContainerStyle={{ paddingHorizontal: hp(3) }}
        ListHeaderComponent={
          <View style={{ paddingTop: hp(5), marginBottom: hp(2) }}>
          
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

  // no cat message
  noCatMessage: {
    fontSize: hp(3), 
    marginTop: hp(3),
    color: 'grey', 
    textAlign: 'center' 
  },
});
