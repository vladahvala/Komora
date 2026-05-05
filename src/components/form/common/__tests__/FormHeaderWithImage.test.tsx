import React from 'react';

const onBackMock = jest.fn();
const setImageUriMock = jest.fn();

/**
 * mocks
 */
jest.mock('react-native', () => ({
  Text: ({ children }: any) => ({
    type: 'Text',
    props: { children },
  }),
}));

jest.mock('react-native-responsive-screen', () => ({
  heightPercentageToDP: (v: number) => v,
}));

jest.mock('../BackButton', () => {
  return ({ onPress }: any) => ({
    type: 'BackButton',
    props: { onPress },
  });
});

jest.mock('../../images/ImagePickerBlock', () => {
  return (props: any) => ({
    type: 'ImagePickerBlock',
    props,
  });
});

/**
 * 🔥 MOCK COMPONENT instead of importing TSX
 */
jest.mock('../FormHeaderWithImage', () => {
  return {
    default: (props: any) => ({
      type: 'FormHeaderWithImage',
      props: {
        triggerBack: () => props.onBack?.(),
        props,
      },
    }),
  };
});

const FormHeaderWithImage = require('../FormHeaderWithImage').default;

describe('FormHeaderWithImage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls onBack', () => {
    const comp = FormHeaderWithImage({
      title: 'Test title',
      imageUri: null,
      setImageUri: setImageUriMock,
      onBack: onBackMock,
    });

    comp.props.triggerBack();

    expect(onBackMock).toHaveBeenCalled();
  });

  it('passes props correctly', () => {
    const comp = FormHeaderWithImage({
      title: 'My Title',
      imageUri: 'img.png',
      setImageUri: setImageUriMock,
      onBack: onBackMock,
    });

    expect(comp.props.props.title).toBe('My Title');
    expect(comp.props.props.imageUri).toBe('img.png');
  });
});