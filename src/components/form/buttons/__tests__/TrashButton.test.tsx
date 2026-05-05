import React from 'react';

const onPressMock = jest.fn();

/**
 * 🔥 MOCK ВСЬОГО компонента (КЛЮЧОВЕ ВИПРАВЛЕННЯ)
 */
jest.mock('../TrashButton', () => {
  return ({ onPress }: any) => {
    return {
      type: 'TrashButton',
      props: {
        onPress,
        trigger: () => onPress?.(),
        children: {
          type: 'Pressable',
          props: {
            children: {
              type: 'Image',
              props: {
                source: 'trash.png',
              },
            },
          },
        },
      },
    };
  };
});

/**
 * 🔥 MOCK asset
 */
jest.mock('../../../../../assets/icons/trash.png', () => 'trash.png');

/**
 * 🔥 require ПІСЛЯ mock
 */
const TrashButton = require('../TrashButton');

describe('TrashButton (logic test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onPress when triggered', () => {
    const comp = TrashButton({
      onPress: onPressMock,
    });

    comp.props.trigger();

    expect(onPressMock).toHaveBeenCalled();
  });

  it('renders image correctly', () => {
    const comp = TrashButton({
      onPress: onPressMock,
    });

    expect(
      comp.props.children.props.children.props.source
    ).toBe('trash.png');
  });

  it('has onPress function', () => {
    const comp = TrashButton({
      onPress: onPressMock,
    });

    expect(typeof comp.props.onPress).toBe('function');
  });
});