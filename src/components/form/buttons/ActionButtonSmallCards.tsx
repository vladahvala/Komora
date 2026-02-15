import { Image, StyleSheet, Pressable, } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

type ActionButtonSmallCardsProps = {
    icon: any;
    onPress: () => void;
    style?: any;
  };
  
  const ActionButtonSmallCards = ({ icon, onPress, style }: ActionButtonSmallCardsProps) => (
    <Pressable onPress={onPress} style={style}>
      <Image source={icon} style={{ width: hp(2.2), height: hp(2.2), resizeMode: 'contain' }} />
    </Pressable>
  );
  
  export default ActionButtonSmallCards;

const styles = StyleSheet.create({
});