import React from 'react';
import { View, Text, TouchableOpacity, Image, Pressable, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface CardHeaderProps {
  name: string;
  imageUri: string | null;
  onImageChange: (uri: string) => void;
  onBack: () => void;
  isFavorite?: boolean;             
  onToggleFavorite?: () => void;    
}

const CardHeader: React.FC<CardHeaderProps> = ({ name, imageUri, onImageChange, onBack, isFavorite, onToggleFavorite }) => {
  return (
    <View style={styles.headerContainer}>
      {/* ARROW BACK */}
      <TouchableOpacity onPress={onBack} style={styles.arrowWrapper} activeOpacity={1}>
        <View style={styles.arrowTouchArea}>
          <Image
            source={require('../../../assets/icons/arrow.png')}
            style={styles.arrowIcon}
          />
        </View>
      </TouchableOpacity>

      {/* TITLE + IMAGE */}
      <View style={styles.titleRow}>
        <Text style={styles.menuTitle}>{name}</Text>

        <View style={styles.titleImageWrapper}>
          <Image
            source={imageUri ? { uri: imageUri } : require('../../../assets/images/default_conservation.png')}
            style={styles.titleImage}
          />

          <Pressable
            style={styles.imageOverlay}
            onPress={() => {
              launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
                if (response.assets && response.assets.length > 0) {
                  onImageChange(response.assets[0].uri);
                }
              });
            }}
          >
            <Text style={styles.imageOverlayText}>Змінити</Text>
          </Pressable>
        </View>
      </View>

      {isFavorite !== undefined && onToggleFavorite && (
        <Pressable
          onPress={onToggleFavorite}
          style={{ position: 'absolute', right: hp(1), top: hp(1) }}
        >
          <Image
            source={
              isFavorite
                ? require('../../../assets/icons/like_blue.png')
                : require('../../../assets/icons/like.png')
            }
            style={{ width: hp(3), height: hp(3), resizeMode: 'contain' }}
          />
        </Pressable>
      )}

    </View>
  );
};

export default CardHeader;

// можна винести стилі сюди або імпортувати з CardPage
const styles = StyleSheet.create({
  headerContainer: { 
    paddingHorizontal: hp(1), 
  },
  arrowWrapper: {
    alignSelf: 'flex-start',
    marginBottom: hp(1),
    marginLeft: -hp(1),
  },
  arrowTouchArea: {
    padding: hp(1.2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: { width: hp(3.2), height: hp(3), resizeMode: 'contain' },
  titleRow: { flexDirection: 'column', alignItems: 'center' },
  menuTitle: { fontSize: hp(2.9), fontWeight: '600', color: 'black', textAlign: 'center', marginBottom: hp(2) },
  titleImageWrapper: { width: hp(22), height: hp(17), borderRadius: hp(2.5), overflow: 'hidden', marginBottom: hp(2) },
  titleImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageOverlay: { position: 'absolute', bottom: 0, width: '100%', height: '25%', backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  imageOverlayText: { color: 'white', fontWeight: '600', fontSize: hp(2.2) },
});
