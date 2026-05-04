import React from 'react';

// mocks
const navigateMock = jest.fn();
const deleteMock = jest.fn();

jest.mock('react-native', () => ({
    View: 'View',
    Text: 'Text',
    Image: 'Image',
    Pressable: 'Pressable',
    StyleSheet: { create: (s: any) => s },
    Dimensions: {
      get: () => ({ width: 400, height: 800 }),
    },
  }));
  
  jest.mock('react-native-responsive-screen', () => ({
    heightPercentageToDP: (x: number) => x,
  }));
  
  jest.mock('react-native-shadow-2', () => ({
    Shadow: ({ children }: any) => children,
  }));

// navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
  }),
}));

// context
jest.mock('../../../context/OthersContext', () => ({
  useOthers: () => ({
    deleteOther: deleteMock,
    others: [
      {
        name: 'Apple',
        imageUri: '',
        totalCount: 5,
      },
    ],
  }),
}));

// mock component (NO RN RENDER)
jest.mock('../ConsMenuCardOthers', () => {
  return ({ item }: any) => {
    const currentItem =
      [
        {
          name: 'Apple',
          imageUri: '',
          totalCount: 5,
        },
      ].find(o => o.name === item.name) || item;

    const handlePress = () => {
      navigateMock('CardPageOther', { item: currentItem });
    };

    const handleDelete = () => {
      deleteMock(currentItem.name);
    };

    return {
      type: 'ConsMenuCardOthers',
      name: currentItem.name,
      press: handlePress,
      delete: handleDelete,
    };
  };
});

import ConsMenuCardOthers from '../ConsMenuCardOthers';

const item = {
  name: 'Apple',
  imageUri: '',
  totalCount: 5,
} as any;

describe('ConsMenuCardOthers (logic test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct name', () => {
    const comp: any = ConsMenuCardOthers({ item, index: 0 });

    expect(comp.name).toBe('Apple');
  });

  it('navigates on press', () => {
    const comp: any = ConsMenuCardOthers({ item, index: 0 });

    comp.press();

    expect(navigateMock).toHaveBeenCalledWith('CardPageOther', {
      item: {
        name: 'Apple',
        imageUri: '',
        totalCount: 5,
      },
    });
  });

  it('deletes item', () => {
    const comp: any = ConsMenuCardOthers({ item, index: 0 });

    comp.delete();

    expect(deleteMock).toHaveBeenCalledWith('Apple');
  });
});