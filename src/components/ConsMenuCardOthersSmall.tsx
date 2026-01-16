import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Shadow } from 'react-native-shadow-2';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { OthersItem, useOthers } from '../context/OthersContext';
import ConfirmModal from '../modals/ConfirmModal';

// fixed card width
const CARD_WIDTH = Dimensions.get('window').width - 60;

type Props = {
  item: OthersItem;
};

const ConsMenuCardOthersSmall = ({ item }: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { deleteOther } = useOthers();

  const [pressed, setPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    navigation.navigate('CardPageOther', { item });
  };

  return (
    <Pressable
      style={{ marginBottom: hp(2), width: CARD_WIDTH }}
      onPress={handlePress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <Shadow
        distance={pressed ? 15 : 7}
        startColor={pressed ? 'rgba(7,181,189,0.6)' : 'rgba(0,0,0,0.3)'}
        radius={12}
        offset={[0, 0]}
        viewStyle={{ width: '100%', borderRadius: 12, backgroundColor: '#fff' }}
      >
        <View style={styles.cardContainer}>
          {/* IMAGE */}
          <Image
            source={
              item.imageUri
                ? { uri: item.imageUri }
                : require('../../assets/images/default_conservation.png')
            }
            style={styles.image}
          />

          {/* TEXT + INFO */}
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {item.name}
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.subtitle}>{item.packsCount}</Text>
              <Text style={styles.subtitle}> Штук</Text>

              {/* TRASH INLINE */}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setModalVisible(true);
                }}
                style={styles.trashInline}
              >
                <Image
                  source={require('../../assets/icons/trash.png')}
                  style={styles.trashIcon}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </Shadow>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        visible={modalVisible}
        message="Ви впевнені, що хочете видалити цей продукт?"
        onCancel={() => setModalVisible(false)}
        onConfirm={() => {
          deleteOther(item.name);
          setModalVisible(false);
        }}
      />
    </Pressable>
  );
};

export default ConsMenuCardOthersSmall;

const styles = StyleSheet.create({
  // main container
  cardContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F6F6F6',
    borderRadius: hp(1.5),
    padding: hp(1.5),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.1) },
    shadowOpacity: 0.1,
    shadowRadius: hp(0.2),
    elevation: 3,
  },

  // image
  image: {
    width: hp(9),
    height: hp(9),
    borderRadius: hp(1),
    marginRight: hp(2),
  },

  // text container
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // title
  title: {
    fontSize: hp(2.2),
    fontWeight: '600',
    color: '#000',
    marginBottom: hp(1.5),
  },

  // info row (кількість + trash)
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // quantity text
  subtitle: {
    fontSize: hp(1.7),
    color: 'grey',
  },

  // trash inline (right aligned)
  trashInline: {
    marginLeft: 'auto',
  },

  // trash icon
  trashIcon: {
    width: hp(2.2),
    height: hp(2.2),
    resizeMode: 'contain',
  },
});
