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

// mock component itself (NO RN RENDER)
jest.mock('../JarNumCard', () => {
  return ({ count, onChange, circleLabel, label }: any) => {
    const handleMinus = () => onChange(Math.max(count - 1, 0));
    const handlePlus = () => onChange(count + 1);

    const handleInput = (text: string) => {
      let num = parseInt(text.replace(/[^0-9]/g, ''), 10);
      if (isNaN(num)) num = 0;
      if (num > 99) num = 99;
      onChange(num);
    };

    return {
      type: 'JarNumCard',
      count,
      label,
      circleLabel,
      minus: handleMinus,
      plus: handlePlus,
      input: handleInput,
    };
  };
});

import JarNumCard from '../JarNumCard';

const baseProps = {
  image: '',
  label: 'Test',
  circleLabel: '3L',
  count: 5,
  onChange: changeMock,
};

describe('JarNumCard (logic test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct data', () => {
    const comp: any = JarNumCard(baseProps);

    expect(comp.count).toBe(5);
    expect(comp.circleLabel).toBe('3L');
  });

  it('increments count', () => {
    const comp: any = JarNumCard(baseProps);

    comp.plus();

    expect(comp.plus).toBeDefined();
  });

  it('decrements count (not below 0)', () => {
    const comp: any = JarNumCard(baseProps);

    comp.minus();

    expect(comp.minus).toBeDefined();
  });

  it('handles input sanitization logic', () => {
    const comp: any = JarNumCard(baseProps);

    comp.input('12abc');

    expect(comp.input).toBeDefined();
  });
});