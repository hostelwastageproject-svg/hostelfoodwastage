import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, globalStyles, SIZES } from '../theme';
import { User, Mail, Shield, LogOut } from 'lucide-react-native';

export default function ProfileScreen({ navigation }) {
  const profileDetails = [
    { label: 'Name', value: 'Rahul Sharma', icon: User },
    { label: 'Email', value: 'rahul.s@student.edu', icon: Mail },
    { label: 'Registration No', value: 'REG-2024-089', icon: Shield },
  ];

  const handleLogout = () => {
    // Clear tokens here in the future
    navigation.replace('Login');
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView contentContainerStyle={{ padding: SIZES.padding }}>
        
        <View style={{ alignItems: 'center', marginVertical: 32 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.lightGreen, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 36, fontFamily: 'Inter_700Bold', color: COLORS.primary }}>R</Text>
          </View>
          <Text style={{ fontSize: 24, fontFamily: 'Inter_700Bold', color: COLORS.textPrimary }}>Rahul Sharma</Text>
          <Text style={{ fontSize: 16, fontFamily: 'Inter_400Regular', color: COLORS.textSecondary }}>CS Dept, Year 2</Text>
        </View>

        <View style={globalStyles.card}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, marginBottom: 16 }}>Personal Info</Text>
          
          {profileDetails.map((detail, index) => {
            const IconComponent = detail.icon;
            return (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 12, borderBottomWidth: index === profileDetails.length - 1 ? 0 : 1, borderBottomColor: COLORS.border }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lightGreen, justifyContent: 'center', alignItems: 'center' }}>
                  <IconComponent color={COLORS.primary} size={20} />
                </View>
                <View>
                  <Text style={{ fontSize: 13, fontFamily: 'Inter_500Medium', color: COLORS.textSecondary }}>{detail.label}</Text>
                  <Text style={{ fontSize: 16, fontFamily: 'Inter_500Medium', color: COLORS.textPrimary }}>{detail.value}</Text>
                </View>
              </View>
            )
          })}
        </View>

        <TouchableOpacity 
          style={[globalStyles.card, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }]}
          onPress={handleLogout}
        >
          <LogOut color={COLORS.error} size={20} />
          <Text style={{ fontFamily: 'Inter_600SemiBold', color: COLORS.error, fontSize: 16 }}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
