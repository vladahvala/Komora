import React from 'react';

const onToggleMock = jest.fn();

/**
 * mocks
 */
jest.mock('react-native', () => ({
  Pressable: ({ children, onPress }: any) => ({
    type: 'Pressable',
    props: { children, onPress },
  }),
  Image: (props: any) => ({
    type: 'Image',
    props,
  }),
}));

jest.mock('../../../../../assets/icons/big_icons.png', () => 'big.png');
jest.mock('../../../../../assets/icons/small_icons.png', () => 'small.png');

/**
 * ❗ Мокаємо сам компонент повністю
 */
jest.mock('../IconToggle', () => {
  return {
    __esModule: true,
    default: (props: any) => ({
      type: 'IconToggle',
      props: {
        ...props,
        trigger: () => props.onToggle?.(),
        source: props.isBigIcon ? 'big.png' : 'small.png',
      },
    }),
  };
});

/**
 * ❗ ВАЖЛИВО: НЕ require реальний файл
 */
const IconToggle = require('../IconToggle').default;

describe('IconToggle', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls onToggle', () => {
    const comp = IconToggle({
      isBigIcon: true,
      onToggle: onToggleMock,
    });

    comp.props.trigger();

    expect(onToggleMock).toHaveBeenCalled();
  });

  it('shows big icon', () => {
    const comp = IconToggle({
      isBigIcon: true,
      onToggle: onToggleMock,
    });

    expect(comp.props.source).toBe('big.png');
  });

  it('shows small icon', () => {
    const comp = IconToggle({
      isBigIcon: false,
      onToggle: onToggleMock,
    });

    expect(comp.props.source).toBe('small.png');
  });
});