import React from 'react';
import { View, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import JarNumCard from '../../CardsInCards/JarNumCard';

type JarCounts = {
  jar2_3l: number;
  jar4_2l: number;
  jar7_15l: number;
  jar2_1l: number;
  jar1_05l: number;
};

type Props = {
  jarCounts: JarCounts;
  setJarCounts: React.Dispatch<React.SetStateAction<JarCounts>>;
};

const jarTypes = [
  { key: 'jar2_3l', label: '2', circleLabel: '3л' },
  { key: 'jar4_2l', label: '4', circleLabel: '2л' },
  { key: 'jar7_15l', label: '7', circleLabel: '1.5л' },
  { key: 'jar2_1l', label: '2', circleLabel: '1л' },
  { key: 'jar1_05l', label: '1', circleLabel: '0.5л' },
];

const JarColumn: React.FC<Props> = ({ jarCounts, setJarCounts }) => {
  return (
    <View style={styles.column}>
      {jarTypes.map(({ key, label, circleLabel }) => (
        <JarNumCard
          key={key}
          image={require('../../../assets/jar_icons/empty_jar.png')}
          label={label}
          circleLabel={circleLabel}
          count={jarCounts[key]}
          onChange={newCount =>
            setJarCounts(prev => ({ ...prev, [key]: newCount }))
          }
          style={{ marginBottom: hp(4) }}
        />
      ))}
    </View>
  );
};

export default JarColumn;

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: hp(4),
  },
});
