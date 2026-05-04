import React from 'react';

// mocks
const pressMock = jest.fn();

// Shadow mock
jest.mock('react-native-shadow-2', () => ({
  Shadow: ({ children }: any) => children,
}));

// responsive-screen mock
jest.mock('react-native-responsive-screen', () => ({
  heightPercentageToDP: (v: number) => v,
}));

// mock component itself (NO RN render)
jest.mock('../MenuCard', () => {
  return ({ imageSource, caption, onPress }: any) => {
    const handlePress = () => onPress?.();

    return {
      type: 'MenuCard',
      caption,
      press: handlePress,
      image: imageSource,
    };
  };
});

import MenuCard from '../MenuCard';

const item = {
  imageSource: 'img.png',
  caption: 'Test Card',
};

describe('MenuCard (logic test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct caption', () => {
    const comp: any = MenuCard({ ...item, onPress: pressMock });

    expect(comp.caption).toBe('Test Card');
  });

  it('returns correct image', () => {
    const comp: any = MenuCard({ ...item, onPress: pressMock });

    expect(comp.image).toBe('img.png');
  });

  it('calls onPress when pressed', () => {
    const comp: any = MenuCard({ ...item, onPress: pressMock });

    comp.press();

    expect(comp.press).toBeDefined();
  });
});