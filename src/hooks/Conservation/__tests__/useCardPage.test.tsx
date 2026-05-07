import { renderHook, act } from '@testing-library/react';

// mock context
jest.mock('../../../context/ConservationContext', () => {
  const updateJarHistoryMock = jest.fn();
  const updateImageMock = jest.fn();

  return {
    useConservation: () => ({
      conservations: [
        {
          name: 'Jam',
          category: 'food',
          imageUri: null,
          history: {
            2024: {},
          },
        },
      ],
      updateJarHistory: updateJarHistoryMock,
      updateImage: updateImageMock,
    }),
    __mocks: {
      updateJarHistoryMock,
      updateImageMock,
    },
  };
});

// mock jar manager hook
jest.mock('../useJarManager', () => ({
  useJarManager: () => ({
    selectedYear: '2024',
    jarCounts: { jar2_3l: 1 },
    setDrafts: jest.fn(),
  }),
}));

import { useCardPage } from '../useCardPage';

// дістаємо mocks після jest.mock
const contextMock = jest.requireMock('../../../context/ConservationContext');
const updateJarHistoryMock = contextMock.__mocks.updateJarHistoryMock;
const updateImageMock = contextMock.__mocks.updateImageMock;

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

  test('handleSave calls updateJarHistory and goBack', () => {
    const { result } = renderHook(() =>
      useCardPage({
        name: 'Jam',
        category: 'food',
        imageUri: null,
      })
    );

    const goBackMock = jest.fn();
    const navigation = { goBack: goBackMock };

    act(() => {
      result.current.handleSave(navigation);
    });

    expect(updateJarHistoryMock).toHaveBeenCalledWith(
      'Jam',
      '2024',
      { jar2_3l: 1 }
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