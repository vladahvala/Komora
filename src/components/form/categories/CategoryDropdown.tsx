import React from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const categories = [
  'Мариновані',
  'Солені',
  'Квашені',
  'Варення / Джеми',
  'Компоти',
  'Соуси / Кетчупи',
  'Консерви в олії / жирі',
];

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
  labelStyle,
}) => {
  return (
    <View style={{ marginTop: hp(2) }}>
      <Text style={labelStyle || styles.label}>Категорія</Text>

      <Pressable
        style={inputStyle || styles.inputContainer}
        onPress={onToggle}
      >
        <Text style={textStyle || styles.inputText}>
          {selected || 'Оберіть категорію'}
        </Text>
        <Image
          source={require('../../../../assets/icons/frame_down.png')}
          style={[styles.arrowIcon, isOpen && { transform: [{ rotate: '180deg' }] }]}
        />
      </Pressable>

      {isOpen && (
        <>
          {/* Dropdown */}
          <View style={[dropdownStyle || styles.dropdownContainer, { zIndex: 1000 }]}>
            <ScrollView
              style={{ maxHeight: hp(30) }}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
            >
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
            </ScrollView>
          </View>

          {/* Overlay для закриття */}
          <Pressable
            style={[StyleSheet.absoluteFill, { zIndex: 500 }]}
            onPress={onClose}
          />
        </>
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
    top: hp(10), // тут можна коригувати, щоб під input
    left: hp(3.2),
    right: hp(3.2),
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#AEAEAE',
    borderRadius: hp(1.5),
    maxHeight: hp(30),
    elevation: 5,
    zIndex: 100,
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
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});
