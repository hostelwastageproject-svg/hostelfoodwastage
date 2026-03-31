import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, globalStyles, SIZES, SHADOWS } from '../theme';
import { Utensils } from 'lucide-react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Basic mock authentication routing per constraints
    navigation.replace('MainTabs');
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
            >
              <Text style={globalStyles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ alignItems: 'center', marginTop: 24 }}>
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
