import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import ProductNumCard from '../../components/CardsInCards/ProductNumCard';
import AnimatedButton from '../../animations/AnimatedButton';
import CardHeader from '../../components/form/common/CardHeader';
import TotalJars from '../../components/form/jars/TotalJars';
import YearPicker from '../../components/form/years/YearPicker';
import DeleteIngredientButton from '../../components/form/buttons/DeleteIngredientButton';
import { useCardOther } from '../../hooks/Others/useCardOther';

type CardPageRouteProp = RouteProp<RootStackParamList, 'CardPageOther'>;

const CardPageOther = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<CardPageRouteProp>();
  const { item } = route.params;

  const { 
    // Current product
    currentItem, 

    // Image state
    imageUri, 

    // History selection
    selectedDate, 
    sortedHistory,
    setSelectedDate,

    // Dropdown
    dropdownVisible, 
    setDropdownVisible, 

    // Actions
    handleImageChange, 
    handleDeleteDate, 
    handleUpdateCount, 
    handleSave,
    
  } = useCardOther(item.name);

    return (
    <SafeAreaView style={[styles.container]}>
      <Pressable 
        style={{ flex: 1 }} 
        onPress={() => {
          setDropdownVisible(false);
        }}
      >
        <ScrollView 
        showsVerticalScrollIndicator={false}>
         
          {/* HEADER */}
          <CardHeader
            name={currentItem.name}
            imageUri={imageUri}
            onImageChange={handleImageChange}
            onBack={() => navigation.goBack()}
          />

          {/* SUM TOTAL */}
          <TotalJars totalJarsAllYears={currentItem.totalCount} />

          {/* DATE SELECT */}
          <View style={styles.dateContainer}>
            <Text style={styles.timeTitle}>Дата купівлі:</Text>
            <View style={styles.yearContainer}>
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
                style={styles.productNumCard}
                onChange={handleUpdateCount}
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
                onPress={() => selectedDate && handleDeleteDate(selectedDate)}
              />
            </View>
          )}

          {/* SAVE BUTTON */}
          <AnimatedButton onPress={() => handleSave(() => navigation.goBack())} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Зберегти зміни</Text>
          </AnimatedButton>
        </ScrollView>
      </Pressable>
    </SafeAreaView>
  );
};

export default CardPageOther;

const styles = StyleSheet.create({
  // container
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: hp(3.2),
    paddingTop: hp(3), 
  },

  // title
  timeTitle: {
    fontSize: hp(3),
    fontWeight: '600',
    color: 'black',
  },

  // date styles
  dateContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: hp(2),
  },  
  yearContainer: {
    flex: 1, 
    marginLeft: hp(2), 
  },

  // product card
  productCardWrap: {
    marginTop: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  productNumCard: {
    alignSelf: 'center',
  },

  // delete button
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
  // save button
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
