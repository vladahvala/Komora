import { renderHook, act } from '@testing-library/react-hooks';
import { useAddRecipeForm } from '../useRecipeForm';
import { RecipesContext } from '../../../context/RecipesContext';
import React from 'react';

// mock navigation
const goBackMock = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: goBackMock,
  }),
}));

const addRecipeMock = jest.fn();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RecipesContext.Provider
    value={{
      addRecipe: addRecipeMock,
    } as any}   // 👈 важливо (бо контекст має багато полів)
  >
    {children}
  </RecipesContext.Provider>
);

describe('useAddRecipeForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds recipe successfully and navigates back', () => {
    const { result } = renderHook(() => useAddRecipeForm(), { wrapper });
  
    act(() => {
      result.current.setName('Jam');
    });
  
    act(() => {
      result.current.setSelectedCategory('Fruits');
    });
  
    act(() => {
      result.current.setRecipeText('Test recipe');
    });
  
    act(() => {
      result.current.handleAddRecipe();
    });
  
    expect(addRecipeMock).toHaveBeenCalledTimes(1);
    expect(goBackMock).toHaveBeenCalled();
  });

  it('shows modal if name is empty', () => {
    const { result } = renderHook(() => useAddRecipeForm(), { wrapper });

    act(() => {
      result.current.setName('');
      result.current.setSelectedCategory('Fruits');
      result.current.handleAddRecipe();
    });

    expect(result.current.modalVisible).toBe(true);
    expect(addRecipeMock).not.toHaveBeenCalled();
  });

  it('shows modal if category is missing', () => {
    const { result } = renderHook(() => useAddRecipeForm(), { wrapper });

    act(() => {
      result.current.setName('Jam');
      result.current.setSelectedCategory(null);
      result.current.handleAddRecipe();
    });

    expect(result.current.modalVisible).toBe(true);
    expect(addRecipeMock).not.toHaveBeenCalled();
  });
});