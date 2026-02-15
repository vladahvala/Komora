import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

type JarCountRowProps = {
  count: number;
  showIcon?: boolean;
  icon?: any;
  label?: string;
  extraTexts?: string[]; 
};

const JarCountRow = ({ count, showIcon = true, icon, label, extraTexts = [] }: JarCountRowProps) => {
  return (
    <>
      <Text style={styles.jarText}>{count}</Text>
      {showIcon && (
        <Image
          source={icon ?? require('../../../../assets/icons/jar.png')}
          style={styles.jarIcon}
        />
      )}
      {label && <Text style={styles.jarText}> {label}</Text>}
      {extraTexts.map((text, idx) => (
        <Text key={idx} style={styles.jarText}> {text}</Text>
      ))}
    </>
  );
};

export default JarCountRow;

const styles = StyleSheet.create({
  jarText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: hp(1.5),
  },
  jarIcon: {
    width: hp(2.2),
    height: hp(2.2),
    marginHorizontal: hp(0.5),
    resizeMode: 'contain',
  },
});
