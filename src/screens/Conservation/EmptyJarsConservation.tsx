import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Pressable, ScrollView, Animated } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import JarNumCard from '../../components/CardsInCards/JarNumCard';
import { useConservation } from '../../context/ConservationContext';
import AnimatedButton from '../../animations/AnimatedButton';
import JarColumn from '../../components/form/jars/JarColumn';
import TotalJars from '../../components/form/jars/TotalJars';

const EmptyJarsConservation = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // jars count
  const { emptyJars, updateEmptyJars } = useConservation();

  // local changes by user
  const [localJars, setLocalJars] = useState(emptyJars);
  // sync local changes with context
  useEffect(() => {
    setLocalJars(emptyJars);
  }, [emptyJars]);

  // all empty jars count
  const totalJars = Object.values(localJars).reduce((sum, val) => sum + val, 0);

  return (
    // MAIN CONTAINER
    <SafeAreaProvider style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
          <Text style={styles.menuTitle}>Кількість порожніх банок</Text>

          {/* JAR CARDS */}
          <JarColumn jarCounts={localJars} setJarCounts={setLocalJars} />


          {/* TOTAL JARS */}
          <TotalJars label="Загальна к-ть банок:" value={totalJars} />


          {/* ADD CONSERVATION BUTTON */}
          <AnimatedButton
            onPress={() => updateEmptyJars(localJars)}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Зберегти зміни</Text>
          </AnimatedButton>

        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default EmptyJarsConservation;

const styles = StyleSheet.create({
  // main cintainer
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
