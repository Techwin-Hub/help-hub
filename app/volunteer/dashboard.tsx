import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogOut, Check, Zap, Image as ImageIcon } from 'lucide-react-native';
import { listReportsForVolunteer, updateReportStatus } from '@/lib/database';
import { useIsFocused } from '@react-navigation/native';

export default function VolunteerDashboard() {
  const { t } = useLanguage();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  // Hardcoded volunteerId for now
  const volunteerId = 1;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedReports = await listReportsForVolunteer(volunteerId);
      setReports(fetchedReports);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      Alert.alert('Error', 'Failed to load assigned reports.');
    } finally {
      setLoading(false);
    }
  }, [volunteerId]);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, fetchData]);

  const handleUpdateStatus = async (reportId, status, imagePath = null) => {
    try {
      await updateReportStatus(reportId, status, imagePath);
      Alert.alert('Success', `Report status updated to ${status}`);
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to update status:', error);
      Alert.alert('Error', 'Failed to update report status.');
    }
  };

  const assignedTasks = reports.filter(r => r.status === 'inProgress').length;
  const completedTasks = reports.filter(r => r.status === 'resolved').length;

  const renderReport = ({ item }) => (
    <View style={styles.reportCard}>
      <Text style={styles.reportDescription}>{item.description}</Text>
      <Text style={styles.reportDate}>Reported on: {new Date(item.createdAt).toLocaleDateString()}</Text>
      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          Status: {t(item.status)}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        {item.status === 'inProgress' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.resolvedButton]}
              onPress={() => handleUpdateStatus(item.id, 'resolved')}
            >
              <Check size={16} color="#ffffff" />
              <Text style={styles.actionButtonText}>Mark as Resolved</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.uploadButton]}
              onPress={() => Alert.alert('Upload Image', 'Image upload functionality would be implemented here.')}
            >
              <ImageIcon size={16} color="#ffffff" />
              <Text style={styles.actionButtonText}>Upload Image</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'inProgress': return '#3498db';
      case 'resolved': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.welcome}>Volunteer Portal</Text>
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
          <Text style={styles.statNumber}>{assignedTasks}</Text>
          <Text style={styles.statLabel}>Assigned Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4facfe" style={{ marginTop: 20 }}/>
      ) : (
        <FlatList
          data={reports.filter(r => r.status === 'inProgress')}
          renderItem={renderReport}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={() => <Text style={styles.listHeader}>Current Assigned Issues</Text>}
          ListEmptyComponent={() => (
            <View style={styles.centered}>
              <Text>No issues currently assigned to you.</Text>
            </View>
          )}
        />
      )}
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
    top: 60,
    right: 20,
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
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  reportCard: {
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
  reportDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  reportDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statusContainer: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  resolvedButton: {
    backgroundColor: '#27ae60',
  },
  uploadButton: {
    backgroundColor: '#3498db',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});