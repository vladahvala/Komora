import {  Image, Pressable, StyleSheet, } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

type TrashButtonProps = {
    onPress: () => void;
  };
  
  const TrashButton = ({ onPress }: TrashButtonProps) => (
    <Pressable style={styles.trashButton} onPress={onPress}>
      <Image
        source={require('../../../../assets/icons/trash.png')}
        style={styles.trashIcon}
      />
    </Pressable>
  );
  
  export default TrashButton;

const styles = StyleSheet.create({
    // delete card styles
  trashButton: {
    position: 'absolute',
    top: hp(2),
    left: hp(1),
    backgroundColor: '#FFFFFF',
    width: hp(3.5),
    height: hp(3.5),
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
  
    // shadow
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 3,
  },
  trashIcon: {
    width: hp(2.2),
    height: hp(2.2),
    resizeMode: 'contain',
  },
});