import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useConservation } from '../../context/ConservationContext';
import AnimatedButton from '../../animations/AnimatedButton';
import JarGrid from '../../components/form/jars/JarGrid';
import CategoryDropdown from '../../components/form/categories/CategoryDropdown';
import CardHeader from '../../components/form/CardHeader';
import YearAndExpiration from '../../components/form/years/YearAndExpiration';
import TotalJars from '../../components/form/jars/TotalJars';
import YearTotalJarsRow from '../../components/form/years/YearTotalJarsRow';

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
  const [selectedYear, setSelectedYear] = useState('2021');

  
  // 1) коли currentItem з’являється — ставимо рік
  useEffect(() => {
    if (!currentItem) return;
  
    const years = Object.keys(currentItem.history);
    const firstYear = years[0] ?? '2021';
  
    setSelectedYear(firstYear);
  
    const counts = currentItem.history[firstYear]?.jarCounts ?? emptyJarCounts;
    setJarCounts(counts);

  }, [currentItem]);
  
  
  useEffect(() => {
    if (!currentItem) return;
  
    const counts = currentItem.history[selectedYear]?.jarCounts ?? emptyJarCounts;
    setJarCounts(counts);
    
  }, [selectedYear, currentItem]);
  
  

  const selectedHistory = currentItem?.history[selectedYear];

  const expirationYear = selectedHistory
    ? Number(selectedYear) + selectedHistory.period
    : null;

  const isExpired = expirationYear
    ? new Date().getFullYear() > expirationYear
    : false;

  // jars of the current year
  const emptyJarCounts: JarCounts = {
    jar2_3l: 0,
    jar4_2l: 0,
    jar7_15l: 0,
    jar2_1l: 0,
    jar1_05l: 0,
  };
  
  const [jarCounts, setJarCounts] = useState<JarCounts>(
    currentItem?.history[selectedYear]?.jarCounts ?? emptyJarCounts
  );
  
  const [period, setPeriod] = useState<number>(0);
  const [drafts, setDrafts] = useState<Record<string, JarCounts>>({});

  // year change
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  
    if (drafts[year]) {
      setJarCounts(drafts[year]);
      setPeriod(currentItem?.history[year]?.period ?? 0);
    } else if (currentItem?.history[year]) {
      setJarCounts(currentItem.history[year].jarCounts);
      setPeriod(currentItem.history[year].period);
    } else {
      setJarCounts(emptyJarCounts);
      setPeriod(0);
    }
  };

  // total Jars of CURRENT YEAR
  const totalJars = Object.values(jarCounts).reduce((sum, v) => sum + v, 0);

  // total Jars of ALL YEARs
  const totalJarsAllYears = currentItem
  ? Object.entries(currentItem.history).reduce((sum, [year, yearData]) => {
      const dataToCount = drafts[year] ?? yearData.jarCounts ?? emptyJarCounts;
      const yearSum = Object.values(dataToCount).reduce((s, val) => s + val, 0);
      return sum + yearSum;
    }, 0)
  : 0;

  useEffect(() => {
    if (!currentItem) return;
  
    const years = Object.keys(currentItem.history);
    const firstYear = years[0] ?? '2021';
  
    setSelectedYear(firstYear);
  
    const counts = currentItem.history[firstYear]?.jarCounts ?? emptyJarCounts;
    setJarCounts(counts);
  }, [currentItem]);
  
  
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
           <CardHeader
              name={item.name}
              imageUri={imageUri}
              onImageChange={(uri) => {
                setImageUri(uri);
                if (currentItem) updateImage(currentItem.name, uri);
              }}
              onBack={() => navigation.goBack()}
            />

            {/* CATEGORY */}
            <Text style={styles.timeTitle}>Категорія:</Text>
            <CategoryDropdown
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              isOpen={categoryDropdownVisible}
              onToggle={() => setCategoryDropdownVisible(prev => !prev)}
              onClose={() => setCategoryDropdownVisible(false)}
              inputStyle={[styles.bigIconContainerCat, { width: '100%' }]}
              textStyle={styles.timeTitleCat}
              dropdownStyle={[styles.yearsDropdownContainer, { width: '100%', marginLeft: 0 }]}
              itemTextStyle={styles.dropdownItemText}
              labelStyle={{ display: 'none' }} 
            />

            {/* TOTAL JAR COUNT */}
            <TotalJars
              totalJarsAllYears={totalJarsAllYears}
              totalJarsCurrentYear={totalJars}
              selectedYear={selectedYear}
            />

            {/* CONSERVATION TIME */}
            <YearAndExpiration
              selectedYear={selectedYear}      
              onYearChange={handleYearChange}   
              years={availableYears}           
              expirationYear={expirationYear}   
              isExpired={isExpired}             
            />

            <JarGrid
              jarCounts={jarCounts}
              setJarCounts={setJarCounts}
            />

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

            <YearTotalJarsRow
              totalJarsCurrentYear={totalJars}
              selectedYear={selectedYear}
            />

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
    backgroundColor: '#FFF',
    paddingHorizontal: hp(3.2),
    paddingTop: hp(5), 
  },
  scrollContent: {
    paddingBottom: hp(4), 
  },

  // general styles
  timeTitle: {
    fontSize: hp(3), 
    fontWeight: '600', 
    color: 'black', 
  },

  // DROPDOWN styles
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
  dropdownItemText: {
    fontSize: hp(2.2),
    color: '#333',
    textAlign: 'center',
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
  timeTitleCat: {
    fontSize: hp(2.8), 
    fontWeight: '600', 
    color: 'black', 
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
