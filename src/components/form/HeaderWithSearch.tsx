import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';

interface HeaderWithSearchProps {
  title: string;
  backRoute?: keyof RootStackParamList;
  onBackPress?: () => void;
  searchText?: string;
  onSearchChange?: (text: string) => void;
  showToggle?: boolean;
  isBigIcon?: boolean;
  onToggle?: () => void;
}

const HeaderWithSearch: React.FC<HeaderWithSearchProps> = ({
  title,
  backRoute,
  onBackPress,
  searchText = '',
  onSearchChange,
  showToggle = false,
  isBigIcon,
  onToggle
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.headerContainer}>
      {/* Back arrow */}
      <TouchableOpacity
        onPress={() => {
          if (onBackPress) onBackPress();
          else if (backRoute) navigation.navigate(backRoute);
        }}
        style={styles.arrowWrapper}
        activeOpacity={1}
      >
        <View style={styles.arrowTouchArea}>
          <Image
            source={require('../../../assets/icons/arrow.png')}
            style={styles.arrowIcon}
          />
        </View>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.menuTitle}>{title}</Text>

      {/* Search + Toggle */}
      <View style={styles.searchRow}>
        {onSearchChange && (
          <View style={styles.searchContainer}>
            <Image
              source={require('../../../assets/icons/search.png')}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder={`Шукати ${title.toLowerCase()}...`}
              style={styles.searchInput}
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={onSearchChange}
              onPressIn={(e) => e.stopPropagation()}
            />
          </View>
        )}

        {showToggle && isBigIcon !== undefined && onToggle && (
          <TouchableOpacity onPress={onToggle} style={styles.bigIconContainer}>
            <Image
              source={
                isBigIcon
                  ? require('../../../assets/icons/big_icons.png')
                  : require('../../../assets/icons/small_icons.png')
              }
              style={styles.bigIconImage}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default HeaderWithSearch;

const styles = StyleSheet.create({
  headerContainer: { 
    paddingTop: hp(5), 
    marginBottom: hp(2), 
    paddingHorizontal: hp(4), 
  },
  arrowWrapper: {
    alignSelf: 'flex-start',
    marginLeft: -hp(1),
  },
  arrowTouchArea: {
    padding: hp(1.2),          
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: { 
    width: hp(3.2), 
    height: hp(3),
    resizeMode: 'contain',
  },
  menuTitle: { 
    fontSize: hp(3.5), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'center', 
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2.3),
    marginBottom: hp(0.7),
  },
  searchContainer: {
    flex: 1,
    marginLeft: -hp(1), 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderColor: '#00B4BF',
    borderWidth: hp(0.15),
    borderRadius: hp(1.5),
    paddingHorizontal: hp(1.5),
    height: hp(6),
  },
  searchIcon: {
    width: hp(2.2),
    height: hp(2.2),
    marginRight: hp(1),
  },
  searchInput: {
    flex: 1,
    fontSize: hp(2.2),
    color: '#000',
  },
  bigIconContainer: {
    width: hp(6),
    height: hp(6),
    marginLeft: hp(2),         
    backgroundColor: '#00B4BF66',
    borderRadius: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigIconImage: {
    width: hp(3),           
    height: hp(3),
    resizeMode: 'contain',
  },
});
