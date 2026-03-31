import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, globalStyles, SIZES } from '../theme';
import { Download } from 'lucide-react-native';

export default function BarcodeScreen() {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding }}>
        
        <View style={[globalStyles.card, { width: '100%', alignItems: 'center', paddingVertical: 40 }]}>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 20, marginBottom: 8, color: COLORS.primary }}>
            Lunch Meal Token
          </Text>
          <Text style={{ fontFamily: 'Inter_500Medium', color: COLORS.textSecondary, marginBottom: 32 }}>
            Valid for: Today, 12:30 PM - 2:00 PM
          </Text>

          {/* Placeholder for actual Barcode. Since we don't have react-native-qrcode-svg installed, mock it */}
          <View style={{ width: 200, height: 200, backgroundColor: COLORS.textPrimary, padding: 8, marginBottom: 24, justifyContent: 'center', alignItems: 'center' }}>
             <View style={{ width: '100%', height: '100%', backgroundColor: COLORS.white, padding: 16 }}>
               <View style={{ width: '100%', height: '100%', borderWidth: 16, borderStyle: 'dashed', borderColor: COLORS.textPrimary }} />
             </View>
          </View>

          <View style={{ backgroundColor: COLORS.background, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginBottom: 32 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 24, letterSpacing: 4, color: COLORS.textPrimary }}>
              TK-LUN-084
            </Text>
          </View>

          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 }}>
            <Download color={COLORS.primary} size={20} />
            <Text style={{ fontFamily: 'Inter_600SemiBold', color: COLORS.primary }}>Download Pass</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}
