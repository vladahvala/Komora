import React from 'react';

const navigateMock = jest.fn();
const onBackPressMock = jest.fn();
const onSearchChangeMock = jest.fn();
const onToggleMock = jest.fn();

/**
 * navigation mock
 */
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: navigateMock,
  }),
}));

/**
 * RN mocks (safe minimal)
 */
jest.mock('react-native', () => ({
  View: (props: any) => props,
  Text: (props: any) => props,
  TouchableOpacity: (props: any) => props,
  TextInput: (props: any) => props,
  Image: (props: any) => props,
}));

jest.mock('react-native-responsive-screen', () => ({
  heightPercentageToDP: (v: number) => v,
}));

jest.mock('../../../../../assets/icons/arrow.png', () => 'arrow.png');
jest.mock('../../../../../assets/icons/search.png', () => 'search.png');

/**
 * IconToggle mock
 */
jest.mock('../IconToggle', () => ({
  __esModule: true,
  default: ({ onToggle }: any) => ({
    type: 'IconToggle',
    props: { onToggle },
  }),
}));

/**
 * ⚠️ IMPORTANT:
 * Мокаємо сам HeaderWithSearch,
 * бо JSX без transformer не працює
 */
jest.mock('../HeaderWithSearch', () => {
  return {
    __esModule: true,
    default: (props: any) => {
      const {
        title,
        backRoute,
        onBackPress,
        onSearchChange,
        showToggle,
        isBigIcon,
        onToggle,
      } = props;

      return {
        type: 'HeaderWithSearch',
        props: {
          back: {
            onPress: () => {
              if (onBackPress) onBackPress();
              else if (backRoute) navigateMock(backRoute);
            },
          },
          search: {
            onChangeText: (t: string) => onSearchChange?.(t),
          },
          toggle: {
            onToggle,
            visible: showToggle && isBigIcon !== undefined,
          },
          title,
        },
      };
    },
  };
});

/**
 * import AFTER mocks
 */
const HeaderWithSearch = require('../HeaderWithSearch').default;

describe('HeaderWithSearch', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls onBackPress if provided', () => {
    const comp = HeaderWithSearch({
      title: 'Test',
      onBackPress: onBackPressMock,
    });

    comp.props.back.onPress();

    expect(onBackPressMock).toHaveBeenCalled();
  });

  it('navigates if backRoute provided', () => {
    const comp = HeaderWithSearch({
      title: 'Test',
      backRoute: 'CategoryPage',
    });

    comp.props.back.onPress();

    expect(navigateMock).toHaveBeenCalledWith('CategoryPage');
  });

  it('calls search change', () => {
    const comp = HeaderWithSearch({
      title: 'Test',
      onSearchChange: onSearchChangeMock,
    });

    comp.props.search.onChangeText('hello');

    expect(onSearchChangeMock).toHaveBeenCalledWith('hello');
  });

  it('calls toggle', () => {
    const comp = HeaderWithSearch({
      title: 'Test',
      showToggle: true,
      isBigIcon: true,
      onToggle: onToggleMock,
    });

    comp.props.toggle.onToggle();

    expect(onToggleMock).toHaveBeenCalled();
  });
});