import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
  selected: string | null;
  onSelect: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  inputStyle?: object | object[];
  textStyle?: object | object[];
  dropdownStyle?: object | object[];
  itemTextStyle?: object | object[];
  labelStyle?: object | object[];
}

const categories = [
  'Мариновані',
  'Солені',
  'Квашені',
  'Варення / Джеми',
  'Компоти',
  'Соуси / Кетчупи',
  'Консерви в олії / жирі',
];

const CategoryDropdown: React.FC<Props> = ({
    selected,
    onSelect,
    isOpen,
    onToggle,
    onClose,
    inputStyle,
    textStyle,
    dropdownStyle,
    itemTextStyle,
    labelStyle
  }) => {  

  return (
    <View style={{ marginTop: hp(2), position: 'relative', zIndex: 10 }}>
      <Text style={labelStyle ||styles.label}>Категорія</Text>

      <Pressable
      style={inputStyle || styles.inputContainer}
      onPress={onToggle}
    >
      <Text style={textStyle || styles.inputText}>
        {selected || 'Оберіть категорію'}
      </Text>
      <Image
        source={require('../../../assets/icons/frame_down.png')}
        style={[styles.arrowIcon, isOpen && { transform: [{ rotate: '180deg' }] }]}
      />
    </Pressable>

    {isOpen && (
      <View style={dropdownStyle || styles.dropdownContainer}>
        {categories.map((cat, index) => (
          <Pressable
            key={index}
            style={styles.dropdownItem}
            onPress={() => {
              onSelect(cat);
              onClose();
            }}
          >
            <Text style={itemTextStyle || styles.dropdownItemText}>{cat}</Text>
          </Pressable>
        ))}
      </View>
    )}
    </View>
  );
};

export default CategoryDropdown;

const styles = StyleSheet.create({
  label: {
    fontSize: hp(2.2),
    fontWeight: '500',
    color: '#333',
    marginBottom: hp(0.5),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F1F1',
    borderWidth: hp(0.25),
    borderColor: '#AEAEAE',
    borderRadius: hp(1.5),
    paddingHorizontal: hp(1.5),
    height: hp(6),
  },
  inputText: {
    fontSize: hp(2.2),
    color: 'black',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: hp(0.5),
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#AEAEAE',
    borderRadius: hp(1.5),
    zIndex: 100,
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
  arrowIcon: {
    width: hp(2.5),
    height: hp(2.5),
    marginLeft: hp(1),
    resizeMode: 'contain',
  },
});
