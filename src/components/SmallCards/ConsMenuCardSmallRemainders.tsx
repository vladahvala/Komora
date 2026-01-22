import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Shadow } from 'react-native-shadow-2';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { useConservation } from '../../context/ConservationContext';
import ConfirmModal from '../../modals/ConfirmModal';

// fixed card width
const CARD_WIDTH = Dimensions.get('window').width - 60; 

type ConsMenuCardSmallProps = {
  item: {
    name: string;
    imageUri?: string;       
    history: Record<string, Record<string, number>>; 
  };
};

const ConsMenuCardSmallRemainders = ({ item }: ConsMenuCardSmallProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // shadow glowing efect
  const [pressed, setPressed] = useState(false);

  // importing functions from context
  const { deleteConservation } = useConservation();
  const [modalVisible, setModalVisible] = useState(false);

  // jars count (all years)
  const totalJars = Object.values(item.history).reduce(
    (sum, yearData) => {
      const jarCounts = yearData.jarCounts;
      const yearSum = Object.values(jarCounts).reduce((s, val) => s + val, 0);
      return sum + yearSum;
    },
    0
  );

  // navigate to CardPage
  const handlePress = () => {
    navigation.navigate('CardPage', { item });
  };
  
  const currentYear = new Date().getFullYear();
  
  const expiredYears = Object.entries(item.history)
  .map(([year, data]: any) => {
    const expirationYear = Number(year) + (data.period ?? 0);
    return currentYear - expirationYear;
  })
  .filter(diff => diff >= 0);

  const maxExpired = expiredYears.length > 0 ? Math.max(...expiredYears) : 0;


  return (
    <Pressable
      style={{ marginBottom: hp(2), width: CARD_WIDTH }}
      onPress={handlePress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >

      {/* GLOWING SHADOW */}
      <Shadow
        distance={pressed ? 15 : 7}
        startColor={pressed ? 'rgba(7,181,189,0.6)' : 'rgba(0,0,0,0.3)'}
        radius={12}
        offset={[0, 0]}
        viewStyle={{ width: '100%', borderRadius: 12, backgroundColor: '#fff' }}
      >
        {/* CARD STYLES */}
        <View style={styles.cardContainer}>
          {/* CARD IMG */}
          <Image
            source={
              item.imageUri
                ? { uri: item.imageUri }
                : require('../../../assets/images/default_conservation.png')
            }
            style={styles.image}
          />

          {/* CARD INFO + TRASH BUTTON INLINE */}
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {item.name}
            </Text>
            <View style={styles.infoRow}>
              <Text style={styles.subtitle}>{totalJars}</Text>
              <Image
                source={require('../../../assets/icons/jar.png')}
                style={styles.jarIcon}
              />
              <Text style={styles.subtitle}>Банок</Text>
              <Text style={styles.subtitle}>
                {'  '}- {maxExpired}+ років
              </Text>


              {/* TRASH BUTTON INLINE */}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setModalVisible(true);
                }}
                style={styles.trashInline}
              >
                <Image
                  source={require('../../../assets/icons/trash.png')}
                  style={styles.trashIconInline}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </Shadow>

      {/* ALERT */}
      <ConfirmModal
        visible={modalVisible}
        message="Ви впевнені, що хочете видалити цю картку?"
        onCancel={() => setModalVisible(false)}
        onConfirm={() => {
          deleteConservation(item.name);
          setModalVisible(false);
        }}
      />

    </Pressable>
  );
};

export default ConsMenuCardSmallRemainders;

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

  // img styles
  image: {
    width: hp(9),
    height: hp(9),
    borderRadius: hp(1),
    marginRight: hp(2),
  },

  // text styles
  textContainer: {
    flex: 1,
    justifyContent: 'space-between', 
  },
  title: {
    fontSize: hp(2.2),
    fontWeight: '600',
    color: '#000',
    marginBottom: hp(1.5),
  },

  // info row with jars and trash button inline
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: hp(1.7),
    color: 'grey',
  },
  jarIcon: {
    width: hp(2.2),
    height: hp(2.2),
    marginLeft: hp(0.5),
    marginRight: hp(0.5),
    resizeMode: 'contain',
  },

  // trash button inline
  trashInline: {
    marginLeft: 'auto', 
  },
  trashIconInline: {
    width: hp(2.2),
    height: hp(2.2),
    resizeMode: 'contain',
  },
});
