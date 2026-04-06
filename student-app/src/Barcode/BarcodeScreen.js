import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { COLORS, globalStyles, SIZES } from '../theme';
import QRCode from 'react-native-qrcode-svg';

export default function BarcodeScreen() {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding }}>
        
        <View style={[globalStyles.card, { width: '100%', alignItems: 'center', paddingVertical: 40 }]}>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 20, marginBottom: 8, color: COLORS.primary }}>
            Digital Student ID
          </Text>
          <Text style={{ fontFamily: 'Inter_500Medium', color: COLORS.textSecondary, marginBottom: 32, textAlign: 'center' }}>
            Scan this code at the kitchen.{"\n"}Valid for all meals.
          </Text>

          {/* Actual Barcode Generator */}
          <View style={{ marginBottom: 32, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 16, elevation: 4 }}>
             <QRCode
               value="KLU210003291"
               size={200}
               color={COLORS.textPrimary}
               backgroundColor="#FFFFFF"
             />
          </View>

          <View style={{ backgroundColor: COLORS.background, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 24, letterSpacing: 4, color: COLORS.textPrimary }}>
              KLU210003291
            </Text>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}
