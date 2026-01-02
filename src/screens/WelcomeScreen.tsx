import { View, Text, StyleSheet, Image, ImageBackground, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
  const innerScale = useRef(new Animated.Value(0)).current;
  const outerScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // inner ring in
      Animated.timing(innerScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
  
      // outer ring in
      Animated.timing(outerScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
       
      // delay
      Animated.delay(200),
  
      // pulsayting circles
        //  pulse up (both)
        Animated.parallel([
          Animated.timing(innerScale, {
            toValue: 1.1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(outerScale, {
            toValue: 1.2,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),

        //  pulse down (both)
        Animated.parallel([
          Animated.timing(innerScale, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(outerScale, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
    ]).start();
  }, []);
  

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.container}
    >
      <View style={styles.overlay} />
      <StatusBar style="light" />

      {/* OUTER RING */}
      <Animated.View
        style={[
          styles.outerRing,
          { transform: [{ scale: outerScale }] },
        ]}
      >
        {/* INNER RING */}
        <Animated.View
          style={[
            styles.innerRing,
            { transform: [{ scale: innerScale }] },
          ]}
        >
          {/* LOG IMAGE */}
          <Image
            source={require('../../assets/images/welcome.png')}
            style={{ width: hp(20), height: hp(20) }}
          />
        </Animated.View>
      </Animated.View>

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
