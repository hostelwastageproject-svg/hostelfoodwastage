import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { COLORS, globalStyles, SIZES, SHADOWS } from '../theme';
import { Utensils } from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      // NOTE: Using localhost because we are deploying to Web based on our plan.
      // If testing on mobile emulator, replace localhost with your machine's IP.
      const res = await axios.post('http://10.72.224.188:5000/api/students/login', {
        email,
        password
      });

      if (res.data.token) {
        await AsyncStorage.setItem('studentToken', res.data.token);
        await AsyncStorage.setItem('studentDetails', JSON.stringify(res.data.student));
        navigation.replace('MainTabs');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Check your connection.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ flex: 1, backgroundColor: COLORS.lightGreen, justifyContent: 'center', padding: 24 }}>
          
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16, ...SHADOWS.soft }}>
              <Utensils color={COLORS.white} size={40} />
            </View>
            <Text style={{ fontSize: 28, fontFamily: 'Inter_700Bold', color: COLORS.primary }}>
              Hostel Food Booking
            </Text>
            <Text style={{ fontSize: SIZES.baseFont, fontFamily: 'Inter_400Regular', color: COLORS.textSecondary, marginTop: 8 }}>
              Smart Meal Management System
            </Text>
          </View>

          <View style={globalStyles.card}>
            <TextInput
              style={globalStyles.input}
              placeholder="Email Address"
              placeholderTextColor={COLORS.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={globalStyles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />

            <TouchableOpacity 
              style={[globalStyles.buttonPrimary, { marginTop: 8 }]} 
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={globalStyles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ alignItems: 'center', marginTop: 24 }}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={{ fontFamily: 'Inter_500Medium', color: COLORS.primary, fontSize: 14 }}>
                Don't have an account? Register
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
