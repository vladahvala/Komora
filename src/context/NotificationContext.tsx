// NotificationContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Ctx = {
  showPopup: (message: string) => void;
};

const NotificationContext = createContext<Ctx>({
  showPopup: () => {},
});

export const usePopup = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: any) => {
  const [message, setMessage] = useState<string | null>(null);

  const showPopup = (msg: string) => {
    setMessage(msg);

    setTimeout(() => {
      setMessage(null);
    }, 2500);
  };

  return (
    <NotificationContext.Provider value={{ showPopup }}>
      {children}

      {message && (
        <View style={styles.popup}>
          <Text style={styles.text}>{message}</Text>
        </View>
      )}
    </NotificationContext.Provider>
  );
};

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#00B4BF',
    padding: 15,
    borderRadius: 12,
    zIndex: 9999,
  },
  text: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});