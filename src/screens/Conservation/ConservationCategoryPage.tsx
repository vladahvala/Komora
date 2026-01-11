import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Keyboard,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRoute, useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConsMenuCard from '../../components/ConsMenuCard';
import ConsMenuCardSmall from '../../components/ConsMenuCardSmall';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RootStackParamList } from '../../navigation';

const ConservationCategoryPage = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const selectedCategory = route.params?.category || '';

  const [items, setItems] = useState([]);
  const [isBigIcon, setIsBigIcon] = useState(true); // великі/малі картки

  // Завантажуємо дані з AsyncStorage
  useFocusEffect(
    React.useCallback(() => {
      const loadItems = async () => {
        const storedData = await AsyncStorage.getItem('conservations');
        const allItems = storedData ? JSON.parse(storedData) : [];
        const filteredItems = allItems.filter((item: any) => item.category === selectedCategory);
        setItems(filteredItems);
      };
      loadItems();
    }, [selectedCategory])
  );

  // Функція оновлення банок
  const handleUpdate = (id: number, updatedJars: any, year: string) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id !== id) return item;
  
        // Якщо years ще немає — створюємо і переносимо старий рік
        let yearsObj = item.years || {};
        if (!item.years && item.year && item.jars) {
          yearsObj[item.year] = item.jars;
        }
  
        // Оновлюємо банки для поточного року
        yearsObj[year] = updatedJars;
  
        return { ...item, years: yearsObj, year: undefined, jars: undefined };
      })
    );
  };
  

  const toggleIcon = () => setIsBigIcon(prev => !prev); // перемикання великі/малі

  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <SafeAreaProvider style={styles.container}>
        {/* HEADER ЗІ СТРІЛКОЮ */}
        <View style={styles.headerContainer}>
  {/* Рядок 1: стрілка назад */}
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

  {/* Рядок 2: назва категорії */}
  <Text style={styles.categoryTitle}>{selectedCategory}</Text>

  {/* Рядок 3: іконка перемикання карток, по центру */}
 {/* Рядок 3: іконка перемикання карток (тільки якщо є картки) */}
{items.length > 0 && (
  <View style={styles.iconRow}>
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
)}


</View>


        <FlatList
          key={isBigIcon ? 'big' : 'small'}
          data={items}
          renderItem={({ item, index }) =>
            isBigIcon ? (
              <ConsMenuCard item={item} index={index} onUpdate={handleUpdate} />
            ) : (
              <ConsMenuCardSmall item={item} index={index} onUpdate={handleUpdate} />
            )
          }
          numColumns={isBigIcon ? 2 : 1}
          columnWrapperStyle={isBigIcon ? { justifyContent: 'space-between', marginBottom: 25 } : undefined}
          contentContainerStyle={{
            paddingHorizontal: 27,
            paddingBottom: 50,
            paddingTop: hp(2),
          }}
        />
      </SafeAreaProvider>
    </Pressable>
  );
};

export default ConservationCategoryPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FD' },

  // header
  headerContainer: {
    paddingTop: hp(5),
    paddingHorizontal: hp(3),
    paddingBottom: hp(3),
  },
  
  arrowWrapper: {
    // стрілка вгорі
    alignSelf: 'flex-start',
  },
  
  arrowTouchArea: {
    padding: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  arrowIcon: {
    width: hp(3.2),
    height: hp(3),
    resizeMode: 'contain',
  },
  
  categoryTitle: {
    fontSize: hp(3.5),
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    marginTop: hp(2),
  },
  
  iconRow: {
    marginTop: hp(4),
    alignItems: 'center',
  },
  
  bigIconContainer: {
    width: hp(6),
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(1.5),
    backgroundColor: '#00B4BF66',
  },
  
  bigIconImage: {
    width: hp(3),
    height: hp(3),
    resizeMode: 'contain',
  },
  

});
