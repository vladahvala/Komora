import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

type LabeledInputProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: 'default' | 'numeric';
  };
  
  const LabeledInput = ({ label, value, onChangeText, keyboardType }: LabeledInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
  
    return (
      <View style={{ marginTop: hp(2) }}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.searchContainer, { borderColor: isFocused ? '#00B4BF' : '#AEAEAE' }]}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            style={styles.inputName}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            keyboardType={keyboardType || 'default'}
          />
        </View>
      </View>
    );
  };
  
export default LabeledInput;

const styles = StyleSheet.create({
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
  inputName: {
    flex: 1,
    fontSize: hp(2.2),
    color: 'black',
  },
});
