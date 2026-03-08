import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, Platform, NativeModules } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Camera, Mic, MapPin, Eye } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import Voice from '@react-native-voice/voice';
import { submitReport } from '@/lib/database';

export default function ReportIssue() {
  const { t } = useLanguage();
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      if (location) {
        let addressResult = await Location.reverseGeocodeAsync(location.coords);
        if (addressResult.length > 0) {
          const { city, region, country } = addressResult[0];
          setAddress(`${city}, ${region}, ${country}`);
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web' || !Voice || !NativeModules.Voice) return;

    Voice.onSpeechStart = () => setIsRecording(true);
    Voice.onSpeechEnd = () => setIsRecording(false);
    Voice.onSpeechError = (e) => Alert.alert('Error', JSON.stringify(e.error));
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        setDescription(prev => prev + e.value[0]);
      }
    };

    return () => {
      if (Voice && typeof Voice.destroy === 'function') {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    };
  }, []);

  const startRecognizing = async () => {
    if (Platform.OS === 'web' || !Voice || typeof Voice.start !== 'function' || !NativeModules.Voice) {
      Alert.alert(
        'Voice Input Unavailable',
        'Voice recognition is not supported on this device or environment (e.g., Expo Go or simulators). Please use manual text input.'
      );
      return;
    }
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Voice start failed');
    }
  };

  const stopRecognizing = async () => {
    if (!Voice || typeof Voice.stop !== 'function') return;
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMicPress = () => {
    isRecording ? stopRecognizing() : startRecognizing();
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please describe the issue');
      return;
    }
    try {
      // NOTE: Hardcoding userId to 1 for now.
      // In a real app, you would get this from your auth context.
      await submitReport(1, description, '', photo);
      Alert.alert('Success', 'Report submitted successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while submitting the report');
    }
  };

  if (showPreview) {
    return (
      <ScrollView style={styles.container}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setShowPreview(false)}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>{t('preview')}</Text>
        </LinearGradient>

        <View style={styles.previewContainer}>
          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>Description:</Text>
            <Text style={styles.previewText}>{description}</Text>
          </View>

          {photo && (
            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>Photo:</Text>
              <Image source={{ uri: photo }} style={styles.previewImage} />
            </View>
          )}

          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>{t('location')}:</Text>
            <View style={styles.locationPreview}>
              <MapPin size={20} color="#667eea" />
              <Text style={styles.locationText}>
                {address
                  ? address
                  : locationError
                  ? locationError
                  : 'Fetching location...'}
              </Text>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            {t('submit')}
          </Button>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('reportIssue')}</Text>
      </LinearGradient>

      <View style={styles.formContainer}>
        <TextInput
          label={t('textInput')}
          value={description}
          onChangeText={setDescription}
          style={styles.textInput}
          mode="outlined"
          multiline
          numberOfLines={4}
        />

        <View style={styles.mediaContainer}>
          <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
            <Camera size={24} color="#667eea" />
            <Text style={styles.mediaButtonText}>{t('uploadPhoto')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mediaButton, isRecording && styles.recordingButton]}
            onPress={handleMicPress}
          >
            <Mic size={24} color={isRecording ? "#ffffff" : "#667eea"} />
            <Text style={[styles.mediaButtonText, isRecording && styles.recordingText]}>
              {isRecording ? 'Stop Recording' : t('voiceInput')}
            </Text>
          </TouchableOpacity>
        </View>

        {photo && (
          <View style={styles.photoPreview}>
            <Image source={{ uri: photo }} style={styles.photoImage} />
          </View>
        )}

        <TouchableOpacity
          style={styles.previewButton}
          onPress={() => setShowPreview(true)}
        >
          <Eye size={20} color="#667eea" />
          <Text style={styles.previewButtonText}>{t('preview')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  formContainer: {
    padding: 20,
  },
  textInput: {
    marginBottom: 20,
  },
  mediaContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  mediaButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  recordingButton: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  mediaButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  recordingText: {
    color: '#ffffff',
  },
  photoPreview: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: 200,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#667eea',
    marginBottom: 20,
  },
  previewButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#667eea',
    fontWeight: '500',
  },
  previewContainer: {
    padding: 20,
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  locationPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    marginTop: 20,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
});