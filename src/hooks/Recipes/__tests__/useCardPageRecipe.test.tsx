jest.mock('../../../context/RecipesContext', () => ({
    useRecipe: jest.fn(),
  }));
  
  import { renderHook, act } from '@testing-library/react-hooks';
  import { useCardPageRecipe } from '../useCardPageRecipe';
  import { useRecipe } from '../../../context/RecipesContext';
  
  const mockUpdateImage = jest.fn();
  const mockUpdateCategory = jest.fn();
  const mockAddIngredient = jest.fn();
  const mockUpdateRecipeText = jest.fn();
  const mockToggleFavorite = jest.fn();
  
  const mockItem = {
    name: 'Pickles',
    category: 'Солені',
    imageUri: 'img.jpg',
    recipeText: 'text',
  };
  
  describe('useCardPageRecipe hook', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules(); // 🔥 ВАЖЛИВО — фікс closure проблеми
  
      (useRecipe as jest.Mock).mockReturnValue({
        recipes: [mockItem],
        updateImage: mockUpdateImage,
        updateCategory: mockUpdateCategory,
        addIngredient: mockAddIngredient,
        updateRecipeText: mockUpdateRecipeText,
        favorites: ['Pickles'],
        toggleFavorite: mockToggleFavorite,
      });
    });
  
    it('initializes current item and favorite state', () => {
      const { result } = renderHook(() => useCardPageRecipe(mockItem));
  
      expect(result.current.currentItem?.name).toBe('Pickles');
      expect(result.current.isFavorite).toBe(true);
    });
  
    it('updates image', () => {
      const { result } = renderHook(() => useCardPageRecipe(mockItem));
  
      act(() => {
        result.current.changeImage('new.jpg');
      });
  
      expect(mockUpdateImage).toHaveBeenCalledWith('Pickles', 'new.jpg');
    });
  
    it('changes category', () => {
      const { result } = renderHook(() => useCardPageRecipe(mockItem));
  
      act(() => {
        result.current.changeCategory('Мариновані');
      });
  
      expect(mockUpdateCategory).toHaveBeenCalledWith('Pickles', 'Мариновані');
    });
  
    it('adds ingredient correctly', () => {
      const { result } = renderHook(() => useCardPageRecipe(mockItem));
  
      act(() => {
        result.current.setNewIngredient({
          amount: '2',
          unit: 'ст л',
          name: 'Salt',
        });
      });
  
      act(() => {
        result.current.addNewIngredient();
      });
  
      expect(mockAddIngredient).toHaveBeenCalledWith(
        'Pickles',
        { amount: '2 ст л', name: 'Salt' }
      );
    });
  
    it('does not add ingredient if empty', () => {
      const { result } = renderHook(() => useCardPageRecipe(mockItem));
  
      act(() => {
        result.current.setNewIngredient({
          amount: '',
          unit: 'ст л',
          name: '',
        });
  
        result.current.addNewIngredient();
      });
  
      expect(mockAddIngredient).not.toHaveBeenCalled();
    });
  
    it('saves recipe text', () => {
      const { result } = renderHook(() => useCardPageRecipe(mockItem));
  
      act(() => {
        result.current.saveRecipeText('new recipe text');
      });
  
      expect(mockUpdateRecipeText).toHaveBeenCalledWith(
        'Pickles',
        'new recipe text'
      );
    });
  
    it('toggles favorite', () => {
        const { result } = renderHook(() => useCardPageRecipe(mockItem));
      
        act(() => {
          result.current.toggleFavorite();
        });
      
        expect(mockToggleFavorite).toHaveBeenCalled();
      });
  });