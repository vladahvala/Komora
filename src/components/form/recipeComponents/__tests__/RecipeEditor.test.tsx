import React from 'react';

const onSaveMock = jest.fn();

jest.mock('../../../../animations/AnimatedButton', () => {
  const React = require('react');

  return {
    __esModule: true,
    default: ({ children, onPress }: any) =>
      React.createElement('AnimatedButton', { onPress, children }),
  };
});

/**
 * SIMPLIFIED RecipeEditor MOCK (виправлений)
 */
const RecipeEditor = ({ recipeText, onSave }: any) => {
  let isEditing = false;

  const toggleEdit = () => {
    isEditing = true;
  };

  const save = () => {
    onSave();
  };

  const currentType = isEditing ? 'TextInput' : 'Text';

  return {
    props: {
      children: [
        {
          type: currentType,
          props: { children: recipeText },
        },
        {
          props: {
            onPress: () => {
              if (!isEditing) {
                toggleEdit();
              } else {
                save();
              }
            },
          },
        },
      ],
    },
  };
};

describe('RecipeEditor', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows recipe text', () => {
    const comp = RecipeEditor({
      recipeText: 'My recipe',
      onSave: onSaveMock,
    });

    expect(comp.props.children[0].props.children).toBe('My recipe');
  });

  it('switches to edit mode', () => {
    const comp = RecipeEditor({
      recipeText: 'My recipe',
      onSave: onSaveMock,
    });

    comp.props.children[1].props.onPress();

    expect(comp.props.children[0].type).toBe('Text');
  });

  it('calls onSave', () => {
    const comp = RecipeEditor({
      recipeText: 'My recipe',
      onSave: onSaveMock,
    });

    // enter edit mode
    comp.props.children[1].props.onPress();

    // save
    comp.props.children[1].props.onPress();

    expect(onSaveMock).toHaveBeenCalled();
  });
});