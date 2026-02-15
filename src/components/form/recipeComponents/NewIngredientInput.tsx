import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Pressable } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AnimatedButton from '../../../animations/AnimatedButton';

interface NewIngredientInputProps {
    newIngredient: { amount: string; unit: string; name: string };
    setNewIngredient: React.Dispatch<React.SetStateAction<{ amount: string; unit: string; name: string }>>;
    units: string[];
    onAdd: () => void;
  }
  
  const NewIngredientInput: React.FC<NewIngredientInputProps> = ({ newIngredient, setNewIngredient, units, onAdd }) => {
    const [unitDropdownVisible, setUnitDropdownVisible] = useState(false);
  
    return (
      <View style={styles.newIngredientRow}>
        <TextInput
          placeholder="Кількість"
          placeholderTextColor="#999"
          style={styles.inputAmount}
          value={newIngredient.amount}
          keyboardType="numeric"
          onChangeText={text => setNewIngredient(prev => ({ ...prev, amount: text.replace(/[^0-9]/g, '') }))}
          maxLength={4}
        />
  
        <View style={{ position: 'relative' }}>
          <Pressable
            style={styles.unitDropdownButton}
            onPress={() => setUnitDropdownVisible(prev => !prev)}
          >
            <Text style={styles.unitDropdownText}>{newIngredient.unit}</Text>
          </Pressable>
  
          {unitDropdownVisible && (
            <View style={styles.DropdownContainerUnit}>
              {units.map(u => (
                <Pressable
                  key={u}
                  style={{ paddingVertical: hp(1), alignItems: 'center' }}
                  onPress={() => {
                    setNewIngredient(prev => ({ ...prev, unit: u }));
                    setUnitDropdownVisible(false);
                  }}
                >
                  <Text style={{ fontSize: hp(2), color: 'black' }}>{u}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
  
        <TextInput
          placeholder="Назва інгр."
          placeholderTextColor="#999"
          style={styles.inputName}
          value={newIngredient.name}
          onChangeText={text => setNewIngredient(prev => ({ ...prev, name: text }))}
          maxLength={18}
        />
  
        <AnimatedButton style={styles.addIngredientButton} onPress={onAdd}>
          <Image source={require('../../../../assets/icons/add_black.png')} style={{ height: hp(2.5), resizeMode: 'contain' }} />
        </AnimatedButton>
      </View>
    );
  };

  export default NewIngredientInput;

  const styles = StyleSheet.create({
      // new ingredient row style
  newIngredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2),
  },
  inputAmount: {
    fontSize: hp(1.8),
    width: hp(12),
    height: hp(5),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: hp(1),
    paddingHorizontal: hp(1),
    marginRight: hp(0.5),
  },
  inputName: {
    flex: 1,
    height: hp(5),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: hp(1),
    paddingHorizontal: hp(1),
    marginRight: hp(1),
    fontSize: hp(1.8),
  },
  // UNIT STYLES 
  unitDropdownButton: {
    width: hp(6),
    height: hp(5),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: hp(0.5),
  },
  unitDropdownText: {
    fontSize: hp(1.8),
    color: 'black',
  },
  DropdownContainerUnit: {
    position: 'absolute',
    top: hp(5.5),
    left: 0,
    width: '95%',
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: hp(1),
    zIndex: 9999,
  },
  // add ingredient button
  addIngredientButton: {
    height: hp(5),
    paddingHorizontal: hp(0.5),
    backgroundColor: '#00B4BF',
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  });