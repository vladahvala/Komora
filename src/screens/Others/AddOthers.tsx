import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import AlertModal from '../../modals/AlertModal';
import { OthersContext } from '../../context/OthersContext';
import AnimatedButton from '../../animations/AnimatedButton';
import FormHeaderWithImage from '../../components/form/AddItemHeader';
import LabeledInput from '../../components/form/LabeledInput';
import DatePickerInput from '../../components/form/years/DatePickerInput';

const AddOthers = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { addOther } = useContext(OthersContext);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [packsCount, setPacksCount] = useState('');
  const [date, setDate] = useState(new Date());

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

            <FormHeaderWithImage
              title="Новий продукт"
              imageUri={imageUri}
              setImageUri={setImageUri}
              onBack={() => navigation.navigate('MainMenu')}
            />

            {/* NAME INPUT */}
            <LabeledInput label="Назва" value={name} onChangeText={setName} />

            {/* PACKS COUNT INPUT */}
            <LabeledInput label="Кількість упаковок/пляшок/банок" value={name} onChangeText={setName} />

            {/* DATE */}
            <DatePickerInput
              label="Час купівлі:"
              date={date}
              onChange={setDate}
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
