import React from 'react';
import { Text, StyleSheet, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useRoute, RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '../../navigation';

import AnimatedButton from '../../animations/AnimatedButton';
import JarGrid from '../../components/form/jars/JarGrid';
import CategoryDropdown from '../../components/form/categories/CategoryDropdown';
import CardHeader from '../../components/form/common/CardHeader';
import YearAndExpiration from '../../components/form/years/YearAndExpiration';
import TotalJars from '../../components/form/jars/TotalJars';
import YearTotalJarsRow from '../../components/form/jars/YearTotalJarsRow';
import { useCardPage } from '../../hooks/Conservation/useCardPage';

type CardPageRouteProp = RouteProp<RootStackParamList, 'CardPage'>;

const CardPage = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const route = useRoute<CardPageRouteProp>();
  const { item } = route.params;

  const {
    // Category Selection
    selectedCategory,
    setSelectedCategory,
    setCategoryDropdownVisible,

    // Image Handling 
    imageUri,
    handleImageChange,

    // Years 
    availableYears,

    // Save Action 
    handleSave,

    // Jar Management (from useJarManager)
    selectedYear,
    jarCounts,
    setJarCounts,
    handleYearChange,
    totalJarsCurrentYear,
    totalJarsAllYears,
    expirationYear,
    isExpired,

    // Dropdown Control 
    openDropdown,
    setOpenDropdown,
  } = useCardPage(item);

  return (
    <SafeAreaProvider style={styles.container}>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          if (openDropdown) setOpenDropdown(null);
          setCategoryDropdownVisible(false); 
        }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
          <View style={styles.innerContainer}>
            {/* HEADER (ARROW-BACK, TITLE, IMAGE) */}
            <CardHeader
              name={item.name}
              imageUri={imageUri}
              onImageChange={handleImageChange}
              onBack={() => navigation.goBack()}
            />

            {/* CATEGORY */}
            <Text style={styles.title}>Категорія:</Text>
            <CategoryDropdown
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              isOpen={openDropdown === 'category'}
              onToggle={() =>
                setOpenDropdown(prev => (prev === 'category' ? null : 'category'))
              }
              onClose={() => setOpenDropdown(null)}
              inputStyle={styles.bigIconContainerCat}
              textStyle={styles.timeTitleCat}
              dropdownStyle={styles.DropdownContainer}
              itemTextStyle={styles.dropdownItemText}
              labelStyle={styles.label}
            />

            {/* TOTAL JARS */}
            <TotalJars
              totalJarsAllYears={totalJarsAllYears}
              totalJarsCurrentYear={totalJarsCurrentYear}
              selectedYear={selectedYear}
            />

            {/* YEARS + EXPIRATION */}
            <YearAndExpiration
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
              years={availableYears}
              expirationYear={expirationYear}
              isExpired={isExpired}
              openDropdown={openDropdown === 'year'}
              setOpenDropdown={(val) => setOpenDropdown(val ? 'year' : null)}
            />

            {/* JAR NUM */}
            <JarGrid
              jarCounts={jarCounts}
              setJarCounts={setJarCounts}
            />

            {/* SAVE BUTTON */}
            <AnimatedButton onPress={() => handleSave(navigation)} style={styles.addButton}>
              <Text style={styles.addButtonText}>Зберегти зміни</Text>
            </AnimatedButton>

            <YearTotalJarsRow
              totalJarsCurrentYear={totalJarsCurrentYear}
              selectedYear={selectedYear}
            />
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
    backgroundColor: '#FFF',
  },
  innerContainer: {
    paddingTop: hp(5),
    paddingHorizontal: hp(3.2),
  },  
  scrollContent: {
    paddingBottom: hp(4),
  },

  // title styles
  title: {
    fontSize: hp(3),
    fontWeight: '600',
    color: 'black',
  },

  // dropdown styles
  DropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%', 
    marginLeft: 0, 
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#AEAEAE',
    borderRadius: hp(1.5),
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
  bigIconContainerCat: {
    flexDirection: 'row',
    width: '100%',
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

  // label
  label: {
    display: 'none',
  },

  // button styles
  addButton: {
    marginTop: hp(1),
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
