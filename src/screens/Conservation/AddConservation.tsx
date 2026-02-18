import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import AlertModal from '../../modals/AlertModal';
import { Keyboard } from 'react-native';
import AnimatedButton from '../../animations/AnimatedButton';
import CategoryDropdown from '../../components/form/categories/CategoryDropdown';
import LabeledInput from '../../components/form/common/LabeledInput';
import YearPicker from '../../components/form/years/YearPicker';
import JarGrid from '../../components/form/jars/JarGrid';
import FormHeaderWithImage from '../../components/form/common/FormHeaderWithImage';
import { useConservationForm } from '../../hooks/Conservation/useConservationForm';

const AddConservation = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const form = useConservationForm();

  const years = ['2021', '2022', '2023', '2024', '2025', '2026'];

  return (
    // MAIN CONTAINER
    <Pressable
      style={{ flex: 1 }}
      onPress={() => {
        Keyboard.dismiss();
        form.setIsCategoryOpen(false);
        form.setIsYearOpen(false);
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

            {/* HEADER (ARROW-BACK, TITLE, IMAGE) */}
            <FormHeaderWithImage
              title="Нова консервація"
              imageUri={form.imageUri}
              setImageUri={form.setImageUri}
              onBack={() => navigation.navigate('MainMenu')}
            />

            {/* FIRST INPUT WITH LABEL (NAME) */}
            <LabeledInput 
              label="Назва" 
              value={form.name} 
              onChangeText={form.setName} 
            />

            {/* CATEGORIES INPUT WITH DROPDOWN */}
            <CategoryDropdown
              selected={form.selectedCategory}
              onSelect={form.setSelectedCategory}
              isOpen={form.isCategoryOpen}
              onToggle={() => {
                form.setIsYearOpen(false);
                form.setIsCategoryOpen(prev => !prev);
              }}
              onClose={() => form.setIsCategoryOpen(false)}
            />

            {/* CONSERVATION PERIOD INPUT */}
            <LabeledInput 
              label="Термін консервації (в роках)" 
              value={form.period} 
              onChangeText={form.setPeriod} 
              keyboardType="numeric" 
            />

            {/* CONSERVATION TIME */}
            <View style={styles.timeRow}> 
              <Text style={styles.timeTitle}>Початок{'\n'}зберігання:</Text>
              <YearPicker
                selectedYear={form.selectedYear}
                onSelect={form.setSelectedYear}
                isOpen={form.isYearOpen}
                onToggle={() => {
                  form.setIsCategoryOpen(false);
                  form.setIsYearOpen(prev => !prev);
                }}
                years={years} 
                onClose={() => form.setIsYearOpen(false)}
                fontSize={hp(3)}
              />
            </View>

            {/* JAR NUM */}
            <Text style={styles.jarNumTitle}>Кількість банок</Text>
            <JarGrid 
              jarCounts={form.jarCounts} 
              setJarCounts={form.setJarCounts} 
            />

            {/* ALERTS MODALS (required fields empty) */}
            <AlertModal
              visible={form.modalVisible}
              message={form.modalMessage}
              onClose={() => form.setModalVisible(false)}
            />

            {/* ADD CONSERVATION BUTTON */}
            <AnimatedButton
              onPress={form.handleAddConservation}
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
