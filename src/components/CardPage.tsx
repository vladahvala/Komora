import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import JarNumCard from './JarNumCard';
import { useRoute, RouteProp } from '@react-navigation/native';


type CardPageRouteProp = RouteProp<RootStackParamList, 'CardPage'>;

const CardPage = () => {
  const route = useRoute<CardPageRouteProp>();
  const { item } = route.params;  // тут твоя картка з ConsMenuCard

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
                <Image source={item.image} style={styles.titleImage} />
            </View>

        </View>



        <View style={styles.timeRow}> 
            <Text style={styles.timeTitle}>Загальна к-ть банок:</Text>
            <View style={styles.bigIconContainer}>
              <Text style={styles.timeTitle}>7</Text>
            </View>
        </View>

          {/* CONSERVATION TIME */}
          <View style={styles.timeRow}> 
            <Text style={styles.timeTitle}>Час консервації:</Text>
            <Pressable style={styles.bigIconContainer}>
              <Text style={styles.timeTitle}>2021</Text>
            </Pressable>
          </View>

          <View style={styles.leftCol}>
            {/* LEFT COLUMN 3 CARDS */}
            <View style={{ paddingHorizontal: hp(3.2), justifyContent: 'flex-start' }}>
              <View style={{ justifyContent: 'flex-start' }}>
                <JarNumCard 
                  image={require('../../assets/jar_icons/empty_jar.png')} 
                  style={{ marginBottom: hp(4) }} 
                  label="2"             // card center text 
                  circleLabel="3л"        // text in jar
                />
                <JarNumCard 
                  image={require('../../assets/jar_icons/empty_jar.png')}
                  style={{ marginBottom: hp(4) }}
                  label="4" 
                  circleLabel={'2л'}  
                />
                <JarNumCard 
                  image={require('../../assets/jar_icons/empty_jar.png')}
                  label="7" 
                  style={undefined} 
                  circleLabel={'1.5л'}
                />
              </View>
            </View>

            {/* RIGHT COLUMN 2 CARDS */}
            <View style={{ justifyContent: 'center' }}>
              <JarNumCard 
                image={require('../../assets/jar_icons/empty_jar.png')} 
                style={{ marginBottom: hp(4) }} 
                label={2} 
                circleLabel={'1л'} 
              />
              <JarNumCard 
                image={require('../../assets/jar_icons/empty_jar.png')} 
                style={undefined} 
                label={1} 
                circleLabel={'0.5л'} 
              />
            </View>
          </View>

          {/* ADD CONSERVATION BUTTON */}
          <Pressable style={styles.addButton}>
            <Text style={styles.addButtonText}>Зберегти зміни</Text>
          </Pressable>

          <View style={styles.timeRow}> 
            <Text style={styles.timeTitle}>К-ть банок за рік 2021:</Text>
            <View style={styles.bigIconContainer}>
              <Text style={styles.timeTitle}>7</Text>
            </View>
            </View>
        </View>

        
      </ScrollView>
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
    fontSize: hp(3.2), 
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
