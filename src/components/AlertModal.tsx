import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface InfoModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ visible, message, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.alertText}>Помилка!</Text>
          {/* Лінія під заголовком */}
          <View style={styles.separator} />
          <Text style={styles.modalText}>{message}</Text>
          <Pressable style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>ОК</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default InfoModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: hp(3),
    borderRadius: hp(1.5),
    width: '80%',
    alignItems: 'center',
  },
  alertText: {
    fontSize: hp(3.3),
    textAlign: 'center',
    marginBottom: hp(1),
    color: 'red',
    fontWeight: '700',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: hp(2),
  },
  modalText: {
    fontSize: hp(2.5),
    textAlign: 'center',
    marginBottom: hp(2),
  },
  modalButton: {
    paddingVertical: hp(1.5),
    paddingHorizontal: hp(3),
    backgroundColor: '#00B4BF',
    borderRadius: hp(1),
  },
  modalButtonText: {
    fontSize: hp(2.2),
    color: 'black',
    fontWeight: '600',
  },
});
