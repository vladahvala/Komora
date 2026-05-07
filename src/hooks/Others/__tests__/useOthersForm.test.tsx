import { renderHook, act } from '@testing-library/react';

// mocks
const addOtherMock = jest.fn();

// ✅ mock context file
jest.mock('../../../context/OthersContext', () => ({
  OthersContext: {},
}));

// ✅ mock react useContext
jest.mock('react', () => {
  const actual = jest.requireActual('react');

  return {
    ...actual,
    useContext: jest.fn(),
  };
});

import { useContext } from 'react';
import { useOthersForm } from '../useOthersForm';

describe('useOthersForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useContext as jest.Mock).mockReturnValue({
      addOther: addOtherMock,
    });
  });

  test('initial state is correct', () => {
    const { result } = renderHook(() => useOthersForm());

    expect(result.current.name).toBe('');
    expect(result.current.packsCount).toBe('');
    expect(result.current.imageUri).toBeNull();
  });

  test('validateForm returns error for empty name', () => {
    const { result } = renderHook(() => useOthersForm());

    expect(result.current.validateForm()).toBe(
      'Введіть назву продукту!'
    );
  });

  test('validateForm returns error for invalid count', () => {
    const { result } = renderHook(() => useOthersForm());

    act(() => {
      result.current.setName('Apple');
      result.current.setPacksCount('0');
    });

    expect(result.current.validateForm()).toBe(
      'Кількість має бути більшою за 0!'
    );
  });

  test('handleAddOther calls addOther and resets form', () => {
    const onFinish = jest.fn();

    const { result } = renderHook(() =>
      useOthersForm(onFinish)
    );

    // update state first
    act(() => {
      result.current.setName('Apple');
      result.current.setPacksCount('2');
    });

    // then submit
    act(() => {
      result.current.handleAddOther();
    });

    expect(addOtherMock).toHaveBeenCalledTimes(1);

    expect(onFinish).toHaveBeenCalledTimes(1);

    expect(result.current.name).toBe('');
    expect(result.current.packsCount).toBe('');
  });

  test('handleAddOther shows modal on validation error', () => {
    const { result } = renderHook(() => useOthersForm());

    act(() => {
      result.current.handleAddOther();
    });

    expect(result.current.modalVisible).toBe(true);

    expect(result.current.modalMessage).toBeTruthy();
  });
});