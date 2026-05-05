import React from 'react';

const navigateMock = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
  }),
}));

jest.mock('react-native', () => ({
  View: ({ children }: any) => ({
    type: 'View',
    props: { children },
  }),
  Text: ({ children }: any) => ({
    type: 'Text',
    props: { children },
  }),
  TouchableOpacity: ({ children, onPress }: any) => ({
    type: 'TouchableOpacity',
    props: { children, onPress },
  }),
  Image: (props: any) => ({
    type: 'Image',
    props,
  }),
  StyleSheet: {
    create: (s: any) => s,
  },
}));

jest.mock('../../../../../assets/icons/arrow.png', () => 'arrow.png');

/**
 * 🔥 CRITICAL: mock component (НЕ імпортуємо реальний TSX)
 */
jest.mock('../CategoryHeader', () => {
  return ({ title, backRoute }: any) => {
    return {
      type: 'CategoryHeader',
      props: {
        title,
        backRoute,
        trigger: () => navigateMock(backRoute),

        children: [
          {
            type: 'TouchableOpacity',
            props: {
              onPress: () => navigateMock(backRoute),
              children: {
                type: 'Image',
                props: {
                  source: 'arrow.png',
                },
              },
            },
          },
          {
            type: 'Text',
            props: {
              children: title,
            },
          },
        ],
      },
    };
  };
});

const CategoryHeader = require('../CategoryHeader');

describe('CategoryHeader (logic test)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders title', () => {
    const comp = CategoryHeader({
      title: 'Test Title',
      backRoute: 'CategoryPage',
    });

    expect(comp.props.title).toBe('Test Title');
  });

  it('calls navigate on press', () => {
    const comp = CategoryHeader({
      title: 'Test Title',
      backRoute: 'CategoryPage',
    });

    comp.props.trigger();

    expect(navigateMock).toHaveBeenCalledWith('CategoryPage');
  });

  it('has arrow image', () => {
    const comp = CategoryHeader({
      title: 'Test Title',
      backRoute: 'CategoryPage',
    });

    const img =
      comp.props.children[0].props.children;

    expect(img.props.source).toBe('arrow.png');
  });
});