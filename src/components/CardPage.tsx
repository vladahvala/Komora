import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import JarNumCard from './JarNumCard';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useConservation } from '../context/ConservationContext';

type CardPageRouteProp = RouteProp<RootStackParamList, 'CardPage'>;

const CardPage = () => {
  const route = useRoute<CardPageRouteProp>();
  const { item } = route.params;  // card ConsMenuCard
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { conservations, updateJarHistory } = useConservation();

  const updateJarCount = (key: string, newCount: number) => {
    if (!currentItem) return;
  
    const newJarCounts = { ...jarCounts, [key]: newCount };
    setJarCounts(newJarCounts);
  
    // Оновлюємо в контексті і AsyncStorage
    updateJarHistory(currentItem.name, selectedYear, newJarCounts);
  };
  

  // Історія банок за роками
  // const [history, setHistory] = useState<{ [year: string]: Record<string, number> }>({
  //   2021: { jar2_3l: 2, jar4_2l: 1, jar7_15l: 0, jar2_1l: 1, jar1_05l: 3 },
  //   2022: { jar2_3l: 0, jar4_2l: 2, jar7_15l: 1, jar2_1l: 0, jar1_05l: 1 },
  // });

  // Десь разом із іншими useState
const [dropdownVisible, setDropdownVisible] = useState(false);

const currentItem = conservations.find(c => c.name === item.name);

const availableYears = currentItem ? Object.keys(currentItem.history) : [];
const [selectedYear, setSelectedYear] = useState(availableYears[0] || '2021');

  // Кількість банок для поточного року
  const [jarCounts, setJarCounts] = useState(
    currentItem ? currentItem.history[selectedYear] : { jar2_3l:0, jar4_2l:0, jar7_15l:0, jar2_1l:0, jar1_05l:0 }
  );

  // При зміні року
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    if (currentItem) {
      setJarCounts(currentItem.history[year]);
    }
  };
  
  

  // При зміні кількості банок
  // const updateJarCount = (key: string, newCount: number) => {
  //   const newJarCounts = { ...jarCounts, [key]: newCount };
  //   setJarCounts(newJarCounts);

  //   setHistory(prev => ({
  //     ...prev,
  //     [selectedYear]: newJarCounts,
  //   }));
  // };

  // Підсумок банок за поточний рік
  const totalJars = Object.values(jarCounts).reduce((sum, val) => sum + val, 0);

  // Сума банок за всі роки
  const totalJarsAllYears = currentItem
  ? Object.values(currentItem.history).reduce(
      (sum, yearData) =>
        sum + Object.values(yearData).reduce((s, val) => s + val, 0),
      0
    )
  : 0;


  const [newYear, setNewYear] = useState('');
  const { addYear } = useConservation();


  
  return (
    // MAIN CONTAINER
    <SafeAreaProvider style={styles.container}>
      <Pressable 
        style={{ flex: 1 }} 
        onPress={() => dropdownVisible && setDropdownVisible(false)}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            {/* ARROW TO MAIN MENU */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('ConservationNavigation')} 
              style={styles.arrowWrapper}
              activeOpacity={1}  
            >
              <View style={styles.arrowTouchArea}>
                <Image
                  source={require('../../assets/icons/arrow.png')}
                  style={styles.arrowIcon}
                />
              </View>
            </TouchableOpacity>

            {/* TITLE TEXT */}
            <View style={styles.titleRow}>
              {/* Ліва частина — текст */}
              <View style={styles.titleLeft}>
                  <Text style={styles.menuTitle}>{item.name}</Text>
              </View>

              {/* Права частина — картинка */}
              <View style={styles.titleImageWrapper}>
                <Image
                  source={
                    item.imageUri
                      ? { uri: item.imageUri }   // якщо користувач вибрав фото
                      : require('../../assets/images/default_conservation.png') // fallback
                  }
                  style={styles.titleImage}
                />
              </View>

          </View>



          <View style={styles.timeRow}> 
              <Text style={styles.timeTitle}>Загальна к-ть банок:</Text>
              <View style={styles.bigIconContainer}>
                <Text style={styles.timeTitle}>{totalJarsAllYears}</Text>
              </View>
          </View>

            {/* CONSERVATION TIME */}
            {/* <View style={styles.timeRow}> 
              <Text style={styles.timeTitle}>Час консервації:</Text>
              <Pressable style={styles.bigIconContainer}>
                <Text style={styles.timeTitle}>2021</Text>
              </Pressable>
            </View> */}

  {/* Вибір року */}
  <View style={{ marginTop: hp(2), flexDirection: 'row', alignItems: 'center' }}>
    <Text style={[styles.timeTitle, { marginRight: hp(2) }]}>Обрати рік:</Text>

    <View style={styles.yearDropdownWrapper}>
      <Pressable
        style={styles.bigIconContainer}
        onPress={() => setDropdownVisible(prev => !prev)}
      >
        <Text style={styles.timeTitle}>{selectedYear}</Text>
        <Image
          source={require('../../assets/icons/frame_down.png')}
          style={styles.arrowDownIcon}
        />
      </Pressable>

      {/* Dropdown */}
      {dropdownVisible && (
        <View style={styles.yearsDropdownContainer}>
          {availableYears.map((year) => (
            <Pressable
              key={year}
              style={styles.dropdownItem}
              onPress={() => {
                handleYearChange(year);
                setDropdownVisible(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{year}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  </View>

            <View style={styles.leftCol}>
              {/* LEFT COLUMN 3 CARDS */}
              <View style={{ paddingHorizontal: hp(3.2), justifyContent: 'flex-start' }}>
                <View style={{ justifyContent: 'flex-start' }}>
                <JarNumCard 
                image={require('../../assets/jar_icons/empty_jar.png')} 
                style={{ marginBottom: hp(4) }} 
                label="2"             
                circleLabel="3л"        
                count={jarCounts.jar2_3l}
                onChange={(newCount) => updateJarCount('jar2_3l', newCount)}
              />
              <JarNumCard 
                image={require('../../assets/jar_icons/empty_jar.png')}
                style={{ marginBottom: hp(4) }}
                label="4" 
                circleLabel="2л"  
                count={jarCounts.jar4_2l}
                onChange={(newCount) => updateJarCount('jar4_2l', newCount)}
              />
              <JarNumCard 
                image={require('../../assets/jar_icons/empty_jar.png')}
                label="7" 
                circleLabel="1.5л"
                count={jarCounts.jar7_15l}
                onChange={(newCount) => updateJarCount('jar7_15l', newCount)}
              />
                </View>
              </View>

              {/* RIGHT COLUMN 2 CARDS */}
              <View style={{ justifyContent: 'center' }}>
              <JarNumCard 
                image={require('../../assets/jar_icons/empty_jar.png')} 
                style={{ marginBottom: hp(4) }} 
                label="2" 
                circleLabel="1л" 
                count={jarCounts.jar2_1l}
                onChange={(newCount) => updateJarCount('jar2_1l', newCount)}
              />
              <JarNumCard 
                image={require('../../assets/jar_icons/empty_jar.png')} 
                label="1" 
                circleLabel="0.5л" 
                count={jarCounts.jar1_05l}
                onChange={(newCount) => updateJarCount('jar1_05l', newCount)}
              />
              </View>
            </View>

            {/* ADD CONSERVATION BUTTON */}
            <Pressable style={styles.addButton}>
              <Text style={styles.addButtonText}>Зберегти зміни</Text>
            </Pressable>

            <View style={styles.timeRow}> 
            <Text style={styles.timeTitle}>К-ть банок за рік {selectedYear}:</Text>
            <View style={styles.bigIconContainer}>
              <Text style={styles.timeTitleNum}>{totalJars}</Text>
            </View>
          </View>
          </View>

          
        </ScrollView>
      </Pressable>
    </SafeAreaProvider>
  );
};

export default CardPage;

const styles = StyleSheet.create({
  // main cintainer
  container: { 
    flex: 1, 
    backgroundColor: '#F7F9FD',
    paddingHorizontal: hp(3.2),
  },
  scrollContent: {
    paddingBottom: hp(4), 
  },
  headerContainer: { 
    paddingTop: hp(5), 
    marginBottom: hp(2), 
    paddingHorizontal: hp(1), 
  },

  // arrow styles
  arrowWrapper: {
    alignSelf: 'flex-start',
    marginBottom: hp(1),
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

  // title text
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // текст зліва, картинка справа
    marginTop: hp(2),
  },
  
  titleLeft: {
    flex: 1,
    justifyContent: 'center',
    marginRight: hp(3), // відстань між текстом і картинкою
  },
  
  titleRight: {
    flex: 1,
    // alignItems: 'flex-end',
    // можна ще marginLeft замість marginRight у тексті
  },
  
  
  menuTitle: { 
    fontSize: hp(2.9), 
    fontWeight: '600', 
    color: 'black',
    textAlign: 'center', 
  },
  
  titleImageWrapper: {
    width: hp(22),
    height: hp(17),
    borderRadius: hp(2.5),
    overflow: 'hidden', // обов'язково, щоб картинка обрізалася по кутах
  },
  titleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // краще, ніж contain, щоб заповнити весь wrapper
  },
  

  // input fields
  label: {
    fontSize: hp(2.2),
    fontWeight: '500',
    color: '#333',
    marginBottom: hp(0.5),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderWidth: hp(0.25),
    borderRadius: hp(1.5),
    paddingHorizontal: hp(1.5),
    height: hp(6),
  },
  searchInput: {
    flex: 1,
    fontSize: hp(2.2),
    color: '#000',
  },

  // time row styles
  timeRow: {
    flexDirection: 'row',     
    alignItems: 'center', 
    marginTop: hp(3),    
  },
  timeTitle: {
    fontSize: hp(3), 
    fontWeight: '600', 
    color: 'black', 
  },
  timeTitleNum: {
    fontSize: hp(2.7), 
    fontWeight: '600', 
    color: 'black',
  },
  bigIconContainer: {
    flexDirection: 'row',    
    alignItems: 'center',      
    paddingHorizontal: hp(1.5),
    height: hp(6),
    marginLeft: hp(2),         
    backgroundColor: '#00B4BF66',
    borderRadius: hp(1.5),
    justifyContent: 'center',
  },

// DROPDOWN
yearDropdownWrapper: {
  position: 'relative', 
},
yearsDropdownContainer: {
  position: 'absolute',
  top: '100%',
  left: 0,
  width: '90%',          
  backgroundColor: '#F6F6F6',
  borderWidth: 1,
  borderColor: '#AEAEAE',
  borderRadius: hp(1.5),
  marginLeft: hp(2),
  marginTop: hp(0.5),
  zIndex: 100,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 5,
},
dropdownItem: {
  paddingVertical: hp(1.5),
  paddingHorizontal: hp(2),
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
dropdownItemText: {
  fontSize: hp(2.2),
  color: '#333',
  textAlign: 'center',
},
arrowDownIcon: {
  width: hp(2.5),
  height: hp(2.5),
  resizeMode: 'contain',
  marginLeft: hp(1), 
},


  // left column
  leftCol: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: hp(4) 
  },

  // button styles
  addButton: {
    marginTop: hp(4),
    paddingHorizontal: hp(2),  
    height: hp(6.5),
    borderRadius: hp(3.25),
    backgroundColor: '#00B4BF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',       
  },  
  addButtonText: {
    fontSize: hp(2.6),
    fontWeight: '700',
    color: 'black',
  },

  imageContainer: {
    marginLeft: hp(2),
    marginRight: hp(2),
    marginTop: hp(0.3),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,      
    transform: [{ scaleY: 0.85 }],  
    borderRadius: hp(1.5),
  },

  
});
