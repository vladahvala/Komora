import { renderHook, act } from '@testing-library/react-hooks';
import { useCardPage } from '../useCardPage';
import * as ConservationContext from '../../../context/ConservationContext';
import { useJarManager } from '../useJarManager';

jest.mock('../useJarManager');

const mockItem = {
  name: 'Jam',
  category: 'Fruits',
  imageUri: 'initial.jpg',
};

const mockConservations = [
  {
    name: 'Jam',
    category: 'Fruits',
    imageUri: 'initial.jpg',
    history: {
      '2021': { jarCounts: { jar2_3l: 1, jar4_2l: 0, jar7_15l: 0, jar2_1l: 0, jar1_05l: 0 }, period: 2 },
      '2022': { jarCounts: { jar2_3l: 2, jar4_2l: 0, jar7_15l: 0, jar2_1l: 0, jar1_05l: 0 }, period: 3 },
    },
  },
];

// Мок для useConservation
jest.mock('../../../context/ConservationContext', () => ({
  useConservation: jest.fn(),
}));

describe('useCardPage hook', () => {
  let updateJarHistoryMock: jest.Mock;
  let updateImageMock: jest.Mock;

  beforeEach(() => {
    updateJarHistoryMock = jest.fn();
    updateImageMock = jest.fn();

    // @ts-ignore
    ConservationContext.useConservation.mockReturnValue({
      conservations: mockConservations,
      updateJarHistory: updateJarHistoryMock,
      updateImage: updateImageMock,
    });

    (useJarManager as jest.Mock).mockReturnValue({
      selectedYear: '2021',
      jarCounts: mockConservations[0].history['2021'].jarCounts,
      setDrafts: jest.fn(),
    });
  });

  it('initializes currentItem and availableYears', () => {
    const { result } = renderHook(() => useCardPage(mockItem));

    expect(result.current.currentItem).toEqual(mockConservations[0]);
    expect(result.current.availableYears).toEqual(['2021', '2022']);
  });

  it('handleImageChange updates uri and calls updateImage', () => {
    const { result } = renderHook(() => useCardPage(mockItem));

    act(() => {
      result.current.handleImageChange('new.jpg');
    });

    expect(result.current.imageUri).toBe('new.jpg');
    expect(updateImageMock).toHaveBeenCalledWith('Jam', 'new.jpg');
  });

  it('handleSave calls updateJarHistory and clears drafts', () => {
    const setDraftsMock = jest.fn();
    (useJarManager as jest.Mock).mockReturnValue({
      selectedYear: '2021',
      jarCounts: mockConservations[0].history['2021'].jarCounts,
      setDrafts: setDraftsMock,
    });

    const goBackMock = jest.fn();
    const navigation = { goBack: goBackMock };

    const { result } = renderHook(() => useCardPage(mockItem));

    act(() => {
      result.current.handleSave(navigation);
    });

    expect(updateJarHistoryMock).toHaveBeenCalledWith(
      'Jam',
      '2021',
      mockConservations[0].history['2021'].jarCounts
    );
    expect(setDraftsMock).toHaveBeenCalled();
    expect(goBackMock).toHaveBeenCalled();
  });
});