import { renderHook, act } from '@testing-library/react';

// mocks
const mockUpdateCount = jest.fn();
const mockUpdateImage = jest.fn();
const mockDeleteHistory = jest.fn();

jest.mock('../../../context/OthersContext', () => ({
  useOthers: () => ({
    others: [
      {
        name: 'Apple Juice',
        imageUri: 'old-image',
        history: [
          {
            date: '10.05.2024',
            count: 2,
          },
          {
            date: '01.01.2024',
            count: 5,
          },
        ],
      },
    ],

    updateCount: mockUpdateCount,
    updateImage: mockUpdateImage,
    deleteHistory: mockDeleteHistory,
  }),
}));

import { useCardOther } from '../useCardOther';

describe('useCardOther', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('finds current item by normalized name', () => {
    const { result } = renderHook(() =>
      useCardOther('  apple   juice ')
    );

    expect(result.current.currentItem?.name).toBe('Apple Juice');
  });

  test('sorts history by date correctly', () => {
    const { result } = renderHook(() =>
      useCardOther('Apple Juice')
    );

    expect(result.current.sortedHistory[0].date).toBe('01.01.2024');
    expect(result.current.sortedHistory[1].date).toBe('10.05.2024');
  });

  test('handleImageChange updates image', () => {
    const { result } = renderHook(() =>
      useCardOther('Apple Juice')
    );

    act(() => {
      result.current.handleImageChange('new-image');
    });

    expect(mockUpdateImage).toHaveBeenCalledWith(
      'Apple Juice',
      'new-image'
    );

    expect(result.current.imageUri).toBe('new-image');
  });

  test('handleUpdateCount updates count', () => {
    const { result } = renderHook(() =>
      useCardOther('Apple Juice')
    );

    act(() => {
      result.current.handleUpdateCount(10);
    });

    expect(mockUpdateCount).toHaveBeenCalledWith(
      'Apple Juice',
      10,
      '01.01.2024'
    );
  });

  test('handleDeleteDate deletes history entry', () => {
    const { result } = renderHook(() =>
      useCardOther('Apple Juice')
    );

    act(() => {
      result.current.handleDeleteDate('01.01.2024');
    });

    expect(mockDeleteHistory).toHaveBeenCalledWith(
      'Apple Juice',
      '01.01.2024'
    );
  });

  test('handleSave updates image and calls callback', () => {
    const onFinishMock = jest.fn();

    const { result } = renderHook(() =>
      useCardOther('Apple Juice')
    );

    act(() => {
      result.current.handleSave(onFinishMock);
    });

    expect(mockUpdateImage).toHaveBeenCalledWith(
      'Apple Juice',
      'old-image'
    );

    expect(onFinishMock).toHaveBeenCalled();
  });

  test('dropdown visibility can be changed', () => {
    const { result } = renderHook(() =>
      useCardOther('Apple Juice')
    );

    expect(result.current.dropdownVisible).toBe(false);

    act(() => {
      result.current.setDropdownVisible(true);
    });

    expect(result.current.dropdownVisible).toBe(true);
  });
});