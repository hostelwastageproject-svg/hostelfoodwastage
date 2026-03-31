import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { COLORS, globalStyles, SIZES } from '../theme';
import { CheckCircle } from 'lucide-react-native';

export default function BookingScreen() {
  const [mealType, setMealType] = useState('lunch');
  const [pref, setPref] = useState('veg');
  const [success, setSuccess] = useState(false);

  // Quick UI mock for booking per constraints
  const handleBooking = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView contentContainerStyle={{ padding: SIZES.padding }}>
        
        {/* Date Placeholder */}
        <View style={globalStyles.card}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', marginBottom: 8 }}>Select Date</Text>
          <View style={[globalStyles.input, { justifyContent: 'center' }]}>
            <Text style={{ fontFamily: 'Inter_500Medium', color: COLORS.textPrimary }}>
              Tomorrow - {new Date(Date.now() + 86400000).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Meal Type Selection */}
        <View style={globalStyles.card}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', marginBottom: 12 }}>Select Meal</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['breakfast', 'lunch', 'dinner'].map((meal) => (
              <TouchableOpacity 
                key={meal}
                style={{
                  flex: 1, padding: 12, borderRadius: SIZES.radius, alignItems: 'center',
                  backgroundColor: mealType === meal ? COLORS.primary : COLORS.background,
                  borderWidth: 1, borderColor: mealType === meal ? COLORS.primary : COLORS.border
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

        {/* Veg/Non-Veg Toggle */}
        <View style={globalStyles.card}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', marginBottom: 12 }}>Food Preference</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity 
              style={{
                flex: 1, padding: 12, borderRadius: SIZES.radius, alignItems: 'center',
                backgroundColor: pref === 'veg' ? COLORS.secondary : COLORS.background,
              }}
              onPress={() => setPref('veg')}
            >
              <Text style={{ fontFamily: 'Inter_600SemiBold', color: pref === 'veg' ? COLORS.white : COLORS.textPrimary }}>PURE VEG</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{
                flex: 1, padding: 12, borderRadius: SIZES.radius, alignItems: 'center',
                backgroundColor: pref === 'non-veg' ? COLORS.error : COLORS.background,
              }}
              onPress={() => setPref('non-veg')}
            >
              <Text style={{ fontFamily: 'Inter_600SemiBold', color: pref === 'non-veg' ? COLORS.white : COLORS.textPrimary }}>NON-VEG</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[globalStyles.buttonPrimary, { marginTop: 16 }]} onPress={handleBooking}>
          <Text style={globalStyles.buttonText}>Confirm Booking</Text>
        </TouchableOpacity>

        {success && (
          <View style={{ marginTop: 24, backgroundColor: COLORS.lightGreen, padding: 16, borderRadius: SIZES.radius, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <CheckCircle color={COLORS.primary} size={24} />
            <Text style={{ fontFamily: 'Inter_600SemiBold', color: COLORS.primary }}>Booking Confirmed Successfully!</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
