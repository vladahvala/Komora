import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Keyboard } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { useRoute, RouteProp } from '@react-navigation/native';
import CardHeader from '../../components/form/common/CardHeader';
import CategoryDropdown from '../../components/form/categories/CategoryDropdown';
import IngredientsList from '../../components/form/recipeComponents/IngredientsList';
import NewIngredientInput from '../../components/form/recipeComponents/NewIngredientInput';
import RecipeEditor from '../../components/form/recipeComponents/RecipeEditor';
import { useCardPageRecipe } from '../../hooks/Recipes/useCardPageRecipe';

type CardPageRouteProp = RouteProp<RootStackParamList, 'CardPageRecipe'>;

const CardPageRecipe = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const route = useRoute<CardPageRouteProp>();

  const {
    // Current Item
    currentItem,
    isFavorite,
    imageUri,
    changeImage,

    // Category Selection
    selectedCategory,
    setSelectedCategory,
    categoryDropdownVisible,
    setCategoryDropdownVisible,

    // units
    units,
    unitDropdownVisible,
    setUnitDropdownVisible,

    // ingredients
    newIngredient,
    setNewIngredient,
    addNewIngredient,
    deleteIngredient,

    // recipe
    editableRecipeText,
    saveRecipeText,
    toggleFavorite,
  } = useCardPageRecipe(route.params.item);

  return (
    // MAIN CONTAINER
    <View style={styles.container}>
      <Pressable 
        style={{ flex: 1 }} 
        onPress={() => {
          setCategoryDropdownVisible(false);
        }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            {/* ARROW TO MAIN MENU */}
            <CardHeader
              name={currentItem?.name || ''}
              imageUri={imageUri}
              onImageChange={changeImage}
              onBack={() => navigation.goBack()}
              isFavorite={isFavorite}
              onToggleFavorite={() => toggleFavorite(currentItem?.name || '')}
            />

            {/* CATEGORY */}
            <Text style={styles.timeTitle}>Категорія:</Text>
            <CategoryDropdown
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              isOpen={categoryDropdownVisible}
              onToggle={() => setCategoryDropdownVisible(prev => !prev)}
              onClose={() => setCategoryDropdownVisible(false)}
              inputStyle={[styles.bigIconContainerCat, { width: '100%' }]}
              textStyle={styles.timeTitleCat}
              dropdownStyle={[styles.DropdownContainer, { width: '100%', marginLeft: 0 }]}
              itemTextStyle={styles.dropdownItemText}
              labelStyle={{ display: 'none' }} 
            />

            {/* INGREDIENTS HEADER */}
            <Text style={styles.textHeader}>Інгредієнти</Text>
            <IngredientsList 
               ingredients={currentItem?.ingredients ?? []}
               onDelete={deleteIngredient}
            />

            {/* INGREDIENT INPUTS */}
            <NewIngredientInput
              newIngredient={newIngredient}
              setNewIngredient={setNewIngredient}
              units={units}
              onAdd={addNewIngredient}
            />

            <Text style={styles.textHeader}>Рецепт</Text>

            {/* RECIPE HEADER */}
            <RecipeEditor
              recipeText={editableRecipeText}
              onSave={saveRecipeText}
            />
          </View>

        </ScrollView>

        {(categoryDropdownVisible || unitDropdownVisible) && (
          <Pressable
            style={StyleSheet.absoluteFill}
            pointerEvents="box-none"
            onPress={() => {
              setCategoryDropdownVisible(false);
              setUnitDropdownVisible(false);
              Keyboard.dismiss();
            }}
          />
        )}
      </Pressable>
    </View>
  );
};

export default CardPageRecipe;

const styles = StyleSheet.create({
  // main container
  container: { 
    flex: 1, 
    backgroundColor: '#F7F9FD',
    paddingHorizontal: hp(3.2),
  },
  scrollContent: {
    paddingBottom: hp(4), 
  },
  headerContainer: { 
    paddingTop: hp(5), 
    marginBottom: hp(2), 
    paddingHorizontal: hp(1), 
  },


  // general styles
  timeTitle: {
    fontSize: hp(3), 
    fontWeight: '600', 
    color: 'black', 
  },

  // DROPDOWN styles
  dropdownItemText: {
    fontSize: hp(2.2),
    color: '#333',
    textAlign: 'center',
  },

  DropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '90%',          
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#AEAEAE',
    borderRadius: hp(1.5),
    marginLeft: hp(2),
    marginTop: hp(0.5),
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  // CATEGORIES
  bigIconContainerCat: {
    flexDirection: 'row',    
    alignItems: 'center',      
    paddingHorizontal: hp(1.5),
    height: hp(6),       
    backgroundColor: '#00B4BF66',
    borderRadius: hp(1.5),
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1000,
  },
  timeTitleCat: {
    fontSize: hp(2.8), 
    fontWeight: '600', 
    color: 'black', 
  },

  // INGREDIENTS
  // header
  textHeader: {
    fontSize: hp(3),
    fontWeight: '700',
    color: 'black',
    textAlign: 'center',
    marginTop: hp(4),
    marginBottom: hp(1),
  },

  // delete ingredient button
  deleteIngredientButton: {
    height: hp(5),
    width: hp(5),
    backgroundColor: '#FF6B6B',
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: hp(1),
  },

});
