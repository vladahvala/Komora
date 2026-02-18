import React from 'react';
import { 
  View, Text, StyleSheet, TextInput, ScrollView,
  Pressable, 
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import AlertModal from '../../modals/AlertModal';
import AnimatedButton from '../../animations/AnimatedButton';
import FormHeaderWithImage from '../../components/form/common/FormHeaderWithImage';
import LabeledInput from '../../components/form/common/LabeledInput';
import CategoryDropdown from '../../components/form/categories/CategoryDropdown';
import { useAddRecipeForm } from '../../hooks/Recipes/useAddRecipeForm';

const AddRecipe = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {
    // Form fields
    imageUri,
    setImageUri,
    name,
    setName,
    selectedCategory,
    setSelectedCategory,
    recipeText,
    setRecipeText,

    // Category modal
    isCategoryModalVisible,
    setCategoryModalVisible,

    // Alert modal
    modalVisible,
    setModalVisible,
    modalMessage,

    // Actions
    handleAddRecipe,
  } = useAddRecipeForm();

  return (
    <SafeAreaProvider style={styles.container}>
      <Pressable 
        style={{ flex: 1 }} 
        onPress={() => {
          setCategoryModalVisible(false);
        }}
      >
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>

          <FormHeaderWithImage
            title="Новий рецепт"
            imageUri={imageUri}
            setImageUri={setImageUri}
            onBack={() => navigation.navigate('MainMenu')}
          />

          {/* NAME INPUT */}
          <LabeledInput label="Назва" value={name} onChangeText={setName} />

          {/* CATEGORY INPUT */}
          <CategoryDropdown
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            isOpen={isCategoryModalVisible}
            onToggle={() => setCategoryModalVisible(prev => !prev)}
            onClose={() => setCategoryModalVisible(false)}
            dropdownStyle={[styles.DropdownContainer, { width: '100%', marginLeft: 0 }]}
            itemTextStyle={styles.dropdownItemText} 
          />

          {/* RECIPE TEXT */}
          <Text style={styles.label}>Текст рецепту</Text>
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
            onPress={handleAddRecipe}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Додати рецепт</Text>
          </AnimatedButton>

        </View>
      </ScrollView>
      </Pressable>
    </SafeAreaProvider>
  );
};

export default AddRecipe;

const styles = StyleSheet.create({
  // main container
  pressable: {
    flex: 1,
  },
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

  // input fields
  label: {
    fontSize: hp(2.2),
    fontWeight: '500',
    color: '#333',
    marginBottom: hp(0.5),
    marginTop: hp(2), 
  },

  // CATEGORIES
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
