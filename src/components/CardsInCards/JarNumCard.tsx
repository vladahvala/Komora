import React from 'react';
import { View, Image, StyleSheet, Text, TextInput } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Shadow } from 'react-native-shadow-2';
import CircleActionButton from '../form/buttons/CircleActionButton';

interface JarNumCardProps {
    image: any;
    style?: any;
    label: string | number;
    circleLabel: string;
    count: number; 
    onChange: (newCount: number) => void; 
  }

const JarNumCard: React.FC<JarNumCardProps> = ({ image, style, label, circleLabel, count, onChange }) => {
    // handle nums
    const handleTextChange = (text: string) => {
        // deleting every char except nums
        let num = parseInt(text.replace(/[^0-9]/g, ''), 10);
        if (isNaN(num)) num = 0;
        if (num > 99) num = 99; // max = 99
        onChange(num);
    };

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
                    <CircleActionButton
                        icon={require('../../../assets/jar_icons/minus.png')}
                        onPress={() => onChange(Math.max(count - 1, 0))}
                        style={styles.leftDot}
                    />

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
                    <CircleActionButton
                        icon={require('../../../assets/jar_icons/plus.png')}
                        onPress={() => onChange(count + 1)}
                        style={styles.rightDot}
                    />

                </View>

                {/* CARD TEXT */}
                <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    value={count.toString()}
                    onChangeText={handleTextChange}
                    maxLength={2} 
                    textAlign="center"
                />
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
   
    // minus
    leftDot: {
        left: -hp(0.7),
        top: '42%',
        transform: [{ translateY: -hp(1) }],
    },
    // plus
    rightDot: {
        right: -hp(0.7),
        top: '42%',
        transform: [{ translateY: -hp(1) }],
    },

    // text input
    input: {
        fontSize: hp(2.5),
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginLeft: hp(2),
    },
});
