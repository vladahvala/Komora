import React, { useState, useContext } from 'react';
import { 
  View, Text, TouchableOpacity, Image, StyleSheet, TextInput, 
  Pressable, ScrollView, Animated, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import AlertModal from '../../modals/AlertModal';
import { launchImageLibrary } from 'react-native-image-picker';
import { RecipesContext, RecipeItem } from '../../context/RecipesContext';
import AnimatedButton from '../../animations/AnimatedButton';

const AddRecipe = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { addRecipe } = useContext(RecipesContext);

  // IMAGE
  const [imageUri, setImageUri] = useState<string | null>(null);

  // NAME
  const [name, setName] = useState('');
  const [isNameFocused, setIsNameFocused] = useState(false);

  // CATEGORY
  const [isCategoryFocused, setIsCategoryFocused] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = ['Мариновані', 'Солені', 'Квашені', 'Варення / Джеми', 'Компоти', 'Соуси / Кетчупи', 'Консерви в олії / жирі'];

  // RECIPE TEXT
  const [recipeText, setRecipeText] = useState('');

  // ALERT MODAL
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleAddConservation = () => {
    if (!name) {
      setModalMessage('Введіть назву рецепту!');
      setModalVisible(true);
      return;
    }
    if (!selectedCategory) {
      setModalMessage('Оберіть категорію!');
      setModalVisible(true);
      return;
    }

    const newItem: RecipeItem = {
      name,
      category: selectedCategory,
      imageUri,
      recipeText,
      history: {},
    };

    addRecipe(newItem);

    setName('');
    setSelectedCategory(null);
    setImageUri(null);
    setRecipeText('');

    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setCategoryModalVisible(false); }}>
      <SafeAreaProvider style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.headerContainer}>

            {/* ARROW */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('MainMenu')} 
              style={styles.arrowWrapper}
              activeOpacity={1}
            >
              <View style={styles.arrowTouchArea}>
                <Image source={require('../../../assets/icons/arrow.png')} style={styles.arrowIcon} />
              </View>
            </TouchableOpacity>

            {/* TITLE */}
            <Text style={styles.menuTitle}>Новий рецепт</Text>

            {/* IMAGE */}
            <View style={{ marginTop: hp(2) }}>
              <Text style={styles.label}>Фото рецепту</Text>
              <Pressable
                style={[styles.imagePicker, { borderColor: imageUri ? '#00B4BF' : '#AEAEAE' }]}
                onPress={() => launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
                  if (response.assets?.length) setImageUri(response.assets[0].uri);
                })}
              >
                {imageUri ? <Image source={{ uri: imageUri }} style={styles.selectedImage} /> : <Text style={styles.imagePickerText}>Оберіть фото</Text>}
              </Pressable>
            </View>

            {/* NAME INPUT */}
            <View style={{ marginTop: hp(2) }}>
              <Text style={styles.label}>Назва</Text>
              <View style={[styles.searchContainer, { borderColor: isNameFocused ? '#00B4BF' : '#AEAEAE' }]}>
                <TextInput
                  value={name} onChangeText={setName} style={styles.inputName}
                  onFocus={() => setIsNameFocused(true)} onBlur={() => setIsNameFocused(false)}
                />
              </View>
            </View>

            {/* CATEGORY INPUT */}
            <View style={{ marginTop: hp(2) }}>
              <Text style={styles.label}>Категорія</Text>
              <Pressable
                onPress={() => setCategoryModalVisible(prev => !prev)}
                style={[styles.searchContainer, { borderColor: isCategoryFocused ? '#00B4BF' : '#AEAEAE' }]}
              >
                <Text style={styles.searchInput}>{selectedCategory || 'Оберіть категорію'}</Text>
                <Image source={require('../../../assets/icons/frame_down.png')} style={styles.arrowDownIcon} />
              </Pressable>
              {isCategoryModalVisible && (
                <View style={styles.catdropdownContainer}>
                  <ScrollView
                    showsVerticalScrollIndicator
                    nestedScrollEnabled
                  >
                    {categories.map((cat, index) => (
                      <Pressable
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedCategory(cat);
                          setCategoryModalVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{cat}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}

            </View>

            {/* RECIPE TEXT */}
            <Text style={[styles.label, { marginTop: hp(2) }]}>Текст рецепту</Text>
            <TextInput
              value={recipeText} onChangeText={setRecipeText}
              style={styles.recipeInput} multiline numberOfLines={6}
            />

            {/* ALERT MODAL */}
            <AlertModal 
              visible={modalVisible} 
              message={modalMessage} 
              onClose={() => setModalVisible(false)} 
            />

            {/* ADD BUTTON */}
            <AnimatedButton 
              onPress={handleAddConservation}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Додати рецепт</Text>
            </AnimatedButton>

          </View>
        </ScrollView>
      </SafeAreaProvider>
    </TouchableWithoutFeedback>
  );
};

export default AddRecipe;

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

  // title text
  menuTitle: { 
    fontSize: hp(3.5), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'center',
  },

  // image field
  imagePicker: {
    height: hp(15),
    borderWidth: hp(0.25),
    borderRadius: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
  },
  imagePickerText: {
    fontSize: hp(2.2),
    color: '#666',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: hp(1.5),
    resizeMode: 'cover',
  },

  // input fields
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
  searchInput: {
    flex: 1,
    fontSize: hp(2.2),
    color: 'black',
  },

  // DROPDOWNS
  // categories
  catdropdownContainer: {
    position: 'absolute',
    top: hp(10),
    width: '100%',
    maxHeight: hp(25),   
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

  // time row styles
  timeRow: {
    flexDirection: 'row',     
    alignItems: 'center', 
    marginTop: hp(3),
    position: 'relative',    
  },
  timeTitle: {
    fontSize: hp(3.2), 
    fontWeight: '600', 
    color: 'black', 
  },
  bigIconContainer: {
    flexDirection: 'row',    
    alignItems: 'center',      
    paddingHorizontal: hp(1.5),
    height: hp(6),
    marginLeft: hp(2),         
    backgroundColor: '#00B4BF66',
    borderRadius: hp(1.5),
    justifyContent: 'center',
  },
  arrowDownIcon: {
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: 'contain',
    marginLeft: hp(1), 
  },

  // jar num title 
  jarNumTitle: {
    fontSize: hp(3.5), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'center', 
    marginTop: hp(3),  
  },

  // left column
  leftCol: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: hp(4) 
  },

  // recipe input style
  recipeInput: { 
    backgroundColor: '#F1F1F1', 
    borderWidth: hp(0.25),
    borderRadius: hp(1.5),
    borderColor: '#AEAEAE',
    padding: hp(1.5), 
    fontSize: hp(2.2), 
    color: 'black', 
    textAlignVertical: 'top' 
  },

  // button styles
  addButton: {
    marginTop: hp(3),
    paddingHorizontal: hp(2),  
    height: hp(6.5),
    borderRadius: hp(3.25),
    backgroundColor: '#00B4BF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',       
  },  
  addButtonText: {
    fontSize: hp(2.6),
    fontWeight: '700',
    color: 'black',
  },
});
