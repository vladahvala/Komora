import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Props {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
}

const ImagePickerBlock: React.FC<Props> = ({ imageUri, setImageUri }) => {
  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.7 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setImageUri(response.assets[0].uri ?? null);
        }
      }
    );
  };

  return (
    <View style={{ marginTop: hp(2) }}>
      <Text style={styles.label}>Фото консервації</Text>
      <Pressable
        style={[
          styles.imagePicker,
          { borderColor: imageUri ? '#00B4BF' : '#AEAEAE' },
        ]}
        onPress={pickImage}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.selectedImage} />
        ) : (
          <Text style={styles.imagePickerText}>Оберіть фото</Text>
        )}
      </Pressable>
    </View>
  );
};

export default ImagePickerBlock;

const styles = StyleSheet.create({
    label: {
      fontSize: hp(2.2),
      fontWeight: '500',
      color: '#333',
      marginBottom: hp(0.5),
    },
    imagePicker: {
      height: hp(15),
      borderWidth: hp(0.25),
      borderRadius: hp(1.5),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F1F1F1',
    },
    imagePickerText: {
      fontSize: hp(2.2),
      color: '#666',
    },
    selectedImage: {
      width: '100%',
      height: '100%',
      borderRadius: hp(1.5),
      resizeMode: 'cover',
    },
  });
  