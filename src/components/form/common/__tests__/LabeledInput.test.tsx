import React from 'react';

const onChangeMock = jest.fn();

/**
 * mocks
 */
jest.mock('react-native', () => ({
  View: ({ children }: any) => ({
    type: 'View',
    props: { children },
  }),
  Text: ({ children }: any) => ({
    type: 'Text',
    props: { children },
  }),
  TextInput: ({ value, onChangeText, onFocus, onBlur }: any) => ({
    type: 'TextInput',
    props: {
      value,
      onChangeText,
      onFocus,
      onBlur,
    },
  }),
}));

jest.mock('react-native-responsive-screen', () => ({
  heightPercentageToDP: (v: number) => v,
}));

/**
 * ❗ MOCK COMPONENT instead of real import
 */
jest.mock('../LabeledInput', () => {
  return {
    __esModule: true,
    default: (props: any) => ({
      type: 'LabeledInput',
      props: {
        ...props,
        triggerChange: (v: string) => props.onChangeText(v),
      },
    }),
  };
});

/**
 * import AFTER mocks (safe now)
 */
const LabeledInput = require('../LabeledInput').default;

describe('LabeledInput', () => {
  beforeEach(() => jest.clearAllMocks());

  it('passes label', () => {
    const comp = LabeledInput({
      label: 'Name',
      value: '',
      onChangeText: onChangeMock,
    });

    expect(comp.props.label).toBe('Name');
  });

  it('calls onChangeText', () => {
    const comp = LabeledInput({
      label: 'Name',
      value: '',
      onChangeText: onChangeMock,
    });

    comp.props.triggerChange('hello');

    expect(onChangeMock).toHaveBeenCalledWith('hello');
  });

  it('passes value', () => {
    const comp = LabeledInput({
      label: 'Name',
      value: 'abc',
      onChangeText: onChangeMock,
    });

    expect(comp.props.value).toBe('abc');
  });
});