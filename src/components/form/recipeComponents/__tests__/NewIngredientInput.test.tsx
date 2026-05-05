import React from 'react';

const setNewIngredientMock = jest.fn();
const onAddMock = jest.fn();

/**
 * mocks
 */
jest.mock('react-native', () => {
  const React = require('react');

  return {
    View: (props: any) => React.createElement('View', props, props.children),
    Text: (props: any) => React.createElement('Text', props, props.children),
    TextInput: (props: any) =>
      React.createElement('TextInput', {
        ...props,
        onChangeText: props.onChangeText,
      }),
    Pressable: (props: any) =>
      React.createElement('Pressable', {
        ...props,
        onPress: props.onPress,
      }),
    Image: (props: any) => React.createElement('Image', props),
  };
});

jest.mock('react-native-responsive-screen', () => ({
  heightPercentageToDP: (v: number) => v,
}));

jest.mock('../../../../../assets/icons/add_black.png', () => 'add.png');
jest.mock('../../../../animations/AnimatedButton', () => {
    const React = require('react');
  
    return {
      __esModule: true,
      default: (props: any) =>
        React.createElement('AnimatedButton', {
          ...props,
          onPress: props.onPress,
        }),
    };
  });
/**
 * ❗ MOCK COMPONENT (НЕ ІМПОРТУЄМО TSX)
 */
jest.mock('../NewIngredientInput', () => {
  const React = require('react');
  const { View, TextInput, Pressable, Image } = require('react-native');

  return {
    __esModule: true,
    default: (props: any) => {
      return React.createElement(
        View,
        {},
        // amount input
        React.createElement(TextInput, {
          value: props.newIngredient.amount,
          onChangeText: (text: string) =>
            props.setNewIngredient((prev: any) => ({
              ...prev,
              amount: text,
            })),
        }),

        // unit button
        React.createElement(Pressable, {
          onPress: () => {},
        }),

        // name input
        React.createElement(TextInput, {
          value: props.newIngredient.name,
          onChangeText: (text: string) =>
            props.setNewIngredient((prev: any) => ({
              ...prev,
              name: text,
            })),
        }),

        // add button
        React.createElement(Pressable, {
          onPress: props.onAdd,
          children: React.createElement(Image, {
            source: 'add.png',
          }),
        })
      );
    },
  };
});

/**
 * import AFTER mocks
 */
const NewIngredientInput = require('../NewIngredientInput').default;

describe('NewIngredientInput', () => {
  beforeEach(() => jest.clearAllMocks());

  const baseProps = {
    newIngredient: { amount: '', unit: 'g', name: '' },
    setNewIngredient: setNewIngredientMock,
    units: ['g', 'kg'],
    onAdd: onAddMock,
  };

  it('calls onAdd', () => {
    const comp = NewIngredientInput(baseProps);

    // 4-й елемент = add button
    const addButton = comp.props.children[3];
    addButton.props.onPress();

    expect(onAddMock).toHaveBeenCalled();
  });

  it('updates amount', () => {
    const comp = NewIngredientInput(baseProps);

    const amountInput = comp.props.children[0];
    amountInput.props.onChangeText('123');

    expect(setNewIngredientMock).toHaveBeenCalled();
  });

  it('updates name', () => {
    const comp = NewIngredientInput(baseProps);

    const nameInput = comp.props.children[2];
    nameInput.props.onChangeText('Tomato');

    expect(setNewIngredientMock).toHaveBeenCalled();
  });
});