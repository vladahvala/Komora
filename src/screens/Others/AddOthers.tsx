import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import AlertModal from '../../modals/AlertModal';
import { launchImageLibrary } from 'react-native-image-picker';
import { OthersContext, OthersItem } from '../../context/OthersContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import AnimatedButton from '../../animations/AnimatedButton';

const AddOthers = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // func addOther from context
  const { addOther } = useContext(OthersContext);

  // image field
  const [imageUri, setImageUri] = useState<string | null>(null);

  // name field
  const [name, setName] = useState('');
  // active
  const [isNameFocused, setIsNameFocused] = useState(false);

  // packs count
  const [packsCount, setPacksCount] = useState('');

  const [isPacksFocused, setIsPacksFocused] = useState(false);


  // date
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // date format 15.03.2023
  const formatDate = (date: Date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
  };


  // alerts
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

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

    // creating obj
    const newItem: OthersItem = {
      name,
      imageUri,
      packsCount: Number(packsCount),
      date: formatDate(date), 
    };

    // adding obj to context
    addOther(newItem);

    // clearing fields
    setName('');
    setPacksCount('');
    setImageUri(null);

    navigation.goBack();
  };

  return (
    // MAIN CONTAINER
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaProvider style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            {/* ARROW TO MAIN MENU */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.arrowWrapper}
              activeOpacity={1}
            >
              <View style={styles.arrowTouchArea}>
                <Image
                  source={require('../../../assets/icons/arrow.png')}
                  style={styles.arrowIcon}
                />
              </View>
            </TouchableOpacity>

            {/* TITLE TEXT */}
            <Text style={styles.menuTitle}>Новий продукт</Text>

            {/* IMAGE */}
            <View style={{ marginTop: hp(2) }}>
              <Text style={styles.label}>Фото продукту</Text>
              <Pressable
                style={[
                  styles.imagePicker,
                  { borderColor: imageUri ? '#00B4BF' : '#AEAEAE' },
                ]}
                onPress={() =>
                  launchImageLibrary(
                    { mediaType: 'photo', quality: 0.7 },
                    response => {
                      if (response.assets?.length) {
                        setImageUri(response.assets[0].uri || null);
                      }
                    }
                  )
                }
              >
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                ) : (
                  <Text style={styles.imagePickerText}>Оберіть фото</Text>
                )}
              </Pressable>
            </View>

            {/* NAME */}
            <View style={{ marginTop: hp(2) }}>
              <Text style={styles.label}>Назва</Text>
              <View
                style={[
                  styles.searchContainer,
                  { borderColor: isNameFocused ? '#00B4BF' : '#AEAEAE' },
                ]}
              >
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.inputName}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                />
              </View>
            </View>

            {/* PACKS COUNT */}
            <View style={{ marginTop: hp(2) }}>
              <Text style={styles.label}>Кількість упаковок/пляшок/банок</Text>
              <View
                style={[
                  styles.searchContainer,
                  { borderColor: isPacksFocused ? '#00B4BF' : '#AEAEAE' },
                ]}
              >
                <TextInput
                  value={packsCount}
                  onChangeText={setPacksCount}
                  keyboardType="numeric"
                  style={styles.inputName}
                  onFocus={() => setIsPacksFocused(true)}
                  onBlur={() => setIsPacksFocused(false)}
                />
              </View>
            </View>

            {/* DATE */}
            <View style={styles.dateRow}>
              <Text style={styles.labelTime}>Час купівлі:</Text>

              <Pressable
                style={styles.dateBox}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>{formatDate(date)}</Text>
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

            {/* ALERT */}
            <AlertModal
              visible={modalVisible}
              message={modalMessage}
              onClose={() => setModalVisible(false)}
            />

            {/* ADD BUTTON */}
            <AnimatedButton
              onPress={handleAddOther}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Додати продукт</Text>
            </AnimatedButton>

          </View>
        </ScrollView>
      </SafeAreaProvider>
    </TouchableWithoutFeedback>
  );
};

export default AddOthers;

const styles = StyleSheet.create({
  // main container
  container: {
    flex: 1,
    backgroundColor: '#F7F9FD',
    paddingHorizontal: hp(3.2),
  },
  scrollContent: {
    paddingBottom: hp(4),
  },
  headerContainer: {
    paddingTop: hp(5),
    marginBottom: hp(2),
  },

  // arrow styles
  arrowWrapper: {
    alignSelf: 'flex-start',
    marginBottom: hp(1),
  },
  arrowTouchArea: {
    padding: hp(1.2),
  },
  arrowIcon: {
    width: hp(3.2),
    height: hp(3),
    resizeMode: 'contain',
  },

  // title
  menuTitle: {
    fontSize: hp(3.5),
    fontWeight: '600',
    textAlign: 'center',
    color: 'black',
  },

  // image
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
  },

  // inputs
  label: {
    fontSize: hp(2.2),
    fontWeight: '500',
    marginBottom: hp(0.5),
    color: 'black',
  },
  labelTime: {
    fontSize: hp(3.2),
    fontWeight: '500',
    marginBottom: hp(0.5),
    marginRight: hp(2),
    color: 'black',
  },
  searchContainer: {
    backgroundColor: '#F1F1F1',
    borderWidth: hp(0.25),
    borderRadius: hp(1.5),
    paddingHorizontal: hp(1.5),
    height: hp(6),
    justifyContent: 'center',
  },
  inputName: {
    fontSize: hp(2.2),
    color: 'black',
  },

  // date
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(3),
  },
  dateBox: {
    height: hp(6),
    backgroundColor: '#00B4BF66',
    borderRadius: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: hp(2.4),
    fontWeight: '600',
    color: 'black',
    paddingHorizontal: hp(1),
  },

  // button
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
