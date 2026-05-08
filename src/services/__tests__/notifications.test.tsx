import notifee, { AndroidImportance } from '@notifee/react-native';
import {
  configureNotifications,
  sendExpirationNotification,
} from '../notifications';

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    createChannel: jest.fn(),
    requestPermission: jest.fn(),
    displayNotification: jest.fn(),
  },
  AndroidImportance: {
    HIGH: 4,
  },
}));

describe('notifications service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('configureNotifications creates channel and requests permission', async () => {
    await configureNotifications();

    expect(notifee.createChannel).toHaveBeenCalledWith({
      id: 'conservations-channel',
      name: 'Conservations',
      importance: AndroidImportance.HIGH,
      vibration: true,
      lights: true,
      sound: 'default',
    });

    expect(notifee.requestPermission).toHaveBeenCalled();
  });

  test('sendExpirationNotification displays notification', async () => {
    await sendExpirationNotification('Огірки');

    expect(notifee.displayNotification).toHaveBeenCalledWith({
      title: 'Термін придатності',
      body: 'Консервація "Огірки" просрочена!',
      android: {
        channelId: 'conservations-channel',
        smallIcon: 'ic_notification',
        color: '#00B4BF',
        pressAction: {
          id: 'default',
        },
      },
    });
  });
});