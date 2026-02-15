import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

type ButtonProps = {
  element: React.ReactNode;
  style?: object; // просто передати позицію та додаткові стилі
};

type CardImageWithButtonsProps = {
  imageUri: string | null;
  buttons?: ButtonProps[];        // масив кнопок зверху
  containerStyle?: object;
  imageStyle?: object;
};

const CardImageWithButtons = ({
  imageUri,
  buttons,
  containerStyle,
  imageStyle,
}: CardImageWithButtonsProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={
          imageUri
            ? { uri: imageUri }
            : require('../../../../assets/images/default_conservation.png')
        }
        style={[styles.image, imageStyle]}
      />
      {buttons?.map((btn, idx) => (
        <View key={idx} style={[styles.buttonWrapper, btn.style]}>
          {btn.element}
        </View>
      ))}
    </View>
  );
};

export default CardImageWithButtons;

const styles = StyleSheet.create({
  container: {
    marginLeft: hp(2),
    marginRight: hp(2),
    marginTop: hp(0.3),
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    transform: [{ scaleY: 0.85 }],
    borderRadius: hp(1.5),
  },
  buttonWrapper: {
    position: 'absolute',
  },
});
