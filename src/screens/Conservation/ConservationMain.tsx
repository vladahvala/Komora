import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ConsMenuCard from '../../components/ConsMenuCard';
import data from '../../../data/data';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import navigation, { RootStackParamList } from '../../navigation';

const ConservationMain = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <SafeAreaProvider style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <ConsMenuCard item={item} index={index} />
        )}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 25,     
        }}
        contentContainerStyle={{
          paddingHorizontal: 27,
        }}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {/* Стрілка зверху зліва */}
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
            
            {/* Текст “Меню” під стрілкою */}
            <Text style={styles.menuTitle}>Консервація</Text>
            <Text style={styles.menuTextMain}>Хочете знайти потрібну консервацію?</Text>
            <Text style={styles.menuTextSecondary}>Скористайтесь полем пошуку</Text>

            <View style={styles.searchRow}>
              <View style={styles.searchContainer}>
                <Image
                  source={require('../../../assets/icons/search.png')}
                  style={styles.searchIcon}
                />
                <TextInput
                  placeholder="Пошук..."
                  style={styles.searchInput}
                  placeholderTextColor="#999"
                />
              </View>
              
               {/* Квадрат із іконкою всередині */}
              <View style={styles.bigIconContainer}>
                <Image
                  source={require('../../../assets/icons/big_icons.png')}
                  style={styles.bigIconImage}
                />
              </View>
            </View>

          </View>
        }
      />
    </SafeAreaProvider>
  );
};

export default ConservationMain;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F7F9FD' 
  },
  headerContainer: { 
    paddingTop: hp(5), 
    marginBottom: hp(2), 
    paddingHorizontal: 1 
  },
  arrowWrapper: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  arrowTouchArea: {
    padding: 10,          
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: { 
    width: 26, 
    height: 24,
  },  
  menuTitle: { 
    fontSize: hp(3.5), 
    marginBottom: hp(3), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'center' 
  },
  menuTextMain: { 
    fontSize: hp(3.2), 
    marginBottom: hp(0.5), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'left' 
  },
  menuTextSecondary: { 
    fontSize: hp(2.5), 
    fontWeight: '400', 
    color: 'grey', 
    textAlign: 'left' 
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2.3),
    marginBottom: hp(2),
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderColor: '#00B4BF',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: hp(6),
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: hp(2.2),
    color: '#000',
  },
  bigIconContainer: {
    width: hp(6),
    height: hp(6),
    marginLeft: 20,             // відстань від поля пошуку
    backgroundColor: '#00B4BF66',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigIconImage: {
    width: hp(3),               // іконка менша за квадрат
    height: hp(3),
    resizeMode: 'contain',
  },
  
  
});
