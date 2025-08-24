import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react-native';

export default function UserAuth() {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    city: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });

  const handleSubmit = () => {
    if (isLogin) {
      if (!formData.username || !formData.password) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }
      router.replace('/user/dashboard');
    } else {
      if (!formData.name || !formData.phone || !formData.email || !formData.password) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      router.replace('/user/dashboard');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>{isLogin ? t('login') : t('register')}</Text>
        <Text style={styles.userType}>{t('user')}</Text>
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
              label={t('age')}
              value={formData.age}
              onChangeText={(text) => setFormData({ ...formData, age: text })}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
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
          </>
        )}

        {isLogin && (
          <TextInput
            label={t('username')}
            value={formData.username}
            onChangeText={(text) => setFormData({ ...formData, username: text })}
            style={styles.input}
            mode="outlined"
          />
        )}

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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
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
    color: '#667eea',
    fontSize: 16,
  },
});