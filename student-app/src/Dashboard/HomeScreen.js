import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { COLORS, globalStyles, SIZES, SHADOWS } from '../theme';
import { Utensils, QrCode, FileText, Bell, MessageSquareWarning, CalendarClock, MessageCircle, Heart, Star } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';export default function HomeScreen({ navigation }) {
  const [studentName, setStudentName] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const details = await AsyncStorage.getItem('studentDetails');
      const token = await AsyncStorage.getItem('studentToken');
      if (details && token) {
        const parsed = JSON.parse(details);
        setStudentName(parsed.name.split(' ')[0]); // Get first name
        
        try {
          const res = await axios.get(`http://10.72.224.188:5000/api/student-stats/dashboard?student_id=${parsed.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data) setStats(res.data);
        } catch (error) {
          console.error("Dashboard fetch error:", error);
        }
      }
    };
    loadProfile();
  }, []);

  const cards = [
    { title: 'Daily Check-in', icon: Utensils, screen: 'Checkin' },
    { title: 'My Digital ID', icon: QrCode, screen: 'Barcode' },
    { title: 'Meal Feedback', icon: Star, screen: 'Feedback' },
    { title: 'Menu', icon: FileText, screen: 'Menu' },
    { title: 'Notices', icon: Bell, screen: 'Notices' },
    { title: 'Complaints', icon: MessageSquareWarning, screen: 'Complaint' },
  ];

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView contentContainerStyle={{ padding: SIZES.padding }}>
        
        {/* Top Section */}
        <View style={{ marginBottom: 16, marginTop: 12 }}>
          <Text style={{ fontSize: SIZES.baseFont, fontFamily: 'Inter_500Medium', color: COLORS.textSecondary }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
          <Text style={{ fontSize: 24, fontFamily: 'Inter_700Bold', color: COLORS.textPrimary, marginTop: 4 }}>
            Welcome, {studentName || 'Student'}! 👋
          </Text>
        </View>

        {/* Social Pressure Banner */}
        <View style={{
          backgroundColor: '#E8F5E9',
          padding: 16,
          borderRadius: SIZES.radius,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#C8E6C9',
          ...SHADOWS.soft
        }}>
           <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#2E7D32', marginBottom: 4 }}>
             Yesterday {stats ? stats.hostelStats?.checkinPercentage || 0 : '...'}% of students checked in.
           </Text>
           <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#388E3C' }}>
             Kitchen wasted {stats ? stats.hostelStats?.savedFoodKg || 0 : '...'} kg less food. Great job! 🎉
           </Text>
        </View>

        {/* Individual Streak Banner */}
        <View style={{
          backgroundColor: '#FFF3E0',
          padding: 16,
          borderRadius: SIZES.radius,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: '#FFE0B2',
          flexDirection: 'row',
          alignItems: 'center',
          ...SHADOWS.soft
        }}>
           <Text style={{ fontSize: 28, marginRight: 12 }}>🔥</Text>
           <View style={{ flex: 1 }}>
             <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#E65100', marginBottom: 2 }}>
               {stats ? stats.individualStats?.streak || 0 : '...'} Day Streak!
             </Text>
             <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#EF6C00' }}>
               Your input helped save {stats ? stats.individualStats?.savedByMe || 0 : '...'} kg of food 🌱
             </Text>
           </View>
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
