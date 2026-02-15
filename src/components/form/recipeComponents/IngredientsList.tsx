import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DeleteIngredientButton from '../../../components/form/buttons/DeleteIngredientButton';

interface IngredientsListProps {
    ingredients: { amount: string; name: string }[];
    onDelete: (index: number) => void;
  }
  
  const IngredientsList: React.FC<IngredientsListProps> = ({ ingredients, onDelete }) => (
    <>
      {ingredients.length === 0 && (
        <Text style={styles.ingredientsMessage}>Поки інгредієнтів немає!</Text>
      )}
  
      {ingredients.map((ing, index) => (
        <View key={index} style={styles.ingredientRow}>
          <View style={styles.ingredientLeft}>
            <View style={styles.ingredientAmount}>
              <Text style={styles.ingredientText}>{ing.amount}</Text>
            </View>
            <Text style={styles.ingredientName}>{ing.name}</Text>
          </View>
          <DeleteIngredientButton onPress={() => onDelete(index)} />
        </View>
      ))}
    </>
  );
  
  export default IngredientsList;

  const styles = StyleSheet.create({
    // messsage (if no ingredients)
  ingredientsMessage: {
    fontSize: hp(2.5),
    fontWeight: '700',
    color: 'grey',
    textAlign: 'center',
    marginTop: hp(1),
    marginBottom: hp(1),
  },
  // main row
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginTop: hp(1),
  },
  ingredientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ingredientAmount: {
    width: hp(10),
    height: hp(5),
    borderRadius: hp(1),
    backgroundColor: '#00B4BF66',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: hp(2),
  },
  ingredientText: {
    fontSize: hp(2.2),
    fontWeight: '600',
    color: 'black',
  },
  ingredientName: {
    fontSize: hp(2.2),
    color: 'black',
  },
  });