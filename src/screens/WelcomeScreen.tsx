import { View, StyleSheet, Image, ImageBackground, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Text as SvgText, TextPath } from 'react-native-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import navigation, { RootStackParamList } from '../navigation';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export default function WelcomeScreen({ navigation }: Props) {
  const innerScale = useRef(new Animated.Value(0)).current;
  const outerScale = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0)).current;

  const opacity = useRef(new Animated.Value(1)).current;

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
  
      Animated.delay(200),
  
      // title text in
      Animated.timing(textScale, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
  
      Animated.delay(600),
  
      // pulse up
      Animated.parallel([
        Animated.timing(innerScale, { toValue: 1.1, duration: 400, useNativeDriver: true }),
        Animated.timing(outerScale, { toValue: 1.2, duration: 400, useNativeDriver: true }),
        Animated.timing(textScale, { toValue: 1.2, duration: 400, useNativeDriver: true }),
      ]),
  
      // pulse down
      Animated.parallel([
        Animated.timing(innerScale, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(outerScale, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(textScale, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
  
      // fade out
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace('MainMenu');
    });
  }, []);

  

  return (
  <Animated.View style={{ flex: 1, opacity }}>
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.container}
    >
      <View style={styles.overlay} />
      <StatusBar style="light" />

      {/* TITLE */}
      <Animated.View
      style={[
        styles.curvedTextWrapper,
        { transform: [{ scale: textScale }] }, 
        ]}
      >
        <Svg
          width={hp(40)}
          height={hp(35)}
          viewBox="0 0 300 150"
        >
          <Path
            id="curve"
            d="M 20 120 A 130 120 0 0 1 280 120"
            fill="none"
          />
          <SvgText
            fill="white"
            fontSize="72"
            fontWeight="700"
            letterSpacing="5"
          >
            <TextPath
              href="#curve"
              startOffset="18%"
              textAnchor="middle"
            >
              Komora
            </TextPath>
          </SvgText>
        </Svg>
      </Animated.View>


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

    </ImageBackground>
    </Animated.View>
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
    backgroundColor: 'rgba(0,0,0,0.4)', 
  },

  // app name 
  title: {
    color: 'white',
    fontSize: hp(9),
    zIndex: 2, 
    marginBottom: hp(6),
  },

  // title (text)
  curvedTextWrapper: {
    position: 'absolute',
    top: hp(27),   
    zIndex: 3,
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
