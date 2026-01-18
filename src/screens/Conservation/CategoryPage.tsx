import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FlatList, View, Text, TouchableOpacity, Image, Pressable, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useContext, useState } from 'react';
import ConsMenuCard from '../../components/BigCards/ConsMenuCard';
import ConsMenuCardSmall from '../../components/SmallCards/ConsMenuCardSmall';
import { ConservationContext } from '../../context/ConservationContext';

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

            {filteredConservations.length > 0 && (
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
            ) || 
            <Text style={styles.noCatMessage}>Поки в цій категорії немає жодної картки!</Text>}
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
  headerContainer: { 
    paddingTop: hp(5), 
    marginBottom: hp(2), 
    paddingHorizontal: hp(1), 
  },

  // arrow back
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

  // cat title
  menuTitle: { 
    fontSize: hp(3.5), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'center' 
  },

  // toggle styles
  bigIconContainer: {
    width: hp(6),
    height: hp(6),
    marginTop: hp(1),
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

  // no cat message
  noCatMessage: {
    fontSize: hp(3), 
    marginTop: hp(3),
    color: 'grey', 
    textAlign: 'center' 
  },
});
