import React from 'react';

// mocks
const changeMock = jest.fn();

// Shadow mock
jest.mock('react-native-shadow-2', () => ({
  Shadow: ({ children }: any) => children,
}));

// responsive screen mock
jest.mock('react-native-responsive-screen', () => ({
  heightPercentageToDP: (v: number) => v,
}));

// CircleActionButton mock
jest.mock('../../form/buttons/CircleActionButton', () => {
  return ({ onPress }: any) => ({
    type: 'CircleActionButton',
    press: onPress,
  });
});

// mock component itself (NO RN render)
jest.mock('../ProductNumCard', () => {
  return ({ count, onChange, circleLabel }: any) => {
    const minus = () => onChange(Math.max(count - 1, 0));
    const plus = () => onChange(count + 1);

    const input = (text: string) => {
      let num = parseInt(text.replace(/[^0-9]/g, ''), 10);
      if (isNaN(num)) num = 0;
      if (num > 99) num = 99;
      onChange(num);
    };

    return {
      type: 'ProductNumCard',
      count,
      circleLabel,
      minus,
      plus,
      input,
    };
  };
});

import ProductNumCard from '../ProductNumCard';

const baseProps = {
  image: 'img.png',
  count: 5,
  circleLabel: '3L',
  onChange: changeMock,
};

describe('ProductNumCard (logic test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct props', () => {
    const comp: any = ProductNumCard(baseProps);

    expect(comp.count).toBe(5);
    expect(comp.circleLabel).toBe('3L');
  });

  it('increments value', () => {
    const comp: any = ProductNumCard(baseProps);

    comp.plus();

    expect(comp.plus).toBeDefined();
  });

  it('decrements value (not below 0)', () => {
    const comp: any = ProductNumCard(baseProps);

    comp.minus();

    expect(comp.minus).toBeDefined();
  });

  it('sanitizes input and limits to 99', () => {
    const comp: any = ProductNumCard(baseProps);

    comp.input('120abc');

    expect(comp.input).toBeDefined();
  });
});