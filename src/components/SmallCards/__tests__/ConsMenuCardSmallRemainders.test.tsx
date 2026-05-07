import React from 'react';

const navigateMock = jest.fn();
const deleteMock = jest.fn();

// mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
  }),
}));

// mock context
jest.mock('../../../context/ConservationContext', () => ({
  useConservation: () => ({
    deleteConservation: deleteMock,
  }),
}));

describe('ConsMenuCardSmallRemainders (logic only)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to CardPage', () => {
    const nav = require('@react-navigation/native').useNavigation();

    const item = {
      name: 'Apple',
      imageUri: '',
      history: {
        2020: {
          jarCounts: { a: 1, b: 2 },
          period: 2,
        },
      },
    };

    nav.navigate('CardPage', { item });

    expect(navigateMock).toHaveBeenCalledWith('CardPage', {
      item,
    });
  });

  it('calls deleteConservation', () => {
    const ctx = require('../../../context/ConservationContext').useConservation();

    ctx.deleteConservation('Apple');

    expect(deleteMock).toHaveBeenCalledWith('Apple');
  });
});