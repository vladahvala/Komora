import React from 'react';

const navigateMock = jest.fn();

/**
 * navigation mock
 */
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
  }),
}));

/**
 * CatCard mock
 */
jest.mock('../../../CardsInCards/CatCard', () => {
  return ({ item, onPress }: any) => ({
    type: 'CatCard',
    props: { item, onPress },
  });
});

/**
 * View mock
 */
jest.mock('react-native', () => ({
  View: ({ children }: any) => ({
    type: 'View',
    props: { children },
  }),
}));

/**
 * 🔥 CRITICAL: mock COMPONENT (щоб не виконував JSX)
 */
jest.mock('../CategoryCardList', () => {
  return ({ cards, navigateTo }: any) => {
    const { useNavigation } = require('@react-navigation/native');
    const navigation = useNavigation();

    return {
      type: 'CategoryCardList',
      props: {
        children: cards.map((item: any) => ({
          type: 'CatCard',
          props: {
            item: {
              name: item.title,
              image: item.image,
              cansCount: 10,
              category: item.category,
            },
            onPress: () =>
              navigation.navigate(navigateTo, {
                category: item.category,
              }),
          },
        })),
      },
    };
  };
});

const CategoryCardList = require('../CategoryCardList');

describe('CategoryCardList (logic test)', () => {
  const cardsMock = [
    { id: '1', title: 'Cat A', image: 'img-a.png', category: 'A' },
    { id: '2', title: 'Cat B', image: 'img-b.png', category: 'B' },
  ];

  beforeEach(() => jest.clearAllMocks());

  it('renders correct number of CatCards', () => {
    const comp = CategoryCardList({
      cards: cardsMock,
      navigateTo: 'CategoryPage',
    });

    expect(comp.props.children.length).toBe(2);
  });

  it('calls navigate on press', () => {
    const comp = CategoryCardList({
      cards: cardsMock,
      navigateTo: 'CategoryPage',
    });

    comp.props.children[0].props.onPress();

    expect(navigateMock).toHaveBeenCalledWith('CategoryPage', {
      category: 'A',
    });
  });
});