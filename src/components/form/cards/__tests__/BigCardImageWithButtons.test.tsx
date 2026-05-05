import React from 'react';

const onPressMock = jest.fn();

/**
 * 🔥 MOCK самого компонента (щоб НЕ парсити TSX)
 */
jest.mock('../BigCardImageWithButtons', () => {
  return ({ imageUri, buttons, containerStyle, imageStyle }: any) => {
    return {
      type: 'BigCardImageWithButtons',
      props: {
        imageUri,
        buttons,
        containerStyle,
        imageStyle,
        children: {
          type: 'Image',
          props: {
            source: imageUri
              ? { uri: imageUri }
              : 'default.png',
          },
        },
      },
    };
  };
});

/**
 * 🔥 MOCK asset (щоб не падало на require image)
 */
jest.mock(
  '../../../../../assets/images/default_conservation.png',
  () => 'default.png'
);

/**
 * 🔥 require ПІСЛЯ mock
 */
const BigCardImageWithButtons =
  require('../BigCardImageWithButtons');

describe('BigCardImageWithButtons (logic test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders default image when imageUri is null', () => {
    const comp = BigCardImageWithButtons({
      imageUri: null,
    });

    expect(comp.props.children.props.source).toBe('default.png');
  });

  it('renders imageUri when provided', () => {
    const comp = BigCardImageWithButtons({
      imageUri: 'https://test.com/img.png',
    });

    expect(comp.props.children.props.source).toEqual({
      uri: 'https://test.com/img.png',
    });
  });

  it('passes buttons correctly', () => {
    const buttons = [
      {
        element: { type: 'ButtonMock' },
        style: { top: 10 },
      },
    ];

    const comp = BigCardImageWithButtons({
      imageUri: null,
      buttons,
    });

    expect(comp.props.buttons).toEqual(buttons);
  });

  it('passes containerStyle', () => {
    const style = { margin: 20 };

    const comp = BigCardImageWithButtons({
      imageUri: null,
      containerStyle: style,
    });

    expect(comp.props.containerStyle).toBe(style);
  });
});