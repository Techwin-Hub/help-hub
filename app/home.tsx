import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Shield, Heart, FileText } from 'lucide-react-native';

export default function HomeScreen() {
  const { t } = useLanguage();

  const options = [
    {
      title: t('user'),
      icon: User,
      route: '/user/auth',
      gradient: ['#667eea', '#764ba2'],
    },
    {
      title: t('admin'),
      icon: Shield,
      route: '/admin/auth',
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      title: t('volunteer'),
      icon: Heart,
      route: '/volunteer/auth',
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      title: t('reportAnonymously'),
      icon: FileText,
      route: '/anonymous/report',
      gradient: ['#43e97b', '#38f9d7'],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Text style={styles.appName}>{t('appName')}</Text>
        <Text style={styles.subtitle}>{t('subtitle')}</Text>
      </LinearGradient>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionCard}
            onPress={() => router.push(option.route as any)}
          >
            <LinearGradient colors={option.gradient} style={styles.optionGradient}>
              <option.icon size={40} color="#ffffff" />
              <Text style={styles.optionTitle}>{option.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
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
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
  },
  optionsContainer: {
    padding: 20,
    gap: 16,
  },
  optionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  optionGradient: {
    padding: 24,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 12,
    textAlign: 'center',
  },
});