import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import JarNumCard from '../../components/JarNumCard';

const EmptyJarsConservation = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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
          <Text style={styles.menuTitle}>Нова консервація</Text>

          {/* JAR CARDS */}
          <View style={styles.cardsContainer}>
            <JarNumCard 
              image={require('../../../assets/jar_icons/empty_jar.png')} 
              label="2"
              circleLabel="3л"
              style={styles.jarCard}
            />
            <JarNumCard 
              image={require('../../../assets/jar_icons/empty_jar.png')}
              label="4" 
              circleLabel="2л"
              style={styles.jarCard}
            />
            <JarNumCard 
              image={require('../../../assets/jar_icons/empty_jar.png')}
              label="7" 
              circleLabel="1.5л"
              style={styles.jarCard}
            />
            <JarNumCard 
              image={require('../../../assets/jar_icons/empty_jar.png')}
              label="2" 
              circleLabel="1л"
              style={styles.jarCard}
            />
            <JarNumCard 
              image={require('../../../assets/jar_icons/empty_jar.png')}
              label="1" 
              circleLabel="0.5л"
              style={styles.jarCard}
            />
          </View>

          {/* ADD CONSERVATION BUTTON */}
          <Pressable style={styles.addButton}>
            <Text style={styles.addButtonText}>Додати консервацію</Text>
          </Pressable>
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
    marginBottom: hp(6),
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

  // cards styles
  cardsContainer: {
    flexDirection: 'column', 
    justifyContent: 'flex-start',
    alignItems: 'center',   
    marginTop: hp(4),
  },
  jarCard: {
    marginBottom: hp(3),
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
