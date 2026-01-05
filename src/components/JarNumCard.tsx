import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Shadow } from 'react-native-shadow-2';

const JarNumCard = ({ image, style, label, circleLabel }) => {
  return (
    <View
      style={style}  
    >
        {/* CARD SHADOW */}
        <Shadow
            distance={hp(1)}
            startColor={'rgba(0,0,0,0.3)'}
            offset={[0, 0]}
            radius={hp(2)}
            viewStyle={{ width: hp(14), borderRadius: hp(2), alignSelf: 'center' }}
        >
            {/* MAIN CARD STYLES */}
            <View style={styles.cardContainer}>

                {/* BIG BLUE CIRCLE */}
                <View style={styles.circle}>

                    {/* SMALL BLACK CIRCLE (MINUS) */}
                    <View style={[styles.smallDot, styles.leftDot]}>
                        <Image
                            source={require('../../assets/jar_icons/minus.png')}
                            style={styles.dotIcon}
                        />
                    </View>

                    {/* JAR IMAGE */}
                    <Image source={image} style={styles.icon} />
                    {/* JAR TEXT L */}
                    {circleLabel && (
                        <Text
                        style={[
                            styles.circleText,
                            {
                            fontSize:
                                circleLabel.length <= 2
                                ? hp(2.2)
                                : circleLabel.length <= 3
                                ? hp(1.9)
                                : hp(1.5),
                            },
                        ]}
                        >
                        {circleLabel}
                        </Text>
                    )}


                    {/* SMALL BLACK CIRCLE (PLUS) */}
                    <View style={[styles.smallDot, styles.rightDot]}>
                        <Image
                            source={require('../../assets/jar_icons/plus.png')}
                            style={styles.dotIcon}
                        />
                    </View>
                </View>

                {/* CARD TEXT */}
                {label && (
                    <Text style={styles.labelText}>{label}</Text>
                )}
            </View>
        </Shadow>
    </View>
  );
};

export default JarNumCard;

const styles = StyleSheet.create({
    // main card container
    cardContainer: {
        width: hp(14),
        height: hp(8),
        backgroundColor: '#F6F6F6',
        borderRadius: hp(4),
        justifyContent: 'center',
        alignItems: 'center', 
        paddingLeft: hp(2.5), 
        overflow: 'visible',  // makes the blue circle be over the card
    },

    // big blue circle
    circle: {
        width: hp(9),          
        height: hp(9),
        borderRadius: hp(4.5),   
        backgroundColor: '#00B4BF',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',  
        left: -hp(3),          
        top: hp(-0.5),        
    },
    // jar image
    icon: {
        width: hp(6.7),
        height: hp(6.7),
        resizeMode: 'contain',
    },
    // jar text
    circleText: {
        position: 'absolute',  // over the icon
        color: 'black',
        fontWeight: '900',
        textAlign: 'center',
    },
    // card text
    labelText: {
        fontSize: hp(2.5),
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginLeft: hp(2),
    },
   
    // black circle
    smallDot: {
        width: hp(2.5),
        height: hp(2.5),
        borderRadius: hp(1.25),
        backgroundColor: '#000',
        position: 'absolute',
    
        justifyContent: 'center',
        alignItems: 'center',
    },
    // minus
    leftDot: {
        left: -hp(0.7),
        top: '50%',
        transform: [{ translateY: -hp(0.7) }],
    },
    // plus
    rightDot: {
        right: -hp(0.7),
        top: '50%',
        transform: [{ translateY: -hp(0.7) }],
    },
    // plus/minus icon
    dotIcon: {
        width: hp(2.5),
        height: hp(2.5),
        resizeMode: 'contain',
        tintColor: '#fff', 
    },
});
