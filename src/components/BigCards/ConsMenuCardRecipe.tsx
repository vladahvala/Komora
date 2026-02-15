import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { RecipeItem, useRecipe } from '../../context/RecipesContext';
import ConfirmModal from '../../modals/ConfirmModal';
import CardImageWithButtons from '../form/cards/BigCardImageWithButtons';
import TrashButton from '../form/buttons/TrashButton';

// fixed card width
const CARD_WIDTH = Dimensions.get('window').width / 2 - 40;

type ConsMenuCardRecipeProps = {
  item: RecipeItem; 
  index: number;
};

const ConsMenuCardRecipe = ({ item, index }: ConsMenuCardRecipeProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // importing functions from context
  const { deleteRecipe, favorites, toggleFavorite } = useRecipe();
  // for alert
  const [modalVisible, setModalVisible] = useState(false);

  // navigate to CardPage
  const handlePress = () => {
    navigation.navigate('CardPageRecipe', { item });
  };

  // shadow glowing efect
  const [pressed, setPressed] = useState(false);

  // like logic
  const isFavorite = favorites.includes(item.name);

  
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
                {
                  element: (
                    <Pressable
                      onPress={() => toggleFavorite(item.name)}
                      style={{
                        width: hp(3.5),
                        height: hp(3.5),
                        borderRadius: hp(1),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        shadowColor: '#000',
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 0, height: 1 },
                        shadowRadius: 2,
                        elevation: 3,
                      }}
                    >
                      <Image
                        source={
                          isFavorite
                            ? require('../../../assets/icons/like_blue.png')
                            : require('../../../assets/icons/like.png')
                        }
                        style={{ width: hp(2.2), height: hp(2.2), tintColor: isFavorite ? undefined : 'grey' }}
                      />
                    </Pressable>
                  ),
                  style: { top: hp(2), right: hp(1) },
                },
              ]}
            />

            <Text
              style={styles.nameText}
              numberOfLines={2}
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
  // title 
  nameText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: hp(2.2),       
    textAlign: 'center',       
    marginTop: hp(1),          
    marginHorizontal: hp(1.5),  
    lineHeight: hp(2.5),        
    minHeight: hp(5),         
  },
   
});
