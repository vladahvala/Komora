import notifee, { AndroidImportance } from '@notifee/react-native';

export const configureNotifications = async () => {
  await notifee.createChannel({
    id: 'conservations-channel',
    name: 'Conservations',
    importance: AndroidImportance.HIGH,
    vibration: true,
    lights: true,
    sound: 'default',
  });
   
    await notifee.requestPermission();
};

export const sendExpirationNotification = async (name: string) => {
  const notification = await notifee.displayNotification({
    title: 'Термін придатності',
    body: `Консервація "${name}" просрочена!`,
    android: {
      channelId: 'conservations-channel',
      smallIcon: 'ic_notification',
      color: '#00B4BF',
      pressAction: {
        id: 'default',
      },
    },
  });
};
