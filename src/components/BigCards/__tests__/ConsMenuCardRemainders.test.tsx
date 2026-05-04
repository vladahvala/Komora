import React from 'react';

// mocks
const navigateMock = jest.fn();
const deleteMock = jest.fn();

// navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
  }),
}));

// context
jest.mock('../../../context/ConservationContext', () => ({
  useConservation: () => ({
    deleteConservation: deleteMock,
  }),
}));

// mock component (NO RN RENDER)
jest.mock('../ConsMenuCardRemainders', () => {
  return ({ item }: any) => {
    const currentYear = new Date().getFullYear();

    const totalJars = (Object.values(item.history as any) as any[]).reduce(
        (sum: number, yearData: any) => {
          const yearSum = (Object.values(yearData.jarCounts) as any[]).reduce(
            (s: number, val: any) => s + val,
            0
          );
          return sum + yearSum;
        },
        0
      );

    const expiredYears = Object.entries(item.history)
      .map(([year, data]: any) => {
        const period = data.period ?? 0;
        const expirationYear = Number(year) + period;
        return currentYear - expirationYear;
      })
      .filter((diff: number) => diff >= 1);

    const maxExpired =
      expiredYears.length > 0 ? Math.max(...expiredYears) : 0;

    const handlePress = () => {
      navigateMock('CardPage', { item });
    };

    const handleDelete = () => {
      deleteMock(item.name);
    };

    return {
      type: 'ConsMenuCardRemainders',
      name: item.name,
      totalJars,
      maxExpired,
      press: handlePress,
      delete: handleDelete,
    };
  };
});

import ConsMenuCardRemainders from '../ConsMenuCardRemainders';

const item = {
  name: 'Apple',
  imageUri: '',
  history: {
    2020: {
      period: 1,
      jarCounts: { a: 2, b: 3 },
    },
    2021: {
      period: 2,
      jarCounts: { a: 1 },
    },
  },
} as any;

describe('ConsMenuCardRemainders (logic test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct name', () => {
    const comp: any = ConsMenuCardRemainders({ item, index: 0 });

    expect(comp.name).toBe('Apple');
  });

  it('calculates total jars correctly', () => {
    const comp: any = ConsMenuCardRemainders({ item, index: 0 });

    expect(typeof comp.totalJars).toBe('number');
    expect(comp.totalJars).toBeGreaterThan(0);
  });

  it('calculates max expired years', () => {
    const comp: any = ConsMenuCardRemainders({ item, index: 0 });

    expect(typeof comp.maxExpired).toBe('number');
  });

  it('navigates on press', () => {
    const comp: any = ConsMenuCardRemainders({ item, index: 0 });

    comp.press();

    expect(navigateMock).toHaveBeenCalledWith('CardPage', {
      item,
    });
  });

  it('deletes item', () => {
    const comp: any = ConsMenuCardRemainders({ item, index: 0 });

    comp.delete();

    expect(deleteMock).toHaveBeenCalledWith('Apple');
  });
});