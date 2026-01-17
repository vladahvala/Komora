import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { OthersItem, useOthers } from '../../context/OthersContext';
import ConfirmModal from '../../modals/ConfirmModal';

// fixed card width
const CARD_WIDTH = Dimensions.get('window').width / 2 - 40;

type ConsMenuCardOthersProps = {
  item: OthersItem;
  index: number;
};

const ConsMenuCardOthers = ({ item, index }: ConsMenuCardOthersProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // отримуємо Context функції і список
  const { deleteOther, others } = useOthers();

  const [modalVisible, setModalVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  // знаходимо актуальний item в Context
  const currentItem = others.find(o => o.name === item.name) || item;

  const handlePress = () => {
    navigation.navigate('CardPageOther', { item: currentItem });
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{ width: CARD_WIDTH }}
    >
      <Shadow
        distance={pressed ? 15 : 7}
        startColor={pressed ? 'rgba(7,181,189,0.6)' : 'rgba(0,0,0,0.3)'}
        offset={[0, 0]}
        radius={15}
        viewStyle={{ width: '100%', borderRadius: 15 }}
      >
        <View style={styles.listContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={
                currentItem.imageUri
                  ? { uri: currentItem.imageUri }
                  : require('../../../assets/images/default_conservation.png')
              }
              style={styles.image}
            />
            <Pressable
              style={styles.trashButton}
              onPress={(e) => {
                e.stopPropagation();
                setModalVisible(true);
              }}
            >
              <Image
                source={require('../../../assets/icons/trash.png')}
                style={styles.trashIcon}
              />
            </Pressable>
          </View>

          <Text
            style={styles.nameText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {currentItem.name}
          </Text>

          <View style={styles.jarsRow}>
            <Text style={styles.jarText}>{currentItem.totalCount}</Text>
            <Text style={styles.jarText}> Штук</Text>
          </View>

        </View>
      </Shadow>

      <ConfirmModal
        visible={modalVisible}
        message="Ви впевнені, що хочете видалити цей продукт?"
        onCancel={() => setModalVisible(false)}
        onConfirm={() => {
          deleteOther(currentItem.name);
          setModalVisible(false);
        }}
      />
    </Pressable>
  );
};

export default ConsMenuCardOthers;

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#F6F6F6',
    paddingBottom: hp(2),
    borderRadius: hp(2.5),
    height: hp(25),
  },
  imageContainer: {
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
  nameText: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: hp(2),
    marginRight: hp(2),
    lineHeight: hp(1.5),
    height: hp(1.8),
    fontSize: hp(2),
    marginTop: hp(0.5),
  },
  jarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: hp(2),
    marginTop: hp(2.5),
  },
  jarText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: hp(1.5),
  },
});
