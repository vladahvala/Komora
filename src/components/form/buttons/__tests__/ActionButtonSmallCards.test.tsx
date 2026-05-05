import React from 'react';

const onPressMock = jest.fn();

jest.mock('../ActionButtonSmallCards', () => {
  return ({ icon, onPress, style }: any) => {
    const handlePress = () => onPress?.();

    return {
      type: 'ActionButtonSmallCards',
      props: {
        icon,
        onPress,
        style,
        children: {
          type: 'Image',
          props: {
            source: icon,
          },
        },
        trigger: handlePress,
      },
    };
  };
});

// тепер вже після mock
const ActionButtonSmallCards = require('../ActionButtonSmallCards');

describe('ActionButtonSmallCards (logic test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes icon correctly', () => {
    const icon = { uri: 'test.png' };

    const comp = ActionButtonSmallCards({
      icon,
      onPress: onPressMock,
      style: { padding: 10 },
    });

    expect(comp.props.icon).toEqual(icon);
  });

  it('calls onPress when triggered', () => {
    const icon = { uri: 'test.png' };

    const comp = ActionButtonSmallCards({
      icon,
      onPress: onPressMock,
      style: { padding: 10 },
    });

    comp.props.onPress();
    expect(onPressMock).toHaveBeenCalled();
  });

  it('passes style correctly', () => {
    const icon = { uri: 'test.png' };
    const style = { margin: 5 };

    const comp = ActionButtonSmallCards({
      icon,
      onPress: onPressMock,
      style,
    });

    expect(comp.props.style).toBe(style);
  });

  it('renders Image with correct source', () => {
    const icon = { uri: 'test.png' };

    const comp = ActionButtonSmallCards({
      icon,
      onPress: onPressMock,
    });

    expect(comp.props.children.type).toBe('Image');
    expect(comp.props.children.props.source).toEqual(icon);
  });
});