// Заглушення певних warning-ів
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((msg) => {
    if (
      msg.includes('react-test-renderer is deprecated') ||
      msg.includes('The current testing environment is not configured to support act')
    ) {
      return;
    }
    console.error(msg);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

import { renderHook, act } from '@testing-library/react-hooks';
import { useConservationForm } from '../useConservationForm';

describe('useConservationForm hook', () => {

  it('returns error if name is empty', () => {
    const { result } = renderHook(() => useConservationForm());

    act(() => {
      result.current.setName('');
    });

    expect(result.current.validateForm()).toBe('Введіть назву консервації!');
  });

  it('returns error if category not selected', () => {
    const { result } = renderHook(() => useConservationForm());

    act(() => {
      result.current.setName('Моя консервація');
      result.current.setSelectedCategory(null);
    });

    expect(result.current.validateForm()).toBe('Оберіть категорію!');
  });

  it('returns error if no jars added', () => {
    const { result } = renderHook(() => useConservationForm());

    act(() => {
      result.current.setName('Моя консервація');
      result.current.setSelectedCategory('Фрукти');
      result.current.setJarCounts({
        jar2_3l: 0,
        jar4_2l: 0,
        jar7_15l: 0,
        jar2_1l: 0,
        jar1_05l: 0,
      });
    });

    expect(result.current.validateForm()).toBe('Додайте хоча б одну банку!');
  });

  it('creates correct conservation item', () => {
    const { result } = renderHook(() => useConservationForm());

    act(() => {
      result.current.setName('Моя консервація');
      result.current.setSelectedCategory('Фрукти');
      result.current.setSelectedYear('2023');
      result.current.setPeriod('2');
      result.current.setJarCounts({ jar2_3l: 1, jar4_2l: 0, jar7_15l: 0, jar2_1l: 0, jar1_05l: 0 });
    });

    const item = result.current.createConservationItem();
    expect(item.history['2023'].period).toBe(2);
    expect(item.history['2023'].jarCounts.jar2_3l).toBe(1);
  });

  // it('calls onAdd if handleAddConservation is valid', async () => {
  //   const onAddMock = jest.fn();
  //   const { result } = renderHook(() => useConservationForm(onAddMock));
  
  //   await act(async () => {
  //     result.current.setName('Моя консервація');
  //     result.current.setSelectedCategory('Фрукти');
  //     result.current.setSelectedYear('2023'); // рік
  //     result.current.setPeriod('2');          // period
  //     result.current.setJarCounts({ jar2_3l: 1, jar4_2l: 0, jar7_15l: 0, jar2_1l: 0, jar1_05l: 0 });
  //     result.current.handleAddConservation();
  //   });
  
  //   expect(onAddMock).toHaveBeenCalledTimes(1);
  // });
});