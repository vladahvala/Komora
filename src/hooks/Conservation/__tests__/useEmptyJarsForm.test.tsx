jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
  }));
  
  jest.mock('../../../context/ConservationContext', () => ({
    useConservation: jest.fn(),
  }));
  
  import { renderHook, act } from '@testing-library/react-hooks';
  import { useEmptyJarsForm } from '../useEmptyJarsForm';
  import { useNavigation } from '@react-navigation/native';
  import { useConservation } from '../../../context/ConservationContext';
  
  const mockGoBack = jest.fn();
  const mockUpdateEmptyJars = jest.fn();
  
  const mockEmptyJars = {
    jar2_3l: 1,
    jar4_2l: 2,
    jar7_15l: 3,
    jar2_1l: 4,
    jar1_05l: 5,
  };
  
  describe('useEmptyJarsForm hook', () => {
  
    beforeEach(() => {
      (useNavigation as jest.Mock).mockReturnValue({
        goBack: mockGoBack,
      });
  
      (useConservation as jest.Mock).mockReturnValue({
        emptyJars: mockEmptyJars,
        updateEmptyJars: mockUpdateEmptyJars,
      });
    });
  
    it('initializes localJars from context', () => {
      const { result } = renderHook(() => useEmptyJarsForm());
  
      expect(result.current.localJars).toEqual(mockEmptyJars);
    });
  
    it('calculates totalJars correctly', () => {
      const { result } = renderHook(() => useEmptyJarsForm());
  
      expect(result.current.totalJars).toBe(15);
    });
  
    it('updates localJars state', () => {
      const { result } = renderHook(() => useEmptyJarsForm());
  
      act(() => {
        result.current.setLocalJars({
          jar2_3l: 0,
          jar4_2l: 0,
          jar7_15l: 0,
          jar2_1l: 0,
          jar1_05l: 1,
        });
      });
  
      expect(result.current.localJars.jar1_05l).toBe(1);
    });
  
    it('calls updateEmptyJars on saveChanges', () => {
      const { result } = renderHook(() => useEmptyJarsForm());
  
      act(() => {
        result.current.saveChanges();
      });
  
      expect(mockUpdateEmptyJars).toHaveBeenCalledWith(mockEmptyJars);
    });
  
    it('calls navigation.goBack on handleBack', () => {
      const { result } = renderHook(() => useEmptyJarsForm());
  
      act(() => {
        result.current.handleBack();
      });
  
      expect(mockGoBack).toHaveBeenCalled();
    });
  
  });