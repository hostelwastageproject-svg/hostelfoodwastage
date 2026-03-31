import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { COLORS, globalStyles, SIZES } from '../theme';

export default function ComplaintScreen() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setTitle(''); setDesc(''); }, 3000);
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView contentContainerStyle={{ padding: SIZES.padding }}>
        
        <View style={globalStyles.card}>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 18, marginBottom: 16 }}>Raise a Complaint</Text>
          
          <Text style={{ fontFamily: 'Inter_500Medium', marginBottom: 8, color: COLORS.textSecondary }}>Complaint Title</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="e.g. Food was cold yesterday"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={{ fontFamily: 'Inter_500Medium', marginBottom: 8, color: COLORS.textSecondary }}>Description</Text>
          <TextInput
            style={[globalStyles.input, { height: 120, textAlignVertical: 'top' }]}
            placeholder="Please describe the issue..."
            multiline={true}
            numberOfLines={4}
            value={desc}
            onChangeText={setDesc}
          />

          <TouchableOpacity style={[globalStyles.buttonPrimary, { marginTop: 8 }]} onPress={handleSubmit}>
            <Text style={globalStyles.buttonText}>Submit Complaint</Text>
          </TouchableOpacity>

          {submitted && (
            <Text style={{ textAlign: 'center', marginTop: 16, fontFamily: 'Inter_600SemiBold', color: COLORS.primary }}>
              Complaint Submitted (Pending Status)
            </Text>
          )}
        </View>

        {/* Status Badge Mock */}
        <Text style={{ fontFamily: 'Inter_600SemiBold', marginVertical: 12, marginLeft: 4 }}>Recent Complaints</Text>
        <View style={globalStyles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16 }}>Food Quality (Dinner)</Text>
            <View style={{ backgroundColor: COLORS.warning + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
              <Text style={{ color: COLORS.warning, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>Pending</Text>
            </View>
          </View>
          <Text style={{ color: COLORS.textSecondary, fontFamily: 'Inter_400Regular' }}>The rice was slightly undercooked on Tuesday night.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
