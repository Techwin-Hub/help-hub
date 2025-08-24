import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Heart, Upload } from 'lucide-react-native';
import { registerVolunteer, loginVolunteer } from '@/lib/database';

export default function VolunteerAuth() {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      const volunteer = await loginVolunteer(formData.email, formData.password);
      if (volunteer) {
        router.replace('/volunteer/dashboard');
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred during login');
    }
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.phone || !formData.city || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    try {
      const newVolunteerId = await registerVolunteer(
        formData.name,
        formData.phone,
        formData.city,
        formData.email,
        formData.password
      );
      if (newVolunteerId) {
        router.replace('/volunteer/dashboard');
      } else {
        Alert.alert('Error', 'An error occurred during registration');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred during registration');
    }
  };

  const handleSubmit = () => {
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const pickResume = () => {
    Alert.alert('Resume Upload', 'Resume upload functionality would be implemented here');
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Heart size={40} color="#ffffff" />
        <Text style={styles.title}>{isLogin ? t('login') : t('register')}</Text>
        <Text style={styles.userType}>{t('volunteer')}</Text>
      </LinearGradient>

      <View style={styles.formContainer}>
        {!isLogin && (
          <>
            <TextInput
              label={t('name')}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label={t('phone')}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
            />
            <TextInput
              label={t('city')}
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label={t('email')}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.resumeButton} onPress={pickResume}>
              <Upload size={20} color="#4facfe" />
              <Text style={styles.resumeButtonText}>{t('resume')} (Optional)</Text>
            </TouchableOpacity>
          </>
        )}

        <TextInput
          label={t('email')}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
        />

        <TextInput
          label={t('password')}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          style={styles.input}
          mode="outlined"
          secureTextEntry
        />

        {!isLogin && (
          <TextInput
            label={t('confirmPassword')}
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            style={styles.input}
            mode="outlined"
            secureTextEntry
          />
        )}

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
        >
          {isLogin ? t('login') : t('register')}
        </Button>

        <TouchableOpacity
          onPress={() => setIsLogin(!isLogin)}
          style={styles.switchButton}
        >
          <Text style={styles.switchText}>
            {isLogin ? `Don't have an account? ${t('register')}` : `Already have an account? ${t('login')}`}
          </Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  userType: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
  },
  formContainer: {
    padding: 20,
  },
  input: {
    marginBottom: 16,
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#4facfe',
    borderStyle: 'dashed',
  },
  resumeButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4facfe',
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 16,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchText: {
    color: '#4facfe',
    fontSize: 16,
  },
});