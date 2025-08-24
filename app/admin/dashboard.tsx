import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Map, Users, ChartBar as BarChart3, LogOut } from 'lucide-react-native';

export default function AdminDashboard() {
  const { t } = useLanguage();

  const menuItems = [
    {
      title: t('allReports'),
      icon: FileText,
      route: '/admin/reports',
      gradient: ['#667eea', '#764ba2'],
    },
    {
      title: t('mapView'),
      icon: Map,
      route: '/admin/map',
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      title: t('manageVolunteers'),
      icon: Users,
      route: '/admin/volunteers',
      gradient: ['#43e97b', '#38f9d7'],
    },
    {
      title: t('statistics'),
      icon: BarChart3,
      route: '/admin/stats',
      gradient: ['#fa709a', '#fee140'],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.welcome}>Admin Portal</Text>
          <Text style={styles.dashboardTitle}>{t('dashboard')}</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => router.replace('/home')}
          >
            <LogOut size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Total Reports</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Active Volunteers</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuCard}
            onPress={() => router.push(item.route as any)}
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
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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