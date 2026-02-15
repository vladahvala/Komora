import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { OthersItem, useOthers } from '../../context/OthersContext';
import ConfirmModal from '../../modals/ConfirmModal';
import JarCountRow from '../form/jars/JarCountRow';
import CardImageWithButtons from '../form/cards/BigCardImageWithButtons';
import TrashButton from '../form/buttons/TrashButton';

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
          {/* CARD IMG */}
          <CardImageWithButtons
            imageUri={item.imageUri}
            buttons={[
              {
                element: <TrashButton onPress={() => setModalVisible(true)} />,
              },
            ]}
          />

          <Text
            style={styles.nameText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {currentItem.name}
          </Text>

          <View style={styles.jarsRow}>
            <JarCountRow 
              count={currentItem.totalCount}
              showIcon={false}   
              label="Штук"
            />
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
  jarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: hp(2),
    marginTop: hp(2.5),
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
});
