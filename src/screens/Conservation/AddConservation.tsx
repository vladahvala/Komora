import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import JarNumCard from '../../components/JarNumCard';
import AlertModal from '../../components/AlertModal';
import { launchImageLibrary } from 'react-native-image-picker';

const AddConservation = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // image field
  const [imageUri, setImageUri] = useState<string | null>(null);

  // name field
  const [name, setName] = useState('');
  // active 
  const [isNameFocused, setIsNameFocused] = useState(false);

  // active category field
  const [isCategoryFocused, setIsCategoryFocused] = useState(false);

  // categories dropdown menu
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // category list
  const categories = ['Мариновані', 'Солені', 'Квашені', 'Варення / Джеми', 'Компоти', 'Соуси / Кетчупи', ' Консерви в олії / жирі'];

  // years dropdown menu
  const [isYearsModalVisible, setYearsModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  // years list
  const years = ['2021', '2022', '2023', '2024', '2025', '2026'];

  // jars count
   const [jarCounts, setJarCounts] = useState({
    jar2_3l: 0,
    jar4_2l: 0,
    jar7_15l: 0,
    jar2_1l: 0,
    jar1_05l: 0,
  });

  // alerts 
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleAddConservation = () => {
    if (!name) {
      setModalMessage('Введіть назву консервації!');
      setModalVisible(true);
      return;
    }
    if (!selectedCategory) {
      setModalMessage('Оберіть категорію!');
      setModalVisible(true);
      return;
    }

    const totalJars = Object.values(jarCounts).reduce((sum, val) => sum + val, 0);
    if (totalJars === 0) {
      setModalMessage('Додайте хоча б одну банку!');
      setModalVisible(true);
      return;
    }
  };

  return (
    // MAIN CONTAINER
    <SafeAreaProvider style={styles.container}>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          setCategoryModalVisible(false);
          setYearsModalVisible(false);
        }}        
        pointerEvents="box-none" // allows pressing buttons
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            {/* ARROW TO MAIN MENU */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('MainMenu')} 
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
            <Text style={styles.menuTitle}>Нова консервація</Text>

            <View style={{ marginTop: hp(2) }}>
              <Text style={styles.label}>Фото консервації</Text>
              <Pressable
                style={[styles.imagePicker, { borderColor: imageUri ? '#00B4BF' : '#AEAEAE' }]}
                onPress={() => {
                  launchImageLibrary(
                    { mediaType: 'photo', quality: 0.7 },
                    (response) => {
                      if (response.assets && response.assets.length > 0) {
                        setImageUri(response.assets[0].uri);
                      }
                    }
                  );
                }}
              >
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                ) : (
                  <Text style={styles.imagePickerText}>Оберіть фото</Text>
                )}
              </Pressable>
            </View>

            {/* FIRST INPUT WITH LABEL */}
            <View style={{ marginTop: hp(2) }}>
              <Text style={styles.label}>Назва</Text>
              <View style={[
                styles.searchContainer,
                { borderColor: isNameFocused ? '#00B4BF' : '#AEAEAE' }
              ]}>
                <TextInput
                  value={name}                 
                  onChangeText={text => setName(text)}
                  style={styles.searchInput}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                />
              </View>
            </View>

            {/* CATEGORIES INPUT WITH DROPDOWN */}
            <View style={{ marginTop: hp(2) }}>
              <Text style={styles.label}>Категорія</Text>
              <Pressable
                onPress={() => {
                  setCategoryModalVisible(prev => !prev);
                  setYearsModalVisible(false); 
                }}
                style={[
                  styles.searchContainer,
                  { borderColor: isCategoryFocused ? '#00B4BF' : '#AEAEAE' }
                ]}
              >
                <Text style={styles.searchInput}>
                  {selectedCategory || 'Оберіть категорію'}
                </Text>
                <Image
                  source={require('../../../assets/icons/frame_down.png')}
                  style={styles.arrowDownIcon}
                />
              </Pressable>

              {/* Dropdown */}
              {isCategoryModalVisible && (
                <View style={styles.catdropdownContainer}>
                  {categories.map((cat, index) => (
                    <Pressable
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedCategory(cat);
                        setCategoryModalVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{cat}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* CONSERVATION TIME */}
            <View style={styles.timeRow}> 
              <Text style={styles.timeTitle}>Час консервації:</Text>
              <View style={styles.yearDropdownWrapper}>
                <Pressable
                  style={styles.bigIconContainer}
                  onPress={() => {
                    setYearsModalVisible(prev => !prev);
                    setCategoryModalVisible(false); 
                  }}
                >
                  <Text style={styles.timeTitle}>{selectedYear || '2021'}</Text>
                  <Image
                    source={require('../../../assets/icons/frame_down.png')}
                    style={styles.arrowDownIcon}
                  />
                </Pressable>

                {/* Dropdown */}
                {isYearsModalVisible && (
                  <View style={styles.yearsDropdownContainer}>
                    {years.map((year, index) => (
                      <Pressable
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedYear(year);
                          setYearsModalVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{year}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* JAR NUM */}
            <Text style={styles.jarNumTitle}>Кількість банок</Text>

            <View style={styles.leftCol}>
              {/* LEFT COLUMN 3 CARDS */}
              <View style={{ paddingHorizontal: hp(3.2), justifyContent: 'flex-start' }}>
                <View style={{ justifyContent: 'flex-start' }}>
                  <JarNumCard 
                    image={require('../../../assets/jar_icons/empty_jar.png')} 
                    style={{ marginBottom: hp(4) }} 
                    label="2"             // card center text 
                    circleLabel="3л"        // text in jar
                    count={jarCounts.jar2_3l}
                    onChange={(newCount) => setJarCounts(prev => ({ ...prev, jar2_3l: newCount }))}
                  />
                  <JarNumCard 
                    image={require('../../../assets/jar_icons/empty_jar.png')}
                    style={{ marginBottom: hp(4) }}
                    label="4" 
                    circleLabel={'2л'}  
                    count={jarCounts.jar4_2l}
                    onChange={(newCount) => setJarCounts(prev => ({ ...prev, jar4_2l: newCount }))}
                  />
                  <JarNumCard 
                    image={require('../../../assets/jar_icons/empty_jar.png')}
                    label="7" 
                    style={undefined} 
                    circleLabel={'1.5л'}
                    count={jarCounts.jar7_15l}
                    onChange={(newCount) => setJarCounts(prev => ({ ...prev, jar7_15l: newCount }))}
                  />
                </View>
              </View>

              {/* RIGHT COLUMN 2 CARDS */}
              <View style={{ justifyContent: 'center' }}>
                <JarNumCard 
                  image={require('../../../assets/jar_icons/empty_jar.png')} 
                  style={{ marginBottom: hp(4) }} 
                  label={2} 
                  circleLabel={'1л'} 
                  count={jarCounts.jar2_1l}
                  onChange={(newCount) => setJarCounts(prev => ({ ...prev, jar2_1l: newCount }))}
                />
                <JarNumCard 
                  image={require('../../../assets/jar_icons/empty_jar.png')} 
                  style={undefined} 
                  label={1} 
                  circleLabel={'0.5л'} 
                  count={jarCounts.jar1_05l}
                  onChange={(newCount) => setJarCounts(prev => ({ ...prev, jar1_05l: newCount }))}
                />
              </View>
            </View>

            {/* ALERTS MODALS (required fields empty) */}
            <AlertModal
              visible={modalVisible}
              message={modalMessage}
              onClose={() => setModalVisible(false)}
            />

            {/* ADD CONSERVATION BUTTON */}
            <Pressable style={styles.addButton} onPress={handleAddConservation}>
              <Text style={styles.addButtonText}>Додати консервацію</Text>
            </Pressable>

          </View>
        </ScrollView>
      </Pressable>
    </SafeAreaProvider>
  );
};

export default AddConservation;

const styles = StyleSheet.create({
  // main cintainer
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
    paddingHorizontal: hp(1), 
  },

  // arrow styles
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

  // title text
  menuTitle: { 
    fontSize: hp(3.5), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'center',
  },

  // image field
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

  // input fields
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
  searchInput: {
    flex: 1,
    fontSize: hp(2.2),
    color: '#000',
  },

  // DROPDOWNS
  // categories
  catdropdownContainer: {
    position: 'absolute',  
    top: hp(10),            
    width: '100%',
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#AEAEAE',
    borderRadius: hp(1.5),
    zIndex: 100,            
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,         
  },
  // years
  yearDropdownWrapper: {
    position: 'relative', 
    flex: 1,
  },
  yearsDropdownContainer: {
    position: 'absolute',
    marginLeft: hp(2), 
    marginTop: hp(0.5), 
    top: '100%',         
    left: 0,
    width: '90%',          
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#AEAEAE',
    borderRadius: hp(1.5),
    zIndex: 100,
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

  // time row styles
  timeRow: {
    flexDirection: 'row',     
    alignItems: 'center', 
    marginTop: hp(3),
    position: 'relative',    
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
  arrowDownIcon: {
    width: hp(2.5),
    height: hp(2.5),
    resizeMode: 'contain',
    marginLeft: hp(1), 
  },

  // jar num title 
  jarNumTitle: {
    fontSize: hp(3.5), 
    fontWeight: '600', 
    color: 'black', 
    textAlign: 'center', 
    marginTop: hp(3),  
  },

  // left column
  leftCol: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: hp(4) 
  },

  // button styles
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
