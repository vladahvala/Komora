// components/form/YearPicker.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface YearPickerProps {
  selectedYear: string | null;
  onSelect: (year: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  years: string[];
  fontSize?: number; // <- додаємо необов'язковий параметр для розміру шрифту
}

const YearPicker: React.FC<YearPickerProps> = ({
  selectedYear,
  onSelect,
  isOpen,
  onToggle,
  onClose,
  years,
  fontSize = hp(2.5), // <- дефолтне значення, якщо не передано
}) => {

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Pressable style={styles.buttonContainer} onPress={onToggle}>
        <Text style={[styles.buttonText, { fontSize }]}>{selectedYear || (years[0] ?? '2021')}</Text>
        <Image
          source={require('../../../../assets/icons/frame_down.png')}
          style={[
            styles.arrowDownIcon,
            isOpen && { transform: [{ rotate: '180deg' }] },
          ]}
        />
      </Pressable>

      {isOpen && (
        <View style={styles.dropdownContainer}>
          {years.map(year => (
            <Pressable
              key={year}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(year);
                onClose();
              }}
            >
              <Text style={styles.dropdownItemText}>{year}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default YearPicker;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: hp(1.5),
    height: hp(6),
    backgroundColor: '#00B4BF66',
    borderRadius: hp(1.5),
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    color: 'black',
  },
  arrowDownIcon: {
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: 'contain',
    marginLeft: hp(1),
  },
  dropdownContainer: {
    position: 'absolute',
    top: hp(6) + hp(0.5),
    left: 0,
    width: '100%',
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#AEAEAE',
    borderRadius: hp(1.5),
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
},
  dropdownItem: {
    paddingVertical: hp(1.5),
    paddingHorizontal: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: hp(2.2),
    color: '#333',
    textAlign: 'center',
  },
});
