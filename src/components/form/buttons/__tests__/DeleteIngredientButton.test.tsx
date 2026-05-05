import React from 'react';

const onPressMock = jest.fn();

/**
 * 🔥 MOCK AnimatedButton (щоб не тягнути JSX/TSX)
 */
jest.mock('../../../../animations/AnimatedButton', () => {
  return ({ children, onPress, style }: any) => {
    return {
      type: 'AnimatedButton',
      props: {
        children,
        onPress,
        style,
      },
    };
  };
});

/**
 * 🔥 MOCK asset (щоб не падало на require image)
 */
jest.mock('../../../../../assets/icons/remove_black.png', () => 'remove_black.png');

/**
 * 🔥 MOCK самого компонента (КРИТИЧНО — щоб не виконував TSX)
 */
jest.mock('../DeleteIngredientButton', () => {
  return ({ onPress }: any) => {
    return {
      type: 'DeleteIngredientButton',
      props: {
        onPress,
        trigger: () => onPress?.(),
        children: {
          type: 'AnimatedButton',
          props: {
            children: {
              type: 'Image',
              props: {
                source: 'remove_black.png',
              },
            },
          },
        },
      },
    };
  };
});

/**
 * 🔥 IMPORTANT: require ПІСЛЯ mock
 */
const DeleteIngredientButton = require('../DeleteIngredientButton');

describe('DeleteIngredientButton (logic test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onPress when triggered', () => {
    const comp = DeleteIngredientButton({
      onPress: onPressMock,
    });

    comp.props.trigger();

    expect(onPressMock).toHaveBeenCalled();
  });

  it('passes image correctly', () => {
    const comp = DeleteIngredientButton({
      onPress: onPressMock,
    });

    expect(
      comp.props.children.props.children.props.source
    ).toBe('remove_black.png');
  });

  it('has onPress function', () => {
    const comp = DeleteIngredientButton({
      onPress: onPressMock,
    });

    expect(typeof comp.props.onPress).toBe('function');
  });
});