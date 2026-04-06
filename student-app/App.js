import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Font from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Home, Utensils, QrCode, User } from 'lucide-react-native';

import { COLORS } from './src/theme';

import LoginScreen from './src/Auth/LoginScreen';
import HomeScreen from './src/Dashboard/HomeScreen';
import CheckinScreen from './src/Booking/CheckinScreen';
import BarcodeScreen from './src/Barcode/BarcodeScreen';
import ProfileScreen from './src/Profile/ProfileScreen';
import ComplaintScreen from './src/Complaint/ComplaintScreen';
import FeedbackScreen from './src/Feedback/FeedbackScreen';

import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: COLORS.white, elevation: 0, shadowOpacity: 0 },
        headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: COLORS.textPrimary },
        headerTitleAlign: 'left',
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: 11, paddingBottom: 4 },
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border },
        tabBarIcon: ({ color, size }) => {
          let icon;
          if (route.name === 'Home') icon = <Home color={color} size={size} />;
          else if (route.name === 'Checkin') icon = <Utensils color={color} size={size} />;
          else if (route.name === 'Barcode') icon = <QrCode color={color} size={size} />;
          else if (route.name === 'Profile') icon = <User color={color} size={size} />;
          return icon;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Checkin" component={CheckinScreen} />
      <Tab.Screen name="Barcode" component={BarcodeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

import { setupPushNotifications } from './src/utils/notifications';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    setupPushNotifications();
    async function loadFonts() {
      await Font.loadAsync({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        {/* Screens accessible from Home but outside primary tab logic */}
        <Stack.Screen name="Complaint" component={ComplaintScreen} options={{ headerShown: true, title: 'Complaints', headerTitleStyle: { fontFamily: 'Inter_600SemiBold' } }} />
        <Stack.Screen name="Menu" component={HomeScreen} options={{ headerShown: true, title: 'Menu PDF (Mock)' }} />
        <Stack.Screen name="Notices" component={HomeScreen} options={{ headerShown: true, title: 'Notice Board (Mock)' }} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ headerShown: true, title: 'Meal Feedback' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
