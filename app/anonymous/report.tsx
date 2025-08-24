import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Camera, Mic, MapPin, FileText } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { submitAnonymousReport } from '@/lib/database';

export default function AnonymousReport() {
  const { t } = useLanguage();
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

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

  const simulateVoiceRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      Alert.alert('Voice Recording', 'Voice input recorded successfully!');
    }, 2000);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please describe the issue');
      return;
    }
    try {
      await submitAnonymousReport(description, '', photo);
      Alert.alert('Success', 'Anonymous report submitted successfully!', [
        { text: 'OK', onPress: () => router.replace('/home') }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while submitting the report');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <FileText size={40} color="#ffffff" />
        <Text style={styles.title}>{t('reportAnonymously')}</Text>
        <Text style={styles.subtitle}>No registration required</Text>
      </LinearGradient>

      <View style={styles.formContainer}>
        <View style={styles.locationCard}>
          <MapPin size={20} color="#43e97b" />
          <Text style={styles.locationText}>Auto-detected location: Downtown Area</Text>
        </View>

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
            <Camera size={24} color="#43e97b" />
            <Text style={styles.mediaButtonText}>{t('uploadPhoto')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mediaButton, isRecording && styles.recordingButton]}
            onPress={simulateVoiceRecording}
            disabled={isRecording}
          >
            <Mic size={24} color={isRecording ? "#ffffff" : "#43e97b"} />
            <Text style={[styles.mediaButtonText, isRecording && styles.recordingText]}>
              {isRecording ? 'Recording...' : t('voiceInput')}
            </Text>
          </TouchableOpacity>
        </View>

        {photo && (
          <View style={styles.photoPreview}>
            <Image source={{ uri: photo }} style={styles.photoImage} />
          </View>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
        >
          {t('submit')}
        </Button>

        <Text style={styles.anonymousNote}>
          Your report will be submitted anonymously. We cannot contact you for follow-up questions.
        </Text>
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
    paddingBottom: 40,
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
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
  },
  formContainer: {
    padding: 20,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
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
    borderColor: '#43e97b',
  },
  recordingButton: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  mediaButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: '#43e97b',
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
  submitButton: {
    marginTop: 20,
    marginBottom: 16,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  anonymousNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 16,
  },
});