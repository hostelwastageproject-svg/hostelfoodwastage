import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { COLORS, globalStyles, SIZES, SHADOWS } from '../theme';
import { CheckCircle, XCircle } from 'lucide-react-native';

export default function CheckinScreen() {
  const [mealType, setMealType] = useState('lunch');
  const [status, setStatus] = useState(null); // 'confirmed' | 'opted_out'
  const [successMsg, setSuccessMsg] = useState('');

  // Daily Check-in Logic
  const handleCheckin = (selectedStatus) => {
    setStatus(selectedStatus);
    setSuccessMsg(selectedStatus === 'confirmed' ? "You're checked in! 🍽️" : "You've opted out. Thanks for saving food! 🌱");
    setTimeout(() => setSuccessMsg(''), 4000);
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
