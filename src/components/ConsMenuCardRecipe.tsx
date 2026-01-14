import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation'; // твій стек навігації
import { RecipeItem, useRecipe } from '../context/RecipesContext';
import ConfirmModal from '../modals/ConfirmModal';

// fixed card width
const CARD_WIDTH = Dimensions.get('window').width / 2 - 40;

type ConsMenuCardRecipeProps = {
  item: RecipeItem; 
  index: number;
};

const ConsMenuCardRecipe = ({ item, index }: ConsMenuCardRecipeProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // importing functions from context
  const { deleteRecipe } = useRecipe();
  // for alert
  const [modalVisible, setModalVisible] = useState(false);

  // navigate to CardPage
  const handlePress = () => {
    navigation.navigate('CardPageRecipe', { item });
  };

  // shadow glowing efect
  const [pressed, setPressed] = useState(false);

  
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
            <View style={styles.imageContainer}>
              <Image
                source={
                  item.imageUri
                    ? { uri: item.imageUri }
                    : require('../../assets/images/default_conservation.png')
                }
                style={styles.image}
              />

              {/* TRASH BUTTON */}
              <Pressable
                style={styles.trashButton}
                onPress={(e) => {
                  e.stopPropagation(); 
                  setModalVisible(true);
                }}
              >
                <Image
                  source={require('../../assets/icons/trash.png')}
                  style={styles.trashIcon}
                />
              </Pressable>
            </View>

            <Text
              style={styles.nameText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
            
          </View>
      </Shadow>

      {/* ALERT */}
      <ConfirmModal
        visible={modalVisible}
        message="Ви впевнені, що хочете видалити цю картку?"
        onCancel={() => setModalVisible(false)}
        onConfirm={() => {
          deleteRecipe(item.name);
          setModalVisible(false);
        }}
      />
      
    </Pressable>
  );
};

export default ConsMenuCardRecipe;

const styles = StyleSheet.create({
  // main container
  listContainer: {
    backgroundColor: '#F6F6F6',
    paddingBottom: hp(2),    
    borderRadius: hp(2.5),
    height: hp(25),   
  },

  // image styles
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
  // delete card styles
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
  
    // shadow
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

  // card info styles 
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
  jarIcon: {
    width: hp(2.2),
    height: hp(2.2),
    marginHorizontal: hp(0.5),
    resizeMode: 'contain',
  },
});
