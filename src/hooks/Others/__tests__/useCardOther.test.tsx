jest.mock('../../../context/OthersContext', () => ({
    useOthers: jest.fn(),
  }));
  
  import { renderHook, act } from '@testing-library/react-hooks';
  import { useCardOther } from '../useCardOther';
  import { useOthers } from '../../../context/OthersContext';
  
  const mockUpdateCount = jest.fn();
  const mockUpdateImage = jest.fn();
  const mockDeleteHistory = jest.fn();
  
  const mockOthers = [
    {
      name: 'Sugar',
      imageUri: 'sugar.jpg',
      history: [
        { date: '01.01.2022', count: 5 },
        { date: '01.01.2021', count: 2 },
      ],
    },
  ];
  
  describe('useCardOther hook', () => {
  
    beforeEach(() => {
      (useOthers as jest.Mock).mockReturnValue({
        others: mockOthers,
        updateCount: mockUpdateCount,
        updateImage: mockUpdateImage,
        deleteHistory: mockDeleteHistory,
      });
    });
  
    it('finds current item by normalized name', () => {
      const { result } = renderHook(() => useCardOther('  sugar '));
  
      expect(result.current.currentItem?.name).toBe('Sugar');
    });
  
    it('sorts history by date', () => {
      const { result } = renderHook(() => useCardOther('Sugar'));
  
      expect(result.current.sortedHistory[0].date).toBe('01.01.2021');
    });
  
    it('updates image', () => {
      const { result } = renderHook(() => useCardOther('Sugar'));
  
      act(() => {
        result.current.handleImageChange('new.jpg');
      });
  
      expect(mockUpdateImage).toHaveBeenCalledWith('Sugar', 'new.jpg');
    });
  
    it('updates count for selected date', () => {
      const { result } = renderHook(() => useCardOther('Sugar'));
  
      act(() => {
        result.current.handleUpdateCount(10);
      });
  
      expect(mockUpdateCount).toHaveBeenCalled();
    });
  
    it('deletes history entry', () => {
      const { result } = renderHook(() => useCardOther('Sugar'));
  
      act(() => {
        result.current.handleDeleteDate('01.01.2022');
      });
  
      expect(mockDeleteHistory).toHaveBeenCalledWith('Sugar', '01.01.2022');
    });
  
    it('saves image changes', () => {
      const { result } = renderHook(() => useCardOther('Sugar'));
  
      act(() => {
        result.current.handleSave();
      });
  
      expect(mockUpdateImage).toHaveBeenCalled();
    });
  
  });