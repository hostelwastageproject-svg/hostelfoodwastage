import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { COLORS, globalStyles, SIZES, SHADOWS } from '../theme';
import { Utensils, QrCode, FileText, Bell, MessageSquareWarning, CalendarClock } from 'lucide-react-native';

export default function HomeScreen({ navigation }) {
  const cards = [
    { title: 'Book Meal', icon: Utensils, screen: 'Booking' },
    { title: 'My Barcode', icon: QrCode, screen: 'Barcode' },
    { title: 'Menu', icon: FileText, screen: 'Menu' },
    { title: 'Notices', icon: Bell, screen: 'Notices' },
    { title: 'Complaints', icon: MessageSquareWarning, screen: 'Complaint' },
    { title: 'My Bookings', icon: CalendarClock, screen: 'MyBookings' },
  ];

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView contentContainerStyle={{ padding: SIZES.padding }}>
        
        {/* Top Section */}
        <View style={{ marginBottom: 24, marginTop: 12 }}>
          <Text style={{ fontSize: SIZES.baseFont, fontFamily: 'Inter_500Medium', color: COLORS.textSecondary }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
          <Text style={{ fontSize: 24, fontFamily: 'Inter_700Bold', color: COLORS.textPrimary, marginTop: 4 }}>
            Welcome, Rahul! 👋
          </Text>
        </View>

        {/* Main Section (Card Layout - 2 per row) */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {cards.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity 
                key={index} 
                style={{
                  width: '48%',
                  backgroundColor: COLORS.white,
                  borderRadius: SIZES.radius,
                  padding: SIZES.padding,
                  alignItems: 'center',
                  marginBottom: 16,
                  ...SHADOWS.soft
                }}
                onPress={() => item.screen && navigation.navigate(item.screen)}
              >
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.lightGreen, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <IconComponent color={COLORS.primary} size={24} />
                </View>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textPrimary, textAlign: 'center' }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
