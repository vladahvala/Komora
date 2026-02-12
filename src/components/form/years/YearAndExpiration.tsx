import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import YearPicker from './YearPicker';

interface YearAndExpirationProps {
    selectedYear: string;
    onYearChange: (year: string) => void;
    years: string[];
    expirationYear: number | null;
    isExpired: boolean;
  }
  
  const YearAndExpiration = ({
    selectedYear,
    onYearChange,
    years,
    expirationYear,
    isExpired
  }: YearAndExpirationProps) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
  
    return (
      <View style={{ marginTop: hp(2) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.timeTitle, { marginRight: hp(2) }]}>Обрати рік:</Text>
          <YearPicker
            selectedYear={selectedYear}
            onSelect={onYearChange}
            isOpen={dropdownVisible}
            onToggle={() => setDropdownVisible(prev => !prev)}
            onClose={() => setDropdownVisible(false)}
            years={years}
          />
        </View>
        {expirationYear && (
          <View style={[styles.expirationRow, { marginTop: hp(2) }]}>
            <Text style={[styles.timeTitle, { marginRight: hp(2) }]}>
              Термін{'\n'}придатності{'\n'}дійсний до:
            </Text>
            {isExpired ? (
              <Text style={[styles.timeTitleExpired, { color: 'red', textAlign: 'center' }]}>
                Прострочено{'\n'}({expirationYear})
              </Text>
            ) : (
              <View style={styles.bigIconContainer}>
                <Text style={styles.timeTitle}>{expirationYear}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };
  export default YearAndExpiration;

  
const styles = StyleSheet.create({
    timeTitle: {
        fontSize: hp(3), 
        fontWeight: '600', 
        color: 'black', 
    },
    expirationRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },  
        timeTitleExpired: {
        fontSize: hp(2.5), 
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
  });
  