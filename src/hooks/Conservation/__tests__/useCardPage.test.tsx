import { renderHook, act } from '@testing-library/react';
import { useCardPage } from '../useCardPage';

const updateJarHistoryMock = jest.fn();
const updateImageMock = jest.fn();

// MOCK context
jest.mock('../../../context/ConservationContext', () => ({
  useConservation: () => ({
    conservations: [
      {
        name: 'Jam',
        category: 'food',
        imageUri: null,
        history: {
          2024: {
            jarCounts: {},
            period: 1,
          },
        },
      },
    ],
    updateJarHistory: updateJarHistoryMock,
    updateImage: updateImageMock,
  }),
}));

// MOCK jar manager
jest.mock('../useJarManager', () => ({
  useJarManager: () => ({
    selectedYear: '2024',
    jarCounts: { jar2_3l: 1, jar4_2l: 0, jar7_15l: 0, jar2_1l: 0, jar1_05l: 0 },
    setDrafts: jest.fn(),
  }),
}));

describe('useCardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('finds current item from context', () => {
    const { result } = renderHook(() =>
      useCardPage({
        name: 'Jam',
        category: 'food',
        imageUri: null,
      })
    );

    expect(result.current.currentItem?.name).toBe('Jam');
  });

  test('handleImageChange calls updateImage', () => {
    const { result } = renderHook(() =>
      useCardPage({
        name: 'Jam',
        category: 'food',
        imageUri: null,
      })
    );

    act(() => {
      result.current.handleImageChange('new-uri');
    });

    expect(updateImageMock).toHaveBeenCalledWith('Jam', 'new-uri');
  });

  test('handleSave calls updateJarHistory', () => {
    const { result } = renderHook(() =>
      useCardPage({
        name: 'Jam',
        category: 'food',
        imageUri: null,
      })
    );

    const goBackMock = jest.fn();

    act(() => {
      result.current.handleSave({ goBack: goBackMock });
    });

    expect(updateJarHistoryMock).toHaveBeenCalledWith(
      'Jam',
      '2024',
      expect.any(Object)
    );

    expect(goBackMock).toHaveBeenCalled();
  });

  test('availableYears are sorted correctly', () => {
    const { result } = renderHook(() =>
      useCardPage({
        name: 'Jam',
        category: 'food',
        imageUri: null,
      })
    );

    expect(result.current.availableYears).toEqual(['2024']);
  });
});