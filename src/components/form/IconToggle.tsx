import React from 'react';
import { View, Pressable, Image, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface IconToggleProps {
  isBigIcon: boolean;
  onToggle: () => void;
}

const IconToggle: React.FC<IconToggleProps> = ({ isBigIcon, onToggle }) => (
  <View style={styles.container}>
    <Pressable onPress={onToggle} style={styles.toggleButton}>
      <Image
        source={
          isBigIcon
            ? require('../../../assets/icons/big_icons.png')
            : require('../../../assets/icons/small_icons.png')
        }
        style={styles.image}
      />
    </Pressable>
  </View>
);

export default IconToggle;

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: hp(2), marginBottom: hp(2) },
  toggleButton: {
    width: hp(6),
    height: hp(6),
    backgroundColor: '#00B4BF66',
    borderRadius: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { width: hp(3), height: hp(3), resizeMode: 'contain' },
});
