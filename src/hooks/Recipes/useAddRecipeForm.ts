import { useState, useContext } from 'react';
import { RecipesContext, RecipeItem } from '../../context/RecipesContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';

/**
 * Custom hook for AddRecipe form
 * Handles form state: name, category, image, recipe text
 * Validates inputs, shows alerts, and adds a new recipe
 */
export const useAddRecipeForm = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { addRecipe } = useContext(RecipesContext);

  // IMAGE
  const [imageUri, setImageUri] = useState<string | null>(null);

  // RECIPE NAME
  const [name, setName] = useState('');

  // CATEGORY
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

  // RECIPE TEXT
  const [recipeText, setRecipeText] = useState('');

  // ALERT MODAL
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // ADD RECIPE
  const handleAddRecipe = () => {
    // Validate name
    if (!name) {
      setModalMessage('Enter recipe name!');
      setModalVisible(true);
      return;
    }
    // Validate category
    if (!selectedCategory) {
      setModalMessage('Select a category!');
      setModalVisible(true);
      return;
    }

    // Create new recipe item
    const newItem: RecipeItem = {
      name,
      category: selectedCategory,
      imageUri,
      recipeText,
      history: {},
    };

    // Add recipe to context
    addRecipe(newItem);

    // Reset form
    setName('');
    setSelectedCategory(null);
    setImageUri(null);
    setRecipeText('');

    // Navigate back
    navigation.goBack();
  };

  return {
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
  };
};
