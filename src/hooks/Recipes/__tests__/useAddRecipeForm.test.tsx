import { renderHook, act } from '@testing-library/react';

// mocks
const addRecipeMock = jest.fn();
const goBackMock = jest.fn();

// mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: goBackMock,
  }),
}));

// mock RecipesContext
jest.mock('../../../context/RecipesContext', () => ({
  RecipesContext: {},
}));

// mock react useContext
jest.mock('react', () => {
  const actual = jest.requireActual('react');

  return {
    ...actual,
    useContext: jest.fn(),
  };
});

import { useContext } from 'react';
import { useAddRecipeForm } from '../useAddRecipeForm';

describe('useAddRecipeForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useContext as jest.Mock).mockReturnValue({
      addRecipe: addRecipeMock,
    });
  });

  test('initial state is correct', () => {
    const { result } = renderHook(() =>
      useAddRecipeForm()
    );

    expect(result.current.name).toBe('');
    expect(result.current.imageUri).toBeNull();
    expect(result.current.selectedCategory).toBeNull();
    expect(result.current.recipeText).toBe('');
    expect(result.current.modalVisible).toBe(false);
  });

  test('shows modal if name is empty', () => {
    const { result } = renderHook(() =>
      useAddRecipeForm()
    );

    act(() => {
      result.current.handleAddRecipe();
    });

    expect(result.current.modalVisible).toBe(true);

    expect(result.current.modalMessage).toBe(
      'Enter recipe name!'
    );
  });

  test('shows modal if category is not selected', () => {
    const { result } = renderHook(() =>
      useAddRecipeForm()
    );

    act(() => {
      result.current.setName('Cake');
    });

    act(() => {
      result.current.handleAddRecipe();
    });

    expect(result.current.modalVisible).toBe(true);

    expect(result.current.modalMessage).toBe(
      'Select a category!'
    );
  });

  test('handleAddRecipe adds recipe and resets form', () => {
    const { result } = renderHook(() =>
      useAddRecipeForm()
    );

    act(() => {
      result.current.setName('Cake');
      result.current.setSelectedCategory('Dessert');
      result.current.setRecipeText('Mix ingredients');
      result.current.setImageUri('image.jpg');
    });

    act(() => {
      result.current.handleAddRecipe();
    });

    expect(addRecipeMock).toHaveBeenCalledTimes(1);

    expect(addRecipeMock).toHaveBeenCalledWith({
      name: 'Cake',
      category: 'Dessert',
      imageUri: 'image.jpg',
      recipeText: 'Mix ingredients',
    //   history: {},
    });

    expect(goBackMock).toHaveBeenCalledTimes(1);

    expect(result.current.name).toBe('');
    expect(result.current.selectedCategory).toBeNull();
    expect(result.current.imageUri).toBeNull();
    expect(result.current.recipeText).toBe('');
  });

  test('category modal visibility changes', () => {
    const { result } = renderHook(() =>
      useAddRecipeForm()
    );

    expect(result.current.isCategoryModalVisible).toBe(
      false
    );

    act(() => {
      result.current.setCategoryModalVisible(true);
    });

    expect(result.current.isCategoryModalVisible).toBe(
      true
    );
  });

  test('alert modal visibility changes', () => {
    const { result } = renderHook(() =>
      useAddRecipeForm()
    );

    act(() => {
      result.current.setModalVisible(true);
    });

    expect(result.current.modalVisible).toBe(true);
  });
});