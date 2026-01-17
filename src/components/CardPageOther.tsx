import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { useOthers } from '../context/OthersContext';
import { launchImageLibrary } from 'react-native-image-picker';
import ProductNumCard from '../components/ProductNumCard';
import AnimatedButton from '../animations/AnimatedButton';

type CardPageRouteProp = RouteProp<RootStackParamList, 'CardPageOther'>;

const normalizeName = (name: string) => name.trim().replace(/\s+/g, ' ').toLowerCase();

const CardPageOther = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<CardPageRouteProp>();
  const { item } = route.params;

  const { others, updateCount, updateImage, deleteHistory } = useOthers();

  const currentItem = others.find(o => normalizeName(o.name) === normalizeName(item.name));
  const [imageUri, setImageUri] = useState<string | null>(currentItem?.imageUri || null);

  const history = currentItem?.history ?? [];

  const sortedHistory = [...history].sort((a, b) => {
    const [d1, m1, y1] = a.date.split('.');
    const [d2, m2, y2] = b.date.split('.');
    const date1 = new Date(`${y1}-${m1}-${d1}`);
    const date2 = new Date(`${y2}-${m2}-${d2}`);
    return date1.getTime() - date2.getTime();
  });

  const [selectedDate, setSelectedDate] = useState<string | null>(sortedHistory[0]?.date || null); 
  const [dropdownVisible, setDropdownVisible] = useState(false);

  if (!currentItem) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: hp(10) }}>Продукт не знайдено!</Text>
      </SafeAreaView>
    );
  }

  const handleSaveChanges = async () => {
    if (imageUri) await updateImage(currentItem.name, imageUri);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowWrapper}>
            <View style={styles.arrowTouchArea}>
              <Image source={require('../../assets/icons/arrow.png')} style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>
        </View>

        {/* TITLE + IMAGE */}
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <Text style={styles.menuTitle}>{currentItem.name}</Text>
          </View>
          <View style={styles.titleImageWrapper}>
            <Image
              source={imageUri ? { uri: imageUri } : require('../../assets/images/default_conservation.png')}
              style={styles.titleImage}
            />
            <Pressable
              style={styles.imageOverlay}
              onPress={() => {
                launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
                  if (response.assets && response.assets.length > 0) {
                    setImageUri(response.assets[0].uri ?? null);
                  }
                });
              }}
            >
              <Text style={styles.imageOverlayText}>Змінити</Text>
            </Pressable>
          </View>
        </View>

        {/* SUM TOTAL */}
        <View style={styles.timeRow}>
          <Text style={styles.timeTitle}>Загальна к-ть:</Text>
          <View style={styles.bigIconContainer}>
            <Text style={styles.timeTitle}>{currentItem.totalCount}</Text>
          </View>
        </View>

        {/* DATE SELECT */}
        <View style={{ marginTop: hp(2), flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.timeTitle]}>Дата купівлі:</Text>

          <View style={styles.yearDropdownWrapper}>
            <Pressable
              style={styles.bigIconContainer}
              onPress={() => setDropdownVisible(prev => !prev)}
            >
              <Text style={styles.timeTitle}>{selectedDate ?? 'Виберіть дату'}</Text>
              <Image
                source={require('../../assets/icons/frame_down.png')}
                style={styles.arrowDownIcon}
              />
            </Pressable>

            {/* Dropdown */}
            {dropdownVisible && (
              <>
                {/* Overlay, який закриває dropdown при натисканні поза ним */}
                <Pressable
                  style={styles.fullScreenOverlay}
                  onPress={() => setDropdownVisible(false)}
                />

                <View style={styles.yearsDropdownContainer}>
                  {sortedHistory.map((h) => ( 
                    <Pressable
                      key={h.date}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedDate(h.date);
                        setDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{h.date}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>

        {/* ProductNumCard */}
        {selectedDate && (
          <View style={styles.productCardWrap}>
            <ProductNumCard
              image={require('../../assets/icons/products.png')}
              count={sortedHistory.find(h => h.date === selectedDate)?.count ?? 0}
              circleLabel={(sortedHistory.find(h => h.date === selectedDate)?.count ?? 0).toString()}
              style={{ alignSelf: 'center' }}
              onChange={(newCount: number) => {
                updateCount(currentItem.name, newCount, selectedDate);
              }}
            />
          </View>
        )}

        {/* DELETE BUTTON */}
        {selectedDate && (
          <View style={styles.deleteRow}>
            <Text style={styles.timeTitleDelete}>
              Видалити продукти за цю{'\n'}дату:
            </Text>
            <AnimatedButton
              style={styles.deleteHistoryButton}
              onPress={() => deleteHistory(currentItem.name, selectedDate)}
            >
              <Image
                source={require('../../assets/icons/remove_black.png')}
                style={styles.deleteIcon}
              />
            </AnimatedButton>
          </View>
        )}

        {/* SAVE BUTTON */}
        <AnimatedButton onPress={handleSaveChanges} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Зберегти зміни</Text>
        </AnimatedButton>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CardPageOther;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FD',
    paddingHorizontal: hp(3.2),
  },

  headerTopRow: {
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

  arrowIcon: {
    width: hp(3.2),
    height: hp(3),
    resizeMode: 'contain',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleLeft: {
    flex: 1,
    justifyContent: 'center',
    marginRight: hp(3),
  },

  menuTitle: {
    fontSize: hp(2.9),
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },

  titleImageWrapper: {
    width: hp(22),
    height: hp(17),
    borderRadius: hp(2.5),
    overflow: 'hidden',
  },

  titleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '25%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageOverlayText: {
    color: 'white',
    fontWeight: '600',
    fontSize: hp(2.2),
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(3),
  },

  timeTitle: {
    fontSize: hp(3),
    fontWeight: '600',
    color: 'black',
  },

  bigIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: hp(1.5),
    height: hp(6),
    marginLeft: hp(2),
    backgroundColor: '#00B4BF66',
    borderRadius: hp(1.5),
    justifyContent: 'center',
  },

  // DROPDOWN
  yearDropdownWrapper: {
    position: 'relative',
    zIndex: 1000,
  },

  fullScreenOverlay: {
    position: 'absolute',
    top: -hp(1000),
    left: -hp(1000),
    right: -hp(1000),
    bottom: -hp(1000),
    zIndex: 1,
  },

  yearsDropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: hp(1.7),
    width: '93%',
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#AEAEAE',
    borderRadius: hp(1.5),
    marginTop: hp(0.5),
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },

  dropdownItem: {
    paddingVertical: hp(1.5),
    paddingHorizontal: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  dropdownItemText: {
    fontSize: hp(2.2),
    color: '#333',
    textAlign: 'center',
  },

  arrowDownIcon: {
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: 'contain',
    marginLeft: hp(1),
  },

  // product card
  productCardWrap: {
    marginTop: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // delete
  deleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(4),
  },

  timeTitleDelete: {
    fontSize: hp(2.6),
    fontWeight: '700',
    color: 'black',
  },

  deleteHistoryButton: {
    height: hp(5),
    width: hp(5),
    backgroundColor: '#FF6B6B',
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: hp(3),
  },

  deleteIcon: {
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: 'contain',
  },

  saveButton: {
    marginTop: hp(4),
    paddingHorizontal: hp(2),
    height: hp(6.5),
    borderRadius: hp(3.25),
    backgroundColor: '#00B4BF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  saveButtonText: {
    fontSize: hp(2.6),
    fontWeight: '700',
    color: 'black',
  },
});
