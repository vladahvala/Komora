import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import JarNumCard from '../../components/CardsInCards/JarNumCard';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useConservation } from '../../context/ConservationContext';
import { launchImageLibrary } from 'react-native-image-picker';
import AnimatedButton from '../../animations/AnimatedButton';

type CardPageRouteProp = RouteProp<RootStackParamList, 'CardPage'>;

const CardPage = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const route = useRoute<CardPageRouteProp>();

  const { item } = route.params;  // card ConsMenuCard

  // card array, function for updating jars of a year
  const { conservations, updateJarHistory, updateImage, updateCategory } = useConservation();

  // current card 
  const currentItem = conservations.find(c => c.name === item.name);

  // Syncs local jar count changes with global state and AsyncStorage
  const updateJarCount = (key: keyof JarCounts, newCount: number) => {
    setJarCounts(prev => {
      const updated = { ...prev, [key]: newCount };
  
      setDrafts(d => ({
        ...d,
        [selectedYear]: updated,
      }));
  
      return updated;
    });
  };
  
  // changing img
  const [imageUri, setImageUri] = useState<string | null>(item.imageUri || null);

  // CATEGORY
  // category state
  const [selectedCategory, setSelectedCategory] = useState<string>(item.category);
  // category dropdown visibility
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  // categories list
  const categories = ['Мариновані', 'Солені', 'Квашені', 'Варення / Джеми', 'Компоти', 'Соуси / Кетчупи', 'Консерви в олії / жирі'];
  
  // YEARS
  // dropdown years
  const [dropdownVisible, setDropdownVisible] = useState(false);
  // years which have jars
  const availableYears = currentItem
  ? Object.keys(currentItem.history).sort((a, b) => Number(a) - Number(b))
  : [];
  // selected year
  const [selectedYear, setSelectedYear] = useState(availableYears[0] || '2021');

  // jars of the current year
  const [jarCounts, setJarCounts] = useState(
    currentItem ? currentItem.history[selectedYear] : { jar2_3l:0, jar4_2l:0, jar7_15l:0, jar2_1l:0, jar1_05l:0 }
  );
  const [drafts, setDrafts] = useState<Record<string, JarCounts>>({});

  // year change
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  
    if (drafts[year]) {
      setJarCounts(drafts[year]);      // return unsaved
    } else if (currentItem) {
      setJarCounts(currentItem.history[year]);
    }
  };
  

  // total Jars of CURRENT YEAR
  const totalJars = Object.values(jarCounts).reduce((sum, val) => sum + val, 0);

  // total Jars of ALL YEARs
  const totalJarsAllYears = currentItem
  ? Object.entries(currentItem.history).reduce((sum, [year, yearData]) => {
      const dataToCount = drafts[year] ?? yearData; // якщо є draft - беремо його
      const yearSum = Object.values(dataToCount).reduce((s, val) => s + val, 0);
      return sum + yearSum;
    }, 0)
  : 0;

  return (
    // MAIN CONTAINER
    <SafeAreaProvider style={styles.container}>
      <Pressable 
        style={{ flex: 1 }} 
        onPress={() => {
          dropdownVisible && setDropdownVisible(false);
          setCategoryDropdownVisible(false);
        }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            {/* ARROW TO MAIN MENU */}
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

            {/* TITLE TEXT */}
            <View style={styles.titleRow}>
              {/* TEXT */}
              <View style={styles.titleLeft}>
                  <Text style={styles.menuTitle}>{item.name}</Text>
              </View>

              {/* IMAGE */}
              <View style={styles.titleImageWrapper}>
                <Image
                  source={
                    imageUri
                      ? { uri: imageUri }   // user chose img
                      : require('../../../assets/images/default_conservation.png') // fallback
                  }
                  style={styles.titleImage}
                />

                {/* overlay for img change */}
                <Pressable
                  style={styles.imageOverlay}
                  onPress={() => {
                    launchImageLibrary(
                      { mediaType: 'photo', quality: 0.7 },
                      (response) => {
                        if (response.assets && response.assets.length > 0) {
                          setImageUri(response.assets[0].uri);

                          // img to context
                          if (currentItem) {
                            updateImage(currentItem.name, response.assets[0].uri);
                          }
                        }
                      }
                    );
                  }}
                >
                  <Text style={styles.imageOverlayText}>Змінити</Text>
                </Pressable>
              </View>
              
            </View>

            {/* CATEGORY */}
            <View style={{ marginTop: hp(2) }}>
              <Text style={styles.timeTitle}>Категорія:</Text>

              <View style={{ alignItems: 'center', marginTop: hp(1) }}>
                <Pressable
                  style={[
                    styles.bigIconContainerCat,
                    {
                      width: '100%', 
                    },
                  ]}
                  onPress={() => {
                    setCategoryDropdownVisible(prev => !prev);
                    setDropdownVisible(false); // close year dropdown
                  }}                  
                >
                  <Text style={styles.timeTitleCat}>{selectedCategory}</Text>
                  <Image
                    source={require('../../../assets/icons/frame_down.png')}
                    style={[
                      styles.arrowDownIconCat,
                      categoryDropdownVisible && { transform: [{ rotate: '180deg' }] },
                    ]}
                  />
                </Pressable>

                {/* Dropdown */}
                {categoryDropdownVisible && (
                  <View
                    style={[
                      styles.yearsDropdownContainer,
                      {
                        width: '100%',
                        marginLeft: 0, 
                      },
                    ]}
                  >
                    {categories.map(cat => (
                      <Pressable
                        key={cat}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedCategory(cat);
                          setCategoryDropdownVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{cat}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* TOTAL JAR COUNT */}
            <View style={styles.timeRow}> 
                <Text style={styles.timeTitle}>Загальна к-ть банок:</Text>
                <View style={styles.bigIconContainer}>
                  <Text style={styles.timeTitle}>{totalJarsAllYears}</Text>
                </View>
            </View>

            {/* CONSERVATION TIME */}
            <View style={{ marginTop: hp(2), flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.timeTitle, { marginRight: hp(2) }]}>Обрати рік:</Text>

              <View style={styles.yearDropdownWrapper}>
                <Pressable
                  style={styles.bigIconContainer}
                  onPress={() => {
                    setDropdownVisible(prev => !prev);
                    setCategoryDropdownVisible(false); // close category dropdown
                  }}                  
                >
                  <Text style={styles.timeTitle}>{selectedYear}</Text>
                  <Image
                    source={require('../../../assets/icons/frame_down.png')}
                    style={[
                      styles.arrowDownIcon,
                      dropdownVisible && { transform: [{ rotate: '180deg' }] },
                    ]}
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
                    image={require('../../../assets/jar_icons/empty_jar.png')} 
                    style={{ marginBottom: hp(4) }} 
                    label="2"             
                    circleLabel="3л"        
                    count={jarCounts.jar2_3l}
                    onChange={(newCount) => updateJarCount('jar2_3l', newCount)}
                  />
                  <JarNumCard 
                    image={require('../../../assets/jar_icons/empty_jar.png')}
                    style={{ marginBottom: hp(4) }}
                    label="4" 
                    circleLabel="2л"  
                    count={jarCounts.jar4_2l}
                    onChange={(newCount) => updateJarCount('jar4_2l', newCount)}
                  />
                  <JarNumCard 
                    image={require('../../../assets/jar_icons/empty_jar.png')}
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
                  image={require('../../../assets/jar_icons/empty_jar.png')} 
                  style={{ marginBottom: hp(4) }} 
                  label="2" 
                  circleLabel="1л" 
                  count={jarCounts.jar2_1l}
                  onChange={(newCount) => updateJarCount('jar2_1l', newCount)}
                />
                <JarNumCard 
                  image={require('../../../assets/jar_icons/empty_jar.png')} 
                  label="1" 
                  circleLabel="0.5л" 
                  count={jarCounts.jar1_05l}
                  onChange={(newCount) => updateJarCount('jar1_05l', newCount)}
                />
              </View>

            </View>

            {/* ADD CONSERVATION BUTTON */}
            <AnimatedButton
              onPress={() => {
                if (!currentItem) return;

                updateJarHistory(
                  currentItem.name,
                  selectedYear,
                  jarCounts
                );

                setDrafts(d => {
                  const copy = { ...d };
                  delete copy[selectedYear];
                  return copy;
                });

                navigation.goBack();
              }}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Зберегти зміни</Text>
            </AnimatedButton>

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
  // main container
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
    justifyContent: 'space-between', // left - text, right - img
    marginTop: hp(2),
  },
  titleLeft: {
    flex: 1,
    justifyContent: 'center',
    marginRight: hp(3), // distance between text & img
  },
  menuTitle: { 
    fontSize: hp(2.9), 
    fontWeight: '600', 
    color: 'black',
    textAlign: 'center', 
  },

  // IMAGE
  // img styles
  titleImageWrapper: {
    width: hp(22),
    height: hp(17),
    borderRadius: hp(2.5),
    overflow: 'hidden', 
  },
  titleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  // img change styles
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '25%',       
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlayText: {
    color: 'white',
    fontWeight: '600',
    fontSize: hp(2.2),
  },
  
  // input fields
  label: {
    fontSize: hp(2.2),
    fontWeight: '500',
    color: '#333',
    marginBottom: hp(0.5),
  },

  // general styles
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

  // DROPDOWN styles
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

  // CATEGORIES
  bigIconContainerCat: {
    flexDirection: 'row',    
    alignItems: 'center',      
    paddingHorizontal: hp(1.5),
    height: hp(6),       
    backgroundColor: '#00B4BF66',
    borderRadius: hp(1.5),
    justifyContent: 'center',
    position: 'relative',
  },
  arrowDownIconCat: {
    position: 'absolute',
    right: hp(1.5), 
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: 'contain',
  },
  timeTitleCat: {
    fontSize: hp(2.8), 
    fontWeight: '600', 
    color: 'black', 
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
  
});
