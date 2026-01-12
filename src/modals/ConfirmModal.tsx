import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface ConfirmModalProps {
    visible: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }
  
  const ConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    message,
    onConfirm,
    onCancel,
  }) => {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.alertText}>Підтвердження</Text>
            <View style={styles.separator} />
            <Text style={styles.modalText}>{message}</Text>
  
            <View style={styles.buttonsRow}>
              <Pressable style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.btnText}>Скасувати</Text>
              </Pressable>
  
              <Pressable style={styles.confirmBtn} onPress={onConfirm}>
                <Text style={styles.btnText}>Так</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
};

export default ConfirmModal;

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
        marginBottom: hp(3),
    },

    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: hp(1.5),
        marginRight: hp(1),
        backgroundColor: '#E0E0E0',
        borderRadius: hp(1),
        alignItems: 'center',
    },
    confirmBtn: {
        flex: 1,
        paddingVertical: hp(1.5),
        marginLeft: hp(1),
        backgroundColor: '#00B4BF',
        borderRadius: hp(1),
        alignItems: 'center',
    },
    btnText: {
        fontSize: hp(2.2),
        color: 'black',
        fontWeight: '600',
    },
});
  