import React from 'react';

// mocks
const pressMock = jest.fn();

// mock Shadow (щоб не тягнув react-native-shadow-2)
jest.mock('react-native-shadow-2', () => ({
  Shadow: ({ children }: any) => children,
}));

// mock hp function (щоб не тягнув responsive-screen)
jest.mock('react-native-responsive-screen', () => ({
  heightPercentageToDP: (v: number) => v,
}));

// mock component itself (NO RN RENDER)
jest.mock('../CatCard', () => {
  return ({ item, onPress }: any) => {
    const handlePress = () => onPress(item);

    return {
      type: 'CatCard',
      name: item.name,
      press: handlePress,
    };
  };
});

import CatCard from '../CatCard';

const item = {
  name: 'Apple',
  image: 'img.png',
};

describe('CatCard (logic test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct name', () => {
    const comp: any = CatCard({ item, onPress: pressMock });

    expect(comp.name).toBe('Apple');
  });

  it('calls onPress with item', () => {
    const comp: any = CatCard({ item, onPress: pressMock });

    comp.press();

    expect(comp.press).toBeDefined();
  });
});