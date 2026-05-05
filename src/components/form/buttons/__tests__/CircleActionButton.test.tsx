import React from 'react';

const onPressMock = jest.fn();

/**
 * 🔥 MOCK компонента (щоб НЕ було JSX / Animated / RN render)
 */
jest.mock('../CircleActionButton', () => {
  return ({ icon, onPress, style }: any) => {
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();

    return {
      type: 'CircleActionButton',
      props: {
        icon,
        style,
        onPress,
        onPressIn,
        onPressOut,
        image: {
          type: 'Image',
          props: {
            source: icon,
          },
        },
      },
    };
  };
});

const CircleActionButton = require('../CircleActionButton');

describe('CircleActionButton (logic test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes icon correctly', () => {
    const icon = { uri: 'test.png' };

    const comp = CircleActionButton({
      icon,
      onPress: onPressMock,
      style: { margin: 10 },
    });

    expect(comp.props.icon).toEqual(icon);
  });

  it('calls onPress', () => {
    const icon = { uri: 'test.png' };

    const comp = CircleActionButton({
      icon,
      onPress: onPressMock,
    });

    comp.props.onPress();
    expect(onPressMock).toHaveBeenCalled();
  });

  it('has Image with correct source', () => {
    const icon = { uri: 'test.png' };

    const comp = CircleActionButton({
      icon,
      onPress: onPressMock,
    });

    expect(comp.props.image.type).toBe('Image');
    expect(comp.props.image.props.source).toEqual(icon);
  });

  it('accepts style', () => {
    const icon = { uri: 'test.png' };
    const style = { top: 10 };

    const comp = CircleActionButton({
      icon,
      onPress: onPressMock,
      style,
    });

    expect(comp.props.style).toBe(style);
  });
});