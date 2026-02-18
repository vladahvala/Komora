import React from 'react';
import { View, Text, StyleSheet, ScrollView, } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AnimatedButton from '../../animations/AnimatedButton';
import JarColumn from '../../components/form/jars/JarColumn';
import TotalJars from '../../components/form/jars/TotalJars';
import { useEmptyJarsForm } from '../../hooks/Conservation/useEmptyJarsForm';
import BackButton from '../../components/form/common/BackButton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';

const EmptyJarsConservation = () => {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleBack = () => {
    navigation.goBack();
  };

  const { localJars, setLocalJars, totalJars, saveChanges } = useEmptyJarsForm();

  return (
    // MAIN CONTAINER
    <SafeAreaProvider style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          {/* ARROW TO MAIN MENU */}
          <BackButton onPress={handleBack} />

          {/* TITLE TEXT */}
          <Text style={styles.menuTitle}>Кількість порожніх банок</Text>

          {/* JAR CARDS */}
          <JarColumn jarCounts={localJars} setJarCounts={setLocalJars} />


          {/* TOTAL JARS */}
          <TotalJars label="Загальна к-ть банок:" value={totalJars} />


          {/* ADD CONSERVATION BUTTON */}
          <AnimatedButton onPress={saveChanges} style={styles.addButton}>
            <Text style={styles.addButtonText}>Зберегти зміни</Text>
          </AnimatedButton>

        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default EmptyJarsConservation;

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
  
  // title text
  menuTitle: { 
    fontSize: hp(3.3), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'center',
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
