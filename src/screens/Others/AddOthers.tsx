import React from 'react';
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
import AnimatedButton from '../../animations/AnimatedButton';
import FormHeaderWithImage from '../../components/form/common/FormHeaderWithImage';
import LabeledInput from '../../components/form/common/LabeledInput';
import DatePickerInput from '../../components/form/years/DatePickerInput';
import { useOthersForm } from '../../hooks/Others/useOthersForm';

const AddOthers = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {
    // form fields
    imageUri,
    setImageUri,
    name,
    setName,
    packsCount,
    setPacksCount,

    // date
    date,
    setDate,

    // modal alerts
    modalVisible,
    setModalVisible,
    modalMessage,

    // actions
    handleAddOther,
  } = useOthersForm(() => navigation.goBack()); // onFinish = goBack

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
            <LabeledInput label="Кількість упаковок/пляшок/банок" value={packsCount} onChangeText={setPacksCount} />

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
  // container
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
