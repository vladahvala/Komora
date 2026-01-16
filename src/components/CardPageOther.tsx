import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { OthersItem, useOthers } from '../context/OthersContext';
import { launchImageLibrary } from 'react-native-image-picker';
import ProductNumCard from '../components/ProductNumCard';
import AnimatedButton from '../animations/AnimatedButton';
import DateTimePicker from '@react-native-community/datetimepicker';

type CardPageRouteProp = RouteProp<RootStackParamList, 'CardPageOther'>;

const CardPageOther = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<CardPageRouteProp>();
  const { item } = route.params;


const handleIncrement = () => {
  const newCount = Number(packsCount) + 1;
  setPacksCount(newCount.toString());
  updateCount(item.name, newCount); // <- оновлює Context
};

const handleDecrement = () => {
  const newCount = Math.max(0, Number(packsCount) - 1);
  setPacksCount(newCount.toString());
  updateCount(item.name, newCount); // <- оновлює Context
};

  const { updateCount, updateImage, updateDate } = useOthers();

  const [imageUri, setImageUri] = useState<string | null>(item.imageUri || null);
  const [packsCount, setPacksCount] = useState(item.packsCount.toString());
  const [date, setDate] = useState(new Date(item.date.split('.').reverse().join('-')));
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: hp(10) }}>Продукт не знайдено!</Text>
      </SafeAreaView>
    );
  }

  const formatDate = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleSaveChanges = async () => {
    if (imageUri) await updateImage(item.name, imageUri);
    await updateCount(item.name, Number(packsCount));
    await updateDate(item.name, formatDate(date));
    navigation.goBack();
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* HEADER ROW */}
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowWrapper}>
            <Image
              source={require('../../assets/icons/arrow.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>

        {/* TITLE + IMAGE */}
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <Text style={styles.menuTitle}>{item.name}</Text>
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
                    setImageUri(response.assets[0].uri);
                  }
                });
              }}
            >
              <Text style={styles.imageOverlayText}>Змінити</Text>
            </Pressable>
          </View>
        </View>

        {/* DETAILS */}
        <View style={styles.timeRow}>
          <Text style={styles.timeTitle}>Кількість:</Text>
          <TextInput
            style={[styles.bigIconContainer, { paddingHorizontal: hp(1), fontSize: hp(3), fontWeight: '600', color: 'black', }]}
            keyboardType="number-pad"
            value={packsCount}
            onChangeText={text => {
                const num = Math.min(Math.max(parseInt(text.replace(/[^0-9]/g, '') || '0', 10), 0), 99);
                setPacksCount(num.toString());
            }}
            textAlign="center"
            />
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.timeTitle}>Дата купівлі:</Text>
          <Pressable style={[styles.bigIconContainer, { paddingHorizontal: hp(1) }]} onPress={() => setShowDatePicker(true)}>
            <Text style={{ fontSize: hp(3), fontWeight: '600', color: 'black', }}>{formatDate(date)}</Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.timeRowProduct}>
        <ProductNumCard
            image={require('../../assets/icons/products.png')}
            count={Number(packsCount)}
            circleLabel={packsCount}
            style={{ alignSelf: 'center' }}
            onChange={(newCount: number) => {
              setPacksCount(newCount.toString());
            }}
        />


        </View>

        {/* SAVE BUTTON */}
        <AnimatedButton onPress={handleSaveChanges} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Зберегти зміни</Text>
        </AnimatedButton>

      </ScrollView>
    </SafeAreaView>
  );
};

export default CardPageOther;

// --- styles залишаються без змін ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F7F9FD', 
    paddingHorizontal: hp(4.2),
  },
  scrollContent: { 
    paddingBottom: hp(4), 
    paddingTop: hp(3),
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowWrapper: {
    padding: hp(1.2),
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
    marginBottom: hp(3),
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
    position: 'relative',
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
  timeRowProduct: {
    flexDirection: 'row',     
    alignItems: 'center',
    justifyContent:  'center',
    marginTop: hp(5),  
  },
  timeTitle: {
    fontSize: hp(3), 
    fontWeight: '700', 
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
  saveButton: {
    marginTop: hp(6),
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
