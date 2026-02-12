import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import AlertModal from '../../modals/AlertModal';
import { ConservationContext, ConservationItem } from '../../context/ConservationContext';
import { useContext } from 'react';
import { Keyboard } from 'react-native';
import AnimatedButton from '../../animations/AnimatedButton';
import ImagePickerBlock from '../../components/form/images/ImagePickerBlock';
import CategoryDropdown from '../../components/form/categories/CategoryDropdown';
import LabeledInput from '../../components/form/LabeledInput';
import YearPicker from '../../components/form/years/YearPicker';
import JarGrid from '../../components/form/jars/JarGrid';

const AddConservation = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // func addConservation from context
  const { addConservation } = useContext(ConservationContext);

  // image field
  const [imageUri, setImageUri] = useState<string | null>(null);

  // name field
  const [name, setName] = useState('');

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // period field
  const [period, setPeriod] = useState('');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // years dropdown menu
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const [isYearOpen, setIsYearOpen] = useState(false);

  const years = ['2021', '2022', '2023', '2024', '2025', '2026'];

  // jars count
   const [jarCounts, setJarCounts] = useState({
    jar2_3l: 0,
    jar4_2l: 0,
    jar7_15l: 0,
    jar2_1l: 0,
    jar1_05l: 0,
  });

  // alerts 
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const validateConservation = () => {
    if (!name) return 'Введіть назву консервації!';
    if (!selectedCategory) return 'Оберіть категорію!';
    const totalJars = Object.values(jarCounts).reduce((sum, val) => sum + val, 0);
    if (totalJars === 0) return 'Додайте хоча б одну банку!';
    return null;
  };  

  const resetForm = () => {
    setName('');
    setPeriod('');
    setSelectedCategory(null);
    setSelectedYear('2021');
    setJarCounts({
      jar2_3l: 0,
      jar4_2l: 0,
      jar7_15l: 0,
      jar2_1l: 0,
      jar1_05l: 0,
    });
    setImageUri(null);
  };

  const handleAddConservation = () => {
    const errorMessage = validateConservation();
    if (errorMessage) {
      setModalMessage(errorMessage);
      setModalVisible(true);
      return;
    }

    // creating obj
    const newItem: ConservationItem = {
      name,
      category: selectedCategory!,
      imageUri,
      history: {
        [selectedYear || '2021']: {
          jarCounts: jarCounts,
          period: Number(period) || 0
        },
      },
    };
  
    // adding obj to context
    addConservation(newItem);

    // clearing fields
    resetForm();
    navigation.goBack();
  };

  return (
    // MAIN CONTAINER
    <Pressable
      style={{ flex: 1 }}
      onPress={() => {
        Keyboard.dismiss();
        setIsCategoryOpen(false);
        setIsYearOpen(false);
      }}
    >
      <SafeAreaProvider style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            {/* ARROW TO MAIN MENU */}
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

            {/* TITLE TEXT */}
            <Text style={styles.menuTitle}>Нова консервація</Text>

            <ImagePickerBlock 
              imageUri={imageUri}
              setImageUri={setImageUri}
            />

            {/* FIRST INPUT WITH LABEL */}
            <LabeledInput label="Назва" value={name} onChangeText={setName} />

            {/* CATEGORIES INPUT WITH DROPDOWN */}
            <CategoryDropdown
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              isOpen={isCategoryOpen}
              onToggle={() => {
                setIsYearOpen(false);
                setIsCategoryOpen(prev => !prev);
              }}
              onClose={() => setIsCategoryOpen(false)}
            />

            {/* CONSERVATION PERIOD */}
            <LabeledInput label="Термін консервації (в роках)" value={period} onChangeText={setPeriod} keyboardType="numeric" />

            {/* CONSERVATION TIME */}
            <View style={styles.timeRow}> 
              <Text style={styles.timeTitle}>Початок{'\n'}зберігання:</Text>
              <YearPicker
                selectedYear={selectedYear}
                onSelect={setSelectedYear}
                isOpen={isYearOpen}
                onToggle={() => {
                  setIsCategoryOpen(false);
                  setIsYearOpen(prev => !prev);
                }}
                years={years} 
                onClose={() => setIsYearOpen(false)}
              />
            </View>

            {/* JAR NUM */}
            <Text style={styles.jarNumTitle}>Кількість банок</Text>
            <JarGrid jarCounts={jarCounts} setJarCounts={setJarCounts} />

            {/* ALERTS MODALS (required fields empty) */}
            <AlertModal
              visible={modalVisible}
              message={modalMessage}
              onClose={() => setModalVisible(false)}
            />

            {/* ADD CONSERVATION BUTTON */}
            <AnimatedButton
              onPress={handleAddConservation}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Додати консервацію</Text>
            </AnimatedButton>

          </View>
        </ScrollView>
      </SafeAreaProvider>
    </Pressable>
  );
};

export default AddConservation;

const styles = StyleSheet.create({
  // main container
  container: { 
    flex: 1, 
    backgroundColor: '#FFF',
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
  menuTitle: { 
    fontSize: hp(3.5), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'center',
  },

  // time row styles
  timeRow: {
    flexDirection: 'row',     
    alignItems: 'center', 
    marginTop: hp(3),
    position: 'relative',    
  },
  timeTitle: {
    fontSize: hp(3),
    marginRight: hp(3), 
    fontWeight: '600', 
    color: 'black', 
  },

  // jar num title 
  jarNumTitle: {
    fontSize: hp(3.5), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'center', 
    marginTop: hp(3),  
  },

  // button styles
  addButton: {
    marginTop: hp(2),
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
