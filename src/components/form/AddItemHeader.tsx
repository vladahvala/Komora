import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImagePickerBlock from '../form/images/ImagePickerBlock';

type Props = {
  title: string;
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
  onBack: () => void;
};

const FormHeaderWithImage: React.FC<Props> = ({
  title,
  imageUri,
  setImageUri,
  onBack,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.arrowWrapper}>
        <View style={styles.arrowTouchArea}>
          <Image
            source={require('../../../assets/icons/arrow.png')}
            style={styles.arrowIcon}
          />
        </View>
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <ImagePickerBlock
        imageUri={imageUri}
        setImageUri={setImageUri}
      />
    </View>
  );
};

export default FormHeaderWithImage;

const styles = StyleSheet.create({
  arrowWrapper: {
    alignSelf: 'flex-start',
    marginBottom: hp(1),
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
  title: {
    fontSize: hp(3.5),
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
});
