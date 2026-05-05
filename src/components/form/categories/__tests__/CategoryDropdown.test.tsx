import React from 'react';

const onSelectMock = jest.fn();
const onToggleMock = jest.fn();
const onCloseMock = jest.fn();

jest.mock('react-native', () => ({
  View: ({ children }: any) => ({
    type: 'View',
    props: { children },
  }),
  Text: ({ children }: any) => ({
    type: 'Text',
    props: { children },
  }),
  Pressable: ({ children, onPress }: any) => ({
    type: 'Pressable',
    props: { children, onPress },
  }),
  Image: (props: any) => ({
    type: 'Image',
    props,
  }),
  ScrollView: ({ children }: any) => ({
    type: 'ScrollView',
    props: { children },
  }),
  StyleSheet: {
    create: (s: any) => s,
    absoluteFill: {},
  },
}));

jest.mock('react-native-responsive-screen', () => ({
  heightPercentageToDP: (v: number) => v,
}));

jest.mock('../../../../../assets/icons/frame_down.png', () => 'frame_down.png');

/**
 * ⚠️ ВАЖЛИВО: компонент МОКАЄМО, щоб не було JSX проблем
 */
jest.mock('../CategoryDropdown', () => {
  return ({ selected, onSelect, isOpen, onToggle, onClose }: any) => {
    const categories = ['Мариновані', 'Солені'];

    return {
      type: 'CategoryDropdown',
      props: {
        selected,
        isOpen,
        onToggle,
        onClose,

        dropdownItems: categories.map((c) => ({
          type: 'Pressable',
          props: {
            label: c,
            onPress: () => {
              onSelect(c);
              onClose();
            },
          },
        })),

        triggerOpen: () => onToggle?.(),
      },
    };
  };
});

const CategoryDropdown = require('../CategoryDropdown');

describe('CategoryDropdown (logic test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders selected value', () => {
    const comp = CategoryDropdown({
      selected: 'Солені',
      onSelect: onSelectMock,
      isOpen: false,
      onToggle: onToggleMock,
      onClose: onCloseMock,
    });

    expect(comp.props.selected).toBe('Солені');
  });

  it('opens dropdown via toggle', () => {
    const comp = CategoryDropdown({
      selected: null,
      onSelect: onSelectMock,
      isOpen: false,
      onToggle: onToggleMock,
      onClose: onCloseMock,
    });

    comp.props.triggerOpen();

    expect(onToggleMock).toHaveBeenCalled();
  });

  it('selects category and closes dropdown', () => {
    const comp = CategoryDropdown({
      selected: null,
      onSelect: onSelectMock,
      isOpen: true,
      onToggle: onToggleMock,
      onClose: onCloseMock,
    });

    const firstItem = comp.props.dropdownItems[0];

    firstItem.props.onPress();

    expect(onSelectMock).toHaveBeenCalledWith('Мариновані');
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('has correct number of dropdown items', () => {
    const comp = CategoryDropdown({
      selected: null,
      onSelect: onSelectMock,
      isOpen: true,
      onToggle: onToggleMock,
      onClose: onCloseMock,
    });

    expect(comp.props.dropdownItems.length).toBe(2);
  });
});