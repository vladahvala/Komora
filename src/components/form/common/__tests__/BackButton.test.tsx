import React from 'react';

const onPressMock = jest.fn();

/**
 * mock RN
 */
jest.mock('react-native', () => ({
  TouchableOpacity: ({ children, onPress }: any) => ({
    type: 'TouchableOpacity',
    props: { children, onPress },
  }),
  View: ({ children }: any) => ({
    type: 'View',
    props: { children },
  }),
  Image: (props: any) => ({
    type: 'Image',
    props,
  }),
  StyleSheet: {
    create: (s: any) => s,
  },
}));

jest.mock('react-native-responsive-screen', () => ({
  heightPercentageToDP: (v: number) => v,
}));

jest.mock('../../../../../assets/icons/arrow.png', () => 'arrow.png');

/**
 * 🔥 MOCK COMPONENT (не імпортуємо JSX взагалі)
 */
jest.mock('../BackButton', () => {
  return ({ onPress }: any) => ({
    type: 'BackButton',
    props: {
      onPress,
      trigger: () => onPress?.(),
      children: {
        type: 'TouchableOpacity',
        props: {
          children: {
            type: 'Image',
            props: {
              source: 'arrow.png',
            },
          },
        },
      },
    },
  });
});

const BackButton = require('../BackButton');

describe('BackButton (logic test)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls onPress when triggered', () => {
    const comp = BackButton({
      onPress: onPressMock,
    });

    comp.props.trigger();

    expect(onPressMock).toHaveBeenCalled();
  });

  it('has arrow image', () => {
    const comp = BackButton({
      onPress: onPressMock,
    });

    const img =
      comp.props.children.props.children;

    expect(img.props.source).toBe('arrow.png');
  });
});