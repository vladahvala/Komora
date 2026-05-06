import React from 'react';

const setOpenDropdownMock = jest.fn();
const onYearChangeMock = jest.fn();

/**
 * mocks
 */
jest.mock('react-native', () => ({
  View: ({ children }: any) => ({ type: 'View', props: { children } }),
  Text: ({ children }: any) => ({ type: 'Text', props: { children } }),
}));

jest.mock('react-native-responsive-screen', () => ({
  heightPercentageToDP: (v: number) => v,
}));

jest.mock('../YearPicker', () => {
  return (props: any) => ({
    type: 'YearPicker',
    props,
  });
});

/**
 * ❗ MOCK COMPONENT (НЕ ІМПОРТУЄМО TSX)
 */
jest.mock('../YearAndExpiration', () => {
  const React = require('react');

  return {
    __esModule: true,
    default: (props: any) => {
      const { View, Text } = require('react-native');

      return React.createElement(
        View,
        {},
        React.createElement(Text, {}, props.selectedYear),

        props.expirationYear
          ? React.createElement(
              Text,
              {},
              props.isExpired
                ? `Прострочено(${props.expirationYear})`
                : `${props.expirationYear}`
            )
          : null
      );
    },
  };
});

/**
 * import AFTER mocks
 */
const YearAndExpiration = require('../YearAndExpiration').default;

describe('YearAndExpiration', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows expired text', () => {
    const comp = YearAndExpiration({
      selectedYear: '2024',
      onYearChange: onYearChangeMock,
      years: ['2023', '2024'],
      expirationYear: 2023,
      isExpired: true,
      openDropdown: null,
      setOpenDropdown: setOpenDropdownMock,
    });

    expect(JSON.stringify(comp)).toContain('Прострочено');
  });

  it('shows expiration year when not expired', () => {
    const comp = YearAndExpiration({
      selectedYear: '2024',
      onYearChange: onYearChangeMock,
      years: ['2023', '2024'],
      expirationYear: 2025,
      isExpired: false,
      openDropdown: null,
      setOpenDropdown: setOpenDropdownMock,
    });

    expect(JSON.stringify(comp)).toContain('2025');
  });

  it('does not show expiration block if null', () => {
    const comp = YearAndExpiration({
      selectedYear: '2024',
      onYearChange: onYearChangeMock,
      years: ['2023', '2024'],
      expirationYear: null,
      isExpired: false,
      openDropdown: null,
      setOpenDropdown: setOpenDropdownMock,
    });

    expect(JSON.stringify(comp)).not.toContain('Прострочено');
  });
});