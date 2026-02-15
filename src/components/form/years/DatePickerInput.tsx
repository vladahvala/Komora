import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Props = {
  label: string;
  date: Date;
  onChange: (date: Date) => void;
};

const DatePickerInline: React.FC<Props> = ({ label, date, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}
    </View>
  );
};

export default DatePickerInline;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(3),
  },
  label: {
    fontSize: hp(2.8),
    fontWeight: '600',
    color: 'black',
  },
  dateButton: {
    flex: 1,
    marginLeft: hp(2),
    height: hp(6),
    backgroundColor: '#00B4BF66',
    borderRadius: hp(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: hp(1),
  },
  dateText: {
    fontSize: hp(2.4),
    fontWeight: '600',
    color: 'black',
  },
});
