import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Image, Alert, ActivityIndicator } from 'react-native';
import { COLORS, globalStyles, SIZES, SHADOWS } from '../theme';
import { Camera, CheckCircle, Star } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

export default function FeedbackScreen() {
  const [mealType, setMealType] = useState('lunch');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleFeedback = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating (1-5 stars)');
      return;
    }

    setLoading(true);
    try {
      const details = await AsyncStorage.getItem('studentDetails');
      const token = await AsyncStorage.getItem('studentToken');
      
      if (!details || !token) {
         Alert.alert('Error', 'Please login first');
         return;
      }
      
      const parsed = JSON.parse(details);
      
      const formData = new FormData();
      formData.append('student_id', parsed.id);
      formData.append('meal_type', mealType);
      formData.append('rating', rating);
      
      if (image) {
         let localUri = image;
         let filename = localUri.split('/').pop();
         let match = /\.(\w+)$/.exec(filename);
         let type = match ? `image/${match[1]}` : `image`;
         
         if (Platform.OS === 'web') {
             // Fetch blob if web platform since local file paths don't work the same in FormData
             const response = await fetch(localUri);
             const blob = await response.blob();
             formData.append('photo', blob, 'upload.jpg');
         } else {
             formData.append('photo', { uri: localUri, name: filename, type });
         }
      }

      await axios.post('http://10.72.224.188:5000/api/feedback', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setRating(0);
        setImage(null);
      }, 4000);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit feedback');
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
            Meal Feedback
          </Text>
          <Text style={{ fontSize: SIZES.baseFont, fontFamily: 'Inter_400Regular', color: COLORS.textSecondary, marginTop: 4 }}>
            Rate your meal to help improve food quality.
          </Text>
        </View>

        {/* Meal Selection */}
        <View style={[globalStyles.card, { marginBottom: 20 }]}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', marginBottom: 16 }}>Which meal are you rating?</Text>
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

        {/* Star Rating */}
        <View style={[globalStyles.card, { alignItems: 'center', paddingVertical: 24 }]}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, marginBottom: 16 }}>
            Tap a star to rate
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Star 
                  fill={rating >= star ? '#FFCA28' : 'transparent'} 
                  color={rating >= star ? '#FFCA28' : '#BDBDBD'} 
                  size={36} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Photo Upload */}
        <View style={[globalStyles.card, { marginTop: 20, alignItems: 'center' }]}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', marginBottom: 16 }}>
            Upload a Photo (Optional)
          </Text>
          <TouchableOpacity 
            style={{
              width: '100%', height: 120, borderRadius: SIZES.radius,
              backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center',
              borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed'
            }}
            onPress={pickImage}
          >
            {image ? (
              <Image source={{ uri: image }} style={{ width: '100%', height: '100%', borderRadius: SIZES.radius }} />
            ) : (
              <>
                <Camera color={COLORS.textSecondary} size={32} style={{ marginBottom: 8 }} />
                <Text style={{ fontFamily: 'Inter_500Medium', color: COLORS.textSecondary }}>Tap to Upload Image</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <TouchableOpacity 
          style={[globalStyles.buttonPrimary, { marginTop: 24, opacity: rating === 0 ? 0.6 : 1 }]} 
          onPress={handleFeedback}
          disabled={rating === 0}
        >
          <Text style={globalStyles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>

        {success && (
          <View style={{ marginTop: 24, backgroundColor: COLORS.lightGreen, padding: 16, borderRadius: SIZES.radius, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <CheckCircle color={COLORS.primary} size={24} />
            <Text style={{ fontFamily: 'Inter_600SemiBold', color: COLORS.primary }}>Feedback submitted! Thank you. ⭐</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
