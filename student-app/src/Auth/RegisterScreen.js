import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { COLORS, globalStyles, SIZES, SHADOWS } from '../theme';
import { Utensils } from 'lucide-react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://10.72.224.188:5000/api/students/register', {
        name,
        email,
        password
      });

      if (res.data) {
        Alert.alert('Success', 'Registration successful! You can now login.');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: 'center', padding: SIZES.padding }}
      >
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.lightGreen, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
             <Utensils color={COLORS.primary} size={40} />
          </View>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 28, color: COLORS.textPrimary }}>Create Account</Text>
          <Text style={{ fontFamily: 'Inter_400Regular', color: COLORS.textSecondary, marginTop: 8 }}>Join the zero-waste initiative 🌱</Text>
        </View>

        <View style={globalStyles.card}>
          <View style={{ gap: 16 }}>
            <TextInput
              style={globalStyles.input}
              placeholder="Full Name"
              placeholderTextColor={COLORS.textSecondary}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={globalStyles.input}
              placeholder="KLU Email (e.g. 210003@klu.ac.in)"
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
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={globalStyles.buttonText}>{loading ? 'Registering...' : 'Sign Up'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{ alignItems: 'center', marginTop: 24 }}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ fontFamily: 'Inter_500Medium', color: COLORS.primary, fontSize: 14 }}>
                Already have an account? Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
