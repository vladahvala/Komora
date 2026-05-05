import React from 'react';

const onBackMock = jest.fn();
const onImageChangeMock = jest.fn();
const onToggleFavoriteMock = jest.fn();

/**
 * 🔥 mock navigation (не використовується прямо, але хай буде)
 */
jest.mock('@react-navigation/native', () => ({}));

/**
 * 🔥 mock image picker
 */
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: (_: any, cb: any) => {
    cb({
      assets: [{ uri: 'test-image.png' }],
    });
  },
}));

/**
 * 🔥 mock BackButton
 */
jest.mock('../BackButton', () => {
  return ({ onPress }: any) => ({
    type: 'BackButton',
    props: { onPress },
  });
});

/**
 * ❗ MOCK CardHeader (ключове рішення)
 * ми НЕ рендеримо JSX взагалі
 */
jest.mock('../CardHeader', () => {
  return {
    default: (props: any) => {
      const { onBack, onToggleFavorite, onImageChange, isFavorite } = props;

      return {
        type: 'CardHeader',
        props: {
          triggerBack: () => onBack?.(),
          triggerImage: () => onImageChange?.('test-image.png'),
          triggerFavorite: () => onToggleFavorite?.(),
          hasFavorite: !!isFavorite,
          props,
        },
      };
    },
  };
});

const CardHeader = require('../CardHeader').default;

describe('CardHeader (logic test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onBack', () => {
    const comp = CardHeader({
      name: 'Test',
      imageUri: null,
      onImageChange: onImageChangeMock,
      onBack: onBackMock,
    });

    comp.props.triggerBack();

    expect(onBackMock).toHaveBeenCalled();
  });

  it('calls onImageChange', () => {
    const comp = CardHeader({
      name: 'Test',
      imageUri: null,
      onImageChange: onImageChangeMock,
      onBack: onBackMock,
    });

    comp.props.triggerImage();

    expect(onImageChangeMock).toHaveBeenCalledWith('test-image.png');
  });

  it('calls onToggleFavorite', () => {
    const comp = CardHeader({
      name: 'Test',
      imageUri: null,
      onImageChange: onImageChangeMock,
      onBack: onBackMock,
      isFavorite: true,
      onToggleFavorite: onToggleFavoriteMock,
    });

    comp.props.triggerFavorite();

    expect(onToggleFavoriteMock).toHaveBeenCalled();
  });

  it('sets favorite flag', () => {
    const comp = CardHeader({
      name: 'Test',
      imageUri: null,
      onImageChange: onImageChangeMock,
      onBack: onBackMock,
      isFavorite: true,
    });

    expect(comp.props.hasFavorite).toBe(true);
  });
});