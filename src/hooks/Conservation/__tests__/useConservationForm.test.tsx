import { renderHook, act } from '@testing-library/react';
import { useConservationForm } from '../useConservationForm';

describe('useConservationForm', () => {
  test('initial state is correct', () => {
    const { result } = renderHook(() => useConservationForm());

    expect(result.current.name).toBe('');
    expect(result.current.selectedCategory).toBeNull();
    expect(result.current.selectedYear).toBe('2021');
    expect(result.current.period).toBe('');
    expect(result.current.imageUri).toBeNull();
  });

  test('setName updates value', () => {
    const { result } = renderHook(() => useConservationForm());

    act(() => {
      result.current.setName('Jam');
    });

    expect(result.current.name).toBe('Jam');
  });

  test('validateForm returns error if name is empty', () => {
    const { result } = renderHook(() => useConservationForm());

    const error = result.current.validateForm();

    expect(error).toBe('Введіть назву консервації!');
  });

  test('validateForm returns error if category missing', () => {
    const { result } = renderHook(() => useConservationForm());

    act(() => {
      result.current.setName('Jam');
    });

    const error = result.current.validateForm();

    expect(error).toBe('Оберіть категорію!');
  });

  test('handleAddConservation calls onAdd and resets form', () => {
    const onAddMock = jest.fn();

    const { result } = renderHook(() =>
      useConservationForm(onAddMock)
    );

    act(() => {
      result.current.setName('Jam');
      result.current.setSelectedCategory('Food');
      result.current.setJarCounts({
        jar2_3l: 1,
        jar4_2l: 0,
        jar7_15l: 0,
        jar2_1l: 0,
        jar1_05l: 0,
      });
    });

    act(() => {
      result.current.handleAddConservation();
    });

    expect(onAddMock).toHaveBeenCalledTimes(1);

    const item = onAddMock.mock.calls[0][0];

    expect(item.name).toBe('Jam');
    expect(item.category).toBe('Food');
    expect(item.history['2021']).toBeDefined();

    // reset check
    expect(result.current.name).toBe('');
    expect(result.current.selectedCategory).toBeNull();
  });
});