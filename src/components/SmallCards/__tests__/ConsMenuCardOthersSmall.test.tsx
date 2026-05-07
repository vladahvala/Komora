import React from 'react';

// mocks
const navigateMock = jest.fn();
const deleteOtherMock = jest.fn();

// mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
  }),
}));

// mock context
jest.mock('../../../context/OthersContext', () => ({
  useOthers: () => ({
    deleteOther: deleteOtherMock,
    others: [
      {
        name: 'Apple',
        totalCount: 5,
      },
    ],
  }),
}));

describe('ConsMenuCardOthersSmall (logic only)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls navigation.navigate correctly', () => {
    const nav = require('@react-navigation/native').useNavigation();

    const item = { name: 'Apple' };

    nav.navigate('CardPageOther', { item });

    expect(navigateMock).toHaveBeenCalledWith('CardPageOther', {
      item,
    });
  });

  it('calls deleteOther correctly', () => {
    const ctx = require('../../../context/OthersContext').useOthers();

    ctx.deleteOther('Apple');

    expect(deleteOtherMock).toHaveBeenCalledWith('Apple');
  });
});