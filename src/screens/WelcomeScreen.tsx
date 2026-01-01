import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';

export default function WelcomeScreen() {


  return (
    <ImageBackground
      source={require('../../assets/images/background.png')} // твоя фонове зображення
      style={styles.container}
    >
      {/* Dark overlay for the background image */}
      <View style={styles.overlay} />

      
      <StatusBar style="light"/>

      {/* logo image with all the rings */}
      <View style={styles.outerRing}>
        <View style={styles.innerRing}>
        <Image
            source={require('../../assets/images/welcome.png')}
            style={{ width: hp(20), height: hp(20) }}
        />
        </View>
      </View>

      {/* app name */}
      <Text style={styles.title}>Komora</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // main container   
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp(2), 
    backgroundColor: '#f59e0b', 
    padding: 1,
  },

  // overlay for background image
  overlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
  },

  // app name 
  title: {
    color: 'white',
    fontSize: hp(9),
    zIndex: 2, 
    marginBottom: hp(6),
  },

   // Outer Ring
   outerRing: {
    width: hp(35),
    height: hp(35),
    borderRadius: hp(35) / 2, // half of the height
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Inner Ring 
  innerRing: {
    width: hp(25),
    height: hp(25),
    borderRadius: hp(25) / 2, // half of the height
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
