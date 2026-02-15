import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { ConservationItem, useConservation } from '../../context/ConservationContext';
import ConfirmModal from '../../modals/ConfirmModal';
import JarCountRow from '../form/jars/JarCountRow';
import CardImageWithButtons from '../form/cards/BigCardImageWithButtons';
import TrashButton from '../form/buttons/TrashButton';

// fixed card width
const CARD_WIDTH = Dimensions.get('window').width / 2 - 40;

type ConsMenuCardProps = {
  item: ConservationItem; 
  index: number;
};

const ConsMenuCard = ({ item, index }: ConsMenuCardProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // importing functions from context
  const { deleteConservation } = useConservation();
  // for alert
  const [modalVisible, setModalVisible] = useState(false);

  // navigate to CardPage
  const handlePress = () => {
    navigation.navigate('CardPage', { item });
  };

  // shadow glowing efect
  const [pressed, setPressed] = useState(false);

  // jars count (all years)
  const totalJars = Object.values(item.history).reduce(
    (sum, yearData) => {
      const jarCounts = yearData.jarCounts;
      const yearSum = Object.values(jarCounts).reduce((s, val) => s + val, 0);
      return sum + yearSum;
    },
    0
  );
  
  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{ width: CARD_WIDTH }}>
        
      {/* GLOWING SHADOW */}
      <Shadow
        distance={pressed ? 15 : 7}
        startColor={pressed ? 'rgba(7,181,189,0.6)' : 'rgba(0,0,0,0.3)'}
        offset={[0, 0]}
        radius={15}
        viewStyle={{ width: '100%', borderRadius: 15 }}>
           
          {/* CARDS */}
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
              {item.name}
            </Text>

            {/* CARD INFO */}
            <View style={styles.jarsRow}>
              <JarCountRow 
                count={totalJars} 
                label="Банок"
              />
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

export default ConsMenuCard;

const styles = StyleSheet.create({
  // main container
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
  
  // title 
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
