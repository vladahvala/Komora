import { renderHook, act } from '@testing-library/react-hooks';
import { useOthersMain } from '../useOthersMain';
import { useOthers } from '../../../context/OthersContext';

jest.mock('../../../context/OthersContext', () => ({
  useOthers: jest.fn(),
}));

const loadOthersMock = jest.fn();

describe('useOthersMain hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useOthers as jest.Mock).mockReturnValue({
      others: [
        { name: 'Apple' },
        { name: 'Banana' },
        { name: 'Orange' },
      ],
      loadOthers: loadOthersMock,
      loading: false,
    });
  });

  it('loads data on mount', () => {
    renderHook(() => useOthersMain());

    expect(loadOthersMock).toHaveBeenCalledTimes(1);
  });

  it('filters data by search text', () => {
    const { result } = renderHook(() => useOthersMain());

    act(() => {
      result.current.setSearchText('ap');
    });

    expect(result.current.filteredData).toEqual([
      { name: 'Apple' },
    ]);
  });

  it('toggles icon state', () => {
    const { result } = renderHook(() => useOthersMain());

    expect(result.current.isBigIcon).toBe(true);

    act(() => {
      result.current.toggleIcon();
    });

    expect(result.current.isBigIcon).toBe(false);
  });

  it('updates search text correctly', () => {
    const { result } = renderHook(() => useOthersMain());

    act(() => {
      result.current.setSearchText('banana');
    });

    expect(result.current.searchText).toBe('banana');
  });
});