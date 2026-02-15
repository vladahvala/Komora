import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AnimatedButton from '../../../animations/AnimatedButton';

interface DeleteIngredientButtonProps {
  onPress: () => void;
}

const DeleteIngredientButton: React.FC<DeleteIngredientButtonProps> = ({ onPress }) => {
  return (
    <AnimatedButton
      style={styles.deleteButton}
      onPress={onPress}
    >
      <Image
        source={require('../../../../assets/icons/remove_black.png')}
        style={styles.icon}
      />
    </AnimatedButton>
  );
};

export default DeleteIngredientButton;

const styles = StyleSheet.create({
  deleteButton: {
    height: hp(5),
    width: hp(5),
    backgroundColor: '#FF6B6B',
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: hp(1),
  },
  icon: {
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: 'contain',
  },
});
