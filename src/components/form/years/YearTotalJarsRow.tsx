import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface YearTotalJarsRowProps {
  totalJarsCurrentYear: number;
  selectedYear: string;
}

const YearTotalJarsRow = ({ totalJarsCurrentYear, selectedYear }: YearTotalJarsRowProps) => {
  return (
    <View style={localStyles.container}>
      <View style={localStyles.timeRow}>
        <Text style={localStyles.timeTitle}>К-ть банок за рік {selectedYear}:</Text>
        <View style={localStyles.bigIconContainer}>
          <Text style={localStyles.timeTitle}>{totalJarsCurrentYear}</Text>
        </View>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    marginTop: hp(4), 
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default YearTotalJarsRow;
