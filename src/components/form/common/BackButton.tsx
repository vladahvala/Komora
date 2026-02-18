import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

type BackButtonProps = {
  onPress: () => void;
};

const BackButton: React.FC<BackButtonProps> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.arrowWrapper} activeOpacity={1}>
    <View style={styles.arrowTouchArea}>
      <Image
        source={require('../../../../assets/icons/arrow.png')}
        style={styles.arrowIcon}
      />
    </View>
  </TouchableOpacity>
);

export default BackButton;

const styles = StyleSheet.create({
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
});
