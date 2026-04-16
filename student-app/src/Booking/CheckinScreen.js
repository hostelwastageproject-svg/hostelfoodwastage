import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { COLORS, globalStyles, SIZES, SHADOWS } from '../theme';
import { CheckCircle, XCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function CheckinScreen() {
  const [mealType, setMealType] = useState('lunch');
  const [status, setStatus] = useState(null); // 'confirmed' | 'opted_out'
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Daily Check-in Logic
  const handleCheckin = async (selectedStatus) => {
    setLoading(true);
    try {
      const details = await AsyncStorage.getItem('studentDetails');
      const token = await AsyncStorage.getItem('studentToken');
      
      if (!details || !token) {
        Alert.alert('Error', 'Please login first');
        return;
      }
      
      const parsed = JSON.parse(details);
      
      const res = await axios.post('http://10.72.224.188:5000/api/checkin', {
        student_id: parsed.id,
        meal_type: mealType,
        date: new Date().toISOString().split('T')[0], // Tomorrow's date? Wait, usually we send today's string and server offsets or we calculate tomorrow. Let's send tomorrow.
        // ACTUALLY the server handles date logic or takes what we pass. The prompt says "Are you eating tomorrow?". Let's send Tomorrow's date:
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        status: selectedStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStatus(selectedStatus);
      setSuccessMsg(selectedStatus === 'confirmed' ? "You're checked in! 🍽️" : "You've opted out. Thanks for saving food! 🌱");
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to check in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView contentContainerStyle={{ padding: SIZES.padding }}>
        
        {/* Header */}
        <View style={{ marginBottom: 24, marginTop: 12 }}>
          <Text style={{ fontSize: 24, fontFamily: 'Inter_700Bold', color: COLORS.textPrimary }}>
            Daily Check-in
          </Text>
          <Text style={{ fontSize: SIZES.baseFont, fontFamily: 'Inter_400Regular', color: COLORS.textSecondary, marginTop: 4 }}>
            Are you eating tomorrow? Let the kitchen know!
          </Text>
        </View>

        {/* Meal Type Selection */}
        <View style={[globalStyles.card, { marginBottom: 20 }]}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', marginBottom: 16, fontSize: 16 }}>Select Meal</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['breakfast', 'lunch', 'dinner'].map((meal) => (
              <TouchableOpacity 
                key={meal}
                style={{
                  flex: 1, padding: 12, borderRadius: SIZES.radius, alignItems: 'center',
                  backgroundColor: mealType === meal ? COLORS.primary : COLORS.background,
                  borderWidth: 1, borderColor: mealType === meal ? COLORS.primary : COLORS.border,
                  ...SHADOWS.soft
                }}
                onPress={() => setMealType(meal)}
              >
                <Text style={{ 
                  fontFamily: 'Inter_600SemiBold', textTransform: 'capitalize',
                  color: mealType === meal ? COLORS.white : COLORS.textSecondary 
                }}>
                  {meal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Check-in Decision */}
        <View style={[globalStyles.card, { alignItems: 'center', paddingVertical: 32 }]}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, marginBottom: 24 }}>
            Will you have {mealType} tomorrow?
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 16, width: '100%' }}>
            <TouchableOpacity 
              style={{
                flex: 1, padding: 16, borderRadius: SIZES.radius, alignItems: 'center',
                backgroundColor: COLORS.lightGreen,
                borderWidth: 2, borderColor: COLORS.primary
              }}
              onPress={() => handleCheckin('confirmed')}
            >
              <CheckCircle color={COLORS.primary} size={32} style={{ marginBottom: 8 }} />
              <Text style={{ fontFamily: 'Inter_700Bold', color: COLORS.primary }}>YES, I'M EATING</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{
                flex: 1, padding: 16, borderRadius: SIZES.radius, alignItems: 'center',
                backgroundColor: '#FFEbee',
                borderWidth: 2, borderColor: COLORS.error
              }}
              onPress={() => handleCheckin('opted_out')}
            >
              <XCircle color={COLORS.error} size={32} style={{ marginBottom: 8 }} />
              <Text style={{ fontFamily: 'Inter_700Bold', color: COLORS.error }}>NO, I'M OUT</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Validation / Success Messages */}
        {successMsg !== '' && (
          <View style={{ 
            marginTop: 24, 
            backgroundColor: status === 'confirmed' ? COLORS.lightGreen : '#E8F5E9', 
            padding: 16, borderRadius: SIZES.radius, flexDirection: 'row', alignItems: 'center', gap: 12 
          }}>
            {status === 'confirmed' ? <CheckCircle color={COLORS.primary} size={24} /> : <CheckCircle color="#2E7D32" size={24} />}
            <Text style={{ fontFamily: 'Inter_600SemiBold', color: status === 'confirmed' ? COLORS.primary : '#2E7D32', flex: 1 }}>
              {successMsg}
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
