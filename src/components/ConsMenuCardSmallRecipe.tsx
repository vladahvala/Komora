import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Shadow } from 'react-native-shadow-2';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { useRecipe, RecipeItem, RecipesContext } from '../context/RecipesContext';
import ConfirmModal from '../modals/ConfirmModal';

// fixed card width
const CARD_WIDTH = Dimensions.get('window').width - 60; 

type ConsMenuCardSmallRecipeProps = {
  item: RecipeItem;
};

const ConsMenuCardSmallRecipe = ({ item }: ConsMenuCardSmallRecipeProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // shadow glowing effect
  const [pressed, setPressed] = useState(false);

  // modal
  const [modalVisible, setModalVisible] = useState(false);

  // context functions
  const { deleteRecipe } = useRecipe();

  // navigate to CardPage
  const handlePress = () => {
    navigation.navigate('CardPageRecipe', { item });
  };
  
  // like logic
  const { favorites, toggleFavorite } = useContext(RecipesContext);
  const isFavorite = favorites.includes(item.name);

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
          {/* IMAGE */}
          <Image
            source={ item.imageUri ? { uri: item.imageUri } : require('../../assets/images/default_conservation.png') }
            style={styles.image}
          />

          {/* RIGHT SIDE: TEXT + ICONS */}
          <View style={styles.rightContainer}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {item.name}
            </Text>

            {/* ICONS COLUMN */}
            <View style={styles.iconsColumn}>
              <Pressable
                onPress={(e) => { e.stopPropagation(); toggleFavorite(item.name); }}
                style={styles.heartButton}
              >
                <Image
                  source={isFavorite ? require('../../assets/icons/like_blue.png') : require('../../assets/icons/like.png')}
                  style={[styles.heartIcon, { tintColor: isFavorite ? undefined : 'grey' }]}
                />
              </Pressable>

              <Pressable
                onPress={(e) => { e.stopPropagation(); setModalVisible(true); }}
                style={styles.trashButton}
              >
                <Image
                  source={require('../../assets/icons/trash.png')}
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
          deleteRecipe(item.name);
          setModalVisible(false);
        }}
      />

    </Pressable>
  );
};

export default ConsMenuCardSmallRecipe;

const styles = StyleSheet.create({
  // container
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

  // right part
  rightContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row', 
    alignItems: 'center',
  },

  // title styles
  title: {
    fontSize: hp(2.2),
    fontWeight: '600',
    color: '#000',
    marginBottom: hp(1.5),
  },

  // icons column
  iconsColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  // heart button
  heartButton: {
    width: hp(3),
    height: hp(3),
    marginBottom: hp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  trashButton: {
    width: hp(3),
    height: hp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  trashIconInline: {
    width: hp(2.2),
    height: hp(2.2),
    resizeMode: 'contain',
  },
});
