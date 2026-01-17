import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { useRoute, RouteProp } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useRecipe } from '../../context/RecipesContext';
import AnimatedButton from '../../animations/AnimatedButton';

type CardPageRouteProp = RouteProp<RootStackParamList, 'CardPageRecipe'>;

const CardPageRecipe = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const route = useRoute<CardPageRouteProp>();

  const { item } = route.params;  // card ConsMenuCard

  const { recipes, updateImage, updateCategory, addIngredient, updateRecipeText, favorites, toggleFavorite } = useRecipe();

  // current card 
  const currentItem = recipes.find(c => c.name === item.name);

  // fav log
  const isFavorite = favorites.includes(item.name);

  // changing img
  const [imageUri, setImageUri] = useState<string | null>(item.imageUri || null);

  // CATEGORY
  // category state
  const [selectedCategory, setSelectedCategory] = useState<string>(item.category);
  // category dropdown visibility
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  // categories list
  const categories = ['Мариновані', 'Солені', 'Квашені', 'Варення / Джеми', 'Компоти', 'Соуси / Кетчупи', 'Консерви в олії / жирі'];
   
  // UNITS
  const units = ['ст л', 'ст', 'чй л', 'кг', 'г'];
  const [unitDropdownVisible, setUnitDropdownVisible] = useState(false);
  const [newIngredient, setNewIngredient] = useState<{ amount: string; unit: string; name: string }>({ amount: '', unit: 'ст л', name: '' });
    
  // recipe text
  const [isEditingRecipe, setIsEditingRecipe] = useState(false);
  const [editableRecipeText, setEditableRecipeText] = useState(currentItem?.recipeText || '');

  return (
    // MAIN CONTAINER
    <SafeAreaProvider style={styles.container}>
        <Pressable 
            style={{ flex: 1 }} 
            onPress={() => {
            setCategoryDropdownVisible(false);
            setUnitDropdownVisible(false);
            }}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
              <View style={styles.headerContainer}>
                {/* ARROW TO MAIN MENU */}
                <View style={styles.headerTopRow}>
                  <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.arrowWrapper}
                    activeOpacity={1}  
                  >
                    <View style={styles.arrowTouchArea}>
                      <Image
                        source={require('../../../assets/icons/arrow.png')}
                        style={styles.arrowIcon}
                      />
                    </View>
                  </TouchableOpacity>

                  {/* LIKE */}
                  <Pressable
                    onPress={() => toggleFavorite(item.name)}
                    style={styles.headerIconButton}
                  >
                    <Image
                      source={
                        isFavorite
                          ? require('../../../assets/icons/like_blue.png')
                          : require('../../../assets/icons/like.png')
                      }
                      style={[
                        styles.heartIcon,
                      ]}
                    />
                  </Pressable>
                </View>

                    {/* TITLE TEXT */}
                    <View style={styles.titleRow}>
                    {/* TEXT */}
                    <View style={styles.titleLeft}>
                        <Text style={styles.menuTitle}>{item.name}</Text>
                    </View>

                    {/* IMAGE */}
                    <View style={styles.titleImageWrapper}>
                        <Image
                        source={
                            imageUri
                            ? { uri: imageUri }   // user chose img
                            : require('../../../assets/images/default_conservation.png') // fallback
                        }
                        style={styles.titleImage}
                        />

                        {/* overlay for img change */}
                        <Pressable
                        style={styles.imageOverlay}
                        onPress={() => {
                            launchImageLibrary(
                            { mediaType: 'photo', quality: 0.7 },
                            (response) => {
                                if (response.assets && response.assets.length > 0) {
                                setImageUri(response.assets[0].uri);

                                // img to context
                                if (currentItem) {
                                    updateImage(currentItem.name, response.assets[0].uri);
                                }
                                }
                            }
                            );
                        }}
                        >
                        <Text style={styles.imageOverlayText}>Змінити</Text>
                        </Pressable>
                    </View>
                    
                    </View>

                    {/* CATEGORY */}
                    <View style={{ marginTop: hp(2) }}>
                    <Text style={styles.timeTitle}>Категорія:</Text>

                    <View style={{ alignItems: 'center', marginTop: hp(1) }}>
                        <Pressable
                        style={[
                            styles.bigIconContainerCat,
                            {
                            width: '100%', 
                            },
                        ]}
                        onPress={() => setCategoryDropdownVisible(prev => !prev)}
                        >
                        <Text style={styles.timeTitleCat}>{selectedCategory}</Text>
                        <Image
                          source={require('../../../assets/icons/frame_down.png')}
                          style={[
                            styles.arrowDownIconCat,
                            categoryDropdownVisible && { transform: [{ rotate: '180deg' }] },
                          ]}
                        />
                        </Pressable>

                        {/* Dropdown */}
                        {categoryDropdownVisible && (
                        <View
                            style={[
                            styles.DropdownContainer,
                            {
                                width: '100%',
                                marginLeft: 0, 
                            },
                            ]}
                        >
                            {categories.map(cat => (
                            <Pressable
                                key={cat}
                                style={styles.dropdownItem}
                                onPress={() => {
                                setSelectedCategory(cat);
                                setCategoryDropdownVisible(false);
                                if (currentItem && currentItem.category !== cat) {
                                    updateCategory(currentItem.name, cat);
                                  }
                                }}
                            >
                                <Text style={styles.dropdownItemText}>{cat}</Text>
                            </Pressable>
                            ))}
                        </View>
                        )}
                    </View>
                </View>

                {/* INGREDIENTS HEADER */}
                <Text style={styles.ingredientsHeader}>Інгредієнти</Text>
                {currentItem?.ingredients?.length === 0 && ( 
                    <Text style={styles.ingredientsMessage}>Поки інгедієнтів немає!</Text>
                )}

                {/* LIST OF INGREDIENTS */}
                {currentItem?.ingredients?.map((ing, index) => (
                <View key={index} style={styles.ingredientRow}>
                    {/* left part + name */}
                    <View style={styles.ingredientLeft}>
                        <View style={styles.ingredientAmount}>
                            <Text style={styles.ingredientText}>{ing.amount}</Text>
                        </View>
                        <Text style={styles.ingredientName}>{ing.name}</Text>
                    </View>

                    {/* DELETE BUTTON */}
                    <AnimatedButton
                        style={styles.deleteIngredientButton}
                        onPress={() => {
                            if (currentItem) {
                            const updatedIngredients = currentItem.ingredients.filter((_, i) => i !== index);
                            currentItem.ingredients = updatedIngredients;
                            updateCategory(currentItem.name, currentItem.category); // save category
                            }
                        }}
                    >
                        <Image
                            source={require('../../../assets/icons/remove_black.png')}
                            style={{ width: hp(2.5), height: hp(2.5), resizeMode: 'contain' }}
                        />
                    </AnimatedButton>
                </View>
                ))}

                {/* INGREDIENT INPUTS */}
                <View style={styles.newIngredientRow}>
                    {/* NUMBER */}
                    <TextInput
                        placeholder="Кількість"
                        placeholderTextColor="#999"
                        style={styles.inputAmount}
                        value={newIngredient.amount}
                        onChangeText={text => setNewIngredient(prev => ({ ...prev, amount: text }))}
                        maxLength={4} 
                    />

                    {/* UNIT */}
                    <View style={{ position: 'relative' }}>
                        <Pressable
                            style={styles.unitDropdownButton}
                            onPress={() => setUnitDropdownVisible(prev => !prev)}
                        >
                            <Text style={styles.unitDropdownText}>{newIngredient.unit}</Text>
                        </Pressable>

                        {unitDropdownVisible && (
                        <View
                            style={
                            styles.DropdownContainerUnit
                            }
                        >
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

                        {/* INGREDIENT NAME */}
                        <TextInput
                            placeholder="Назва інгр."
                            placeholderTextColor="#999"
                            style={styles.inputName}
                            value={newIngredient.name}
                            onChangeText={text => setNewIngredient(prev => ({ ...prev, name: text }))}
                            maxLength={18} 
                        />

                        {/* ADD INGREDIENT */}
                        <AnimatedButton 
                            style={styles.addIngredientButton}
                            onPress={() => {
                            if (!newIngredient.amount || !newIngredient.name) return;

                            if (currentItem) {
                                addIngredient(currentItem.name, { amount: `${newIngredient.amount} ${newIngredient.unit}`, name: newIngredient.name });
                            }
                            setNewIngredient({ amount: '', unit: 'ст л', name: '' });
                            }}
                        >
                            <Image 
                            source={require('../../../assets/icons/add_black.png')} 
                            style={{ height: hp(2.5), resizeMode: 'contain' }}
                            />
                        </AnimatedButton >
                    </View>

                    {/* RECIPE HEADER */}
                    <Text style={styles.ingredientsHeader}>Рецепт</Text>

                        {/* SHOWING AND EDITING */}
                        {!isEditingRecipe ? (
                        <>
                            <Text style={styles.recipeText}>
                                {currentItem?.recipeText || 'Рецепт поки відсутній.'}
                            </Text>

                            <AnimatedButton
                                style={styles.editRecipeButton}
                                onPress={() => {
                                    setEditableRecipeText(currentItem?.recipeText || '');
                                    setIsEditingRecipe(true);
                                }}
                            >
                                <Text style={styles.editRecipeButtonText}>Редагувати</Text>
                            </AnimatedButton>
                        </>
                        ) : (
                        <>
                        <TextInput
                            style={styles.recipeInput}
                            multiline
                            value={editableRecipeText}
                            onChangeText={setEditableRecipeText}
                        />

                        <AnimatedButton
                            style={styles.saveRecipeButton}
                            onPress={() => {
                                if (currentItem) {
                                updateRecipeText(currentItem.name, editableRecipeText);
                                }
                                setIsEditingRecipe(false);
                            }}
                        >
                            <Text style={styles.saveRecipeButtonText}>Зберегти</Text>
                        </AnimatedButton>
                    </>
                    )}

                </View>

            </ScrollView>
        </Pressable>
    </SafeAreaProvider>
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

  // arrow + like row
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // arrow styles
  arrowWrapper: {
    alignSelf: 'flex-start',
    marginBottom: hp(1),
    marginLeft: -hp(1),
  },
  arrowTouchArea: {
    padding: hp(1.2),          
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: { 
    width: hp(3.2), 
    height: hp(3),
    resizeMode: 'contain', 
  },  

  // heart icon
  heartIcon: {
    width: hp(3),
    height: hp(3),
    resizeMode: 'contain',
  },
  headerIconButton: {
    width: hp(5),
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },

  // title text
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // left - text, right - img
    marginTop: hp(2),
  },
  titleLeft: {
    flex: 1,
    justifyContent: 'center',
    marginRight: hp(3), // distance between text & img
  },
  menuTitle: { 
    fontSize: hp(2.9), 
    fontWeight: '600', 
    color: 'black',
    textAlign: 'center', 
  },

  // IMAGE
  // img styles
  titleImageWrapper: {
    width: hp(22),
    height: hp(17),
    borderRadius: hp(2.5),
    overflow: 'hidden', 
  },
  titleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  // img change styles
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '25%',       
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlayText: {
    color: 'white',
    fontWeight: '600',
    fontSize: hp(2.2),
  },

  // general styles
  timeTitle: {
    fontSize: hp(3), 
    fontWeight: '600', 
    color: 'black', 
  },

  // DROPDOWN styles
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
  arrowDownIcon: {
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: 'contain',
    marginLeft: hp(1), 
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
  },
  arrowDownIconCat: {
    position: 'absolute',
    right: hp(1.5), 
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: 'contain',
  },
  timeTitleCat: {
    fontSize: hp(2.8), 
    fontWeight: '600', 
    color: 'black', 
  },

  // INGREDIENTS
  // header
  ingredientsHeader: {
    fontSize: hp(3),
    fontWeight: '700',
    color: 'black',
    textAlign: 'center',
    marginTop: hp(7),
    marginBottom: hp(1),
  },
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
    zIndex: 100,
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
  addIngredientButtonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: hp(1.8),
  },

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
