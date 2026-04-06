import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupPushNotifications() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  await scheduleMealNotifications();
}

async function scheduleMealNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Next day reminder at 9:00 PM
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Eating tomorrow? 🌱",
      body: "Check in now and save food!",
      sound: true,
    },
    trigger: {
      hour: 21,
      minute: 0,
      repeats: true,
    },
  });

  // Breakfast reminder at 7:00 AM
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Breakfast is ready! 🥞",
      body: "Scanning your ID will mark you present.",
      sound: true,
    },
    trigger: {
      hour: 7,
      minute: 0,
      repeats: true,
    },
  });

  // Lunch reminder at 12:00 PM
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Lunch time! 🍛",
      body: "Enjoy your meal.",
      sound: true,
    },
    trigger: {
      hour: 12,
      minute: 0,
      repeats: true,
    },
  });

  // Dinner reminder at 6:30 PM
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Dinner time! 🍲",
      body: "Grab your food.",
      sound: true,
    },
    trigger: {
      hour: 18,
      minute: 30,
      repeats: true,
    },
  });
}
