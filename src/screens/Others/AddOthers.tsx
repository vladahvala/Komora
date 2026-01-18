import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import AlertModal from '../../modals/AlertModal';
import { launchImageLibrary } from 'react-native-image-picker';
import { OthersContext } from '../../context/OthersContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import AnimatedButton from '../../animations/AnimatedButton';

const AddOthers = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { addOther } = useContext(OthersContext);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [packsCount, setPacksCount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const formatDate = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleAddOther = () => {
    if (!name) {
      setModalMessage('Введіть назву продукту!');
      setModalVisible(true);
      return;
    }
    if (!packsCount) {
      setModalMessage('Введіть кількість упаковок/пляшок/банок!');
      setModalVisible(true);
      return;
    }

    const newItem = {
      name,
      imageUri,
      count: Number(packsCount ?? 0),
      date: formatDate(date),
    };

    addOther(newItem);

    setName('');
    setPacksCount('');
    setImageUri(null);
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaProvider style={styles.container}>
        <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>

            {/* ARROW */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('MainMenu')} 
              style={styles.arrowWrapper}
              activeOpacity={1}
            >
              <View style={styles.arrowTouchArea}>
                <Image source={require('../../../assets/icons/arrow.png')} style={styles.arrowIcon} />
              </View>
            </TouchableOpacity>

            {/* TITLE */}
            <Text style={styles.menuTitle}>Новий продукт</Text>

            {/* IMAGE */}
            <View style={{ marginTop: hp(2) }}>
              <Text style={styles.label}>Фото продукту</Text>
              <Pressable
                style={[styles.imagePicker, { borderColor: imageUri ? '#00B4BF' : '#AEAEAE' }]}
                onPress={() =>
                  launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
                    if (response.assets?.length) setImageUri(response.assets[0].uri ?? null);
                  })
                }
              >
                {imageUri ? <Image source={{ uri: imageUri }} style={styles.selectedImage} /> : <Text style={styles.imagePickerText}>Оберіть фото</Text>}
              </Pressable>
            </View>

            {/* NAME INPUT */}
            <View style={{ marginTop: hp(2) }}>
              <Text style={styles.label}>Назва</Text>
              <View style={[styles.searchContainer, { borderColor: isNameFocused ? '#00B4BF' : '#AEAEAE' }]}>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.inputName}
                  onFocus={() => setIsNameFocused(true)} onBlur={() => setIsNameFocused(false)}
                />
              </View>
            </View>

            {/* PACKS COUNT INPUT */}
            <View style={{ marginTop: hp(2) }}>
              <Text style={styles.label}>Кількість упаковок/пляшок/банок</Text>
              <View style={[styles.searchContainer, { borderColor: '#AEAEAE' }]}>
                <TextInput
                  value={packsCount}
                  onChangeText={setPacksCount}
                  keyboardType="numeric"
                  style={styles.inputName}
                />
              </View>
            </View>

            {/* DATE */}
            <View style={styles.timeRow}>
              <Text style={styles.timeTitle}>Час купівлі:</Text>
              <Pressable style={styles.bigIconContainer} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateText}>{formatDate(date)}</Text>
              </Pressable>
            </View>
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

            {/* ADD BUTTON */}
            <AnimatedButton 
              onPress={handleAddOther} 
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Додати продукт</Text>
            </AnimatedButton>

          </View>
        </ScrollView>

        <AlertModal visible={modalVisible} message={modalMessage} onClose={() => setModalVisible(false)} />
      </SafeAreaProvider>
    </TouchableWithoutFeedback>
  );
};

export default AddOthers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: hp(3.2),
  },
  scrollContent: {
    paddingBottom: hp(4),
  },
  headerContainer: {
    paddingTop: hp(5),
    marginBottom: hp(2),
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
  menuTitle: {
    fontSize: hp(3.5),
    marginBottom: hp(2),
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
  imagePicker: {
    height: hp(15),
    borderWidth: hp(0.25),
    borderRadius: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
  },
  imagePickerText: {
    fontSize: hp(2.2),
    color: '#666',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: hp(1.5),
    resizeMode: 'cover',
  },
  label: {
    fontSize: hp(2.2),
    fontWeight: '500',
    color: '#333',
    marginBottom: hp(0.5),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderWidth: hp(0.25),
    borderRadius: hp(1.5),
    paddingHorizontal: hp(1.5),
    height: hp(6),
  },
  inputName: {
    flex: 1,
    fontSize: hp(2.2),
    color: 'black',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(3),
  },
  timeTitle: {
    fontSize: hp(3.2),
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
  dateText: {
    fontSize: hp(2.4),
    fontWeight: '600',
    color: 'black',
    paddingHorizontal: hp(1),
  },
  addButton: {
    marginTop: hp(4),
    paddingHorizontal: hp(2),
    height: hp(6.5),
    borderRadius: hp(3.25),
    backgroundColor: '#00B4BF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  addButtonText: {
    fontSize: hp(2.6),
    fontWeight: '700',
    color: 'black',
  },
});
