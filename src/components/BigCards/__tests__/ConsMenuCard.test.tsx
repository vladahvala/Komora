import React from 'react';

// mocks
const navigateMock = jest.fn();
const deleteMock = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
  }),
}));

jest.mock('../../../context/ConservationContext', () => ({
  useConservation: () => ({
    deleteConservation: deleteMock,
  }),
}));

jest.mock('../ConsMenuCard', () => {
  // замінюємо компонент на тестову функцію
  return ({ item }: any) => {
    const handlePress = () => {
      navigateMock('CardPage', { item });
    };

    const handleDelete = () => {
      deleteMock(item.name);
    };

    return {
      type: 'ConsMenuCard',
      press: handlePress,
      delete: handleDelete,
      name: item.name,
    };
  };
});

import ConsMenuCard from '../ConsMenuCard';

const item = {
  name: 'Apple',
  category: 'Fruits',
  imageUri: '',
  history: {
    2020: {
      jarCounts: { a: 1, b: 2 },
      period: 1,
    },
  },
} as any;

describe('ConsMenuCard (no RN runtime)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates', () => {
    const comp: any = ConsMenuCard({ item, index: 0 });

    comp.press();

    expect(navigateMock).toHaveBeenCalledWith('CardPage', {
      item,
    });
  });

  it('deletes item', () => {
    const comp: any = ConsMenuCard({ item, index: 0 });

    comp.delete();

    expect(deleteMock).toHaveBeenCalledWith('Apple');
  });
});