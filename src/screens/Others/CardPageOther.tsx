import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import { useOthers } from '../../context/OthersContext';
import ProductNumCard from '../../components/CardsInCards/ProductNumCard';
import AnimatedButton from '../../animations/AnimatedButton';
import CardHeader from '../../components/form/CardHeader';
import TotalJars from '../../components/form/jars/TotalJars';
import YearPicker from '../../components/form/years/YearPicker';
import DeleteHistoryRow from '../../components/form/buttons/DeleteIngredientButton';
import DeleteIngredientButton from '../../components/form/buttons/DeleteIngredientButton';

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
    <SafeAreaView style={[styles.container]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
      >
          {/* HEADER */}
          <CardHeader
            name={item.name}
            imageUri={imageUri}
            onImageChange={(uri) => {
              setImageUri(uri);
              if (currentItem) updateImage(currentItem.name, uri);
            }}
            onBack={() => navigation.goBack()}
          />

          {/* SUM TOTAL */}
          <TotalJars totalJarsAllYears={currentItem.totalCount} />

          {/* DATE SELECT */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(2) }}>
            <Text style={styles.timeTitle}>Дата купівлі:</Text>
            <View style={{ flex: 1, marginLeft: hp(2) }}>
              <YearPicker
                selectedYear={selectedDate}
                onSelect={setSelectedDate}
                isOpen={dropdownVisible}
                onToggle={() => setDropdownVisible(prev => !prev)}
                onClose={() => setDropdownVisible(false)}
                years={sortedHistory.map(h => h.date)}
                fontSize={hp(2.5)}
              />
            </View>
          </View>

          {/* ProductNumCard */}
          {selectedDate && (
            <View style={styles.productCardWrap}>
              <ProductNumCard
                image={require('../../../assets/icons/products.png')}
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
              <DeleteIngredientButton
                onPress={() => {
                  if (currentItem && selectedDate) {
                    deleteHistory(currentItem.name, selectedDate);
                    const newHistory = currentItem.history.filter(h => h.date !== selectedDate);
                    setSelectedDate(newHistory[0]?.date || null);
                  }
                }}
              />
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
    backgroundColor: '#FFF',
    paddingHorizontal: hp(3.2),
    paddingTop: hp(3), 
  },
  timeTitle: {
    fontSize: hp(3),
    fontWeight: '600',
    color: 'black',
  },

  // product card
  productCardWrap: {
    marginTop: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(4),
  },
  timeTitleDelete: {
    fontSize: hp(2.4),
    marginRight: hp(1.2),
    fontWeight: '700',
    color: 'black',
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
