import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

type TotalJarsProps = {
  totalJarsAllYears: number;
  label?: string;
};

const TotalJars = ({ totalJarsAllYears, label = 'банок' }: TotalJarsProps) => {
  return (
    <View style={localStyles.container}>
      <View style={localStyles.timeRow}>
        <Text style={localStyles.timeTitle}>
          Загальна к-ть {label}:
        </Text>

        <View style={localStyles.bigIconContainer}>
          <Text style={localStyles.timeTitle}>
            {totalJarsAllYears}
          </Text>
        </View>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  timeRow: {
    flexDirection: 'row',     
    alignItems: 'center', 
    marginTop: hp(3),
    position: 'relative',    
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
});

export default TotalJars;
