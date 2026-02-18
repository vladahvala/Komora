import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImagePickerBlock from '../images/ImagePickerBlock';
import BackButton from './BackButton';

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
    <>
      <BackButton onPress={onBack} />

      <Text style={styles.title}>{title}</Text>

      <ImagePickerBlock
        imageUri={imageUri}
        setImageUri={setImageUri}
      />
    </>
  );
};

export default FormHeaderWithImage;

const styles = StyleSheet.create({
  title: {
    fontSize: hp(3.5),
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
});
