import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, List, Phone, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';

export default function UserDashboard() {
  const { t } = useLanguage();

  const menuItems = [
    {
      title: t('reportIssue'),
      icon: FileText,
      route: '/user/report',
      gradient: ['#667eea', '#764ba2'],
    },
    {
      title: t('myReports'),
      icon: List,
      route: '/user/reports',
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      title: t('emergencyCall'),
      icon: Phone,
      action: () => Linking.openURL('tel:911'),
      gradient: ['#ff6b6b', '#ee5a24'],
    },
    {
      title: t('help'),
      icon: HelpCircle,
      action: () => router.push('/user/help' as any),
      gradient: ['#4facfe', '#00f2fe'],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.welcome}>Welcome back!</Text>
          <Text style={styles.dashboardTitle}>{t('dashboard')}</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => router.replace('/home')}
          >
            <LogOut size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuCard}
            onPress={() => item.route ? router.push(item.route as any) : item.action?.()}
          >
            <LinearGradient colors={item.gradient} style={styles.menuGradient}>
              <item.icon size={32} color="#ffffff" />
              <Text style={styles.menuTitle}>{item.title}</Text>
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcome: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 4,
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  logoutButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  menuContainer: {
    padding: 20,
    gap: 16,
  },
  menuCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  menuGradient: {
    padding: 24,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 8,
    textAlign: 'center',
  },
});