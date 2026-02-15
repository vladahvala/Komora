import React, { useState } from 'react';
import { Text, StyleSheet, TextInput } from 'react-native';
import AnimatedButton from '../../../animations/AnimatedButton';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface RecipeEditorProps {
    recipeText: string;
    onSave: (text: string) => void;
  }
  
  const RecipeEditor: React.FC<RecipeEditorProps> = ({ recipeText, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableText, setEditableText] = useState(recipeText);
  
    return !isEditing ? (
      <>
        <Text style={styles.recipeText}>{recipeText || 'Рецепт поки відсутній.'}</Text>
        <AnimatedButton style={styles.editRecipeButton} onPress={() => { setEditableText(recipeText); setIsEditing(true); }}>
          <Text style={styles.editRecipeButtonText}>Редагувати</Text>
        </AnimatedButton>
      </>
    ) : (
      <>
        <TextInput style={styles.recipeInput} multiline value={editableText} onChangeText={setEditableText} />
        <AnimatedButton style={styles.saveRecipeButton} onPress={() => { onSave(editableText); setIsEditing(false); }}>
          <Text style={styles.saveRecipeButtonText}>Зберегти</Text>
        </AnimatedButton>
      </>
    );
  };
  
  export default RecipeEditor;

const styles = StyleSheet.create({
    // RECIPE TEXT 
  recipeText: {
    fontSize: hp(2),
    color: '#333',
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  // recipe input
  recipeInput: {
    fontSize: hp(2),
    color: '#333',
    marginTop: hp(1),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: hp(1),
    padding: hp(1),
    minHeight: hp(10),
    textAlignVertical: 'top',
  },

  // recipe edit button
  editRecipeButton: {
    backgroundColor: '#00B4BF',
    paddingVertical: hp(1.5),
    paddingHorizontal: hp(3),
    borderRadius: hp(1.5),
    alignSelf: 'center',
    marginBottom: hp(2),
    marginTop: hp(2.5),
  },
  editRecipeButtonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: hp(2),
  },

  // recipe save button
  saveRecipeButton: {
    backgroundColor: '#00BF66',
    paddingVertical: hp(1.5),
    paddingHorizontal: hp(3),
    borderRadius: hp(1.5),
    alignSelf: 'center',
    marginBottom: hp(2),
  },
  saveRecipeButtonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: hp(2),
  },
});
