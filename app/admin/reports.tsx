import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Filter, UserPlus, Mail } from 'lucide-react-native';
import { listReportsForAdmin, listAllVolunteers, assignReport } from '@/lib/database';
import { useIsFocused } from '@react-navigation/native';

export default function AdminReports() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [reports, setReports] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedReports, fetchedVolunteers] = await Promise.all([
        listReportsForAdmin(),
        listAllVolunteers(),
      ]);
      setReports(fetchedReports);
      setVolunteers(fetchedVolunteers);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      Alert.alert('Error', 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, fetchData]);

  const filteredReports = reports.filter(report =>
    filter === 'all' || report.status === filter
  );

  const assignVolunteer = async (reportId: string) => {
    const availableVolunteers = volunteers
      .filter(v => v.status === 'active')
      .map(v => ({
        text: v.name,
        onPress: async () => {
          try {
            await assignReport(reportId, v.id);
            Alert.alert('Success', `Report assigned to ${v.name}`);
            fetchData(); // Refresh list
          } catch (error) {
            console.error('Failed to assign report:', error);
            Alert.alert('Error', 'Failed to assign report.');
          }
        },
      }));

    if (availableVolunteers.length === 0) {
      Alert.alert(t('assignVolunteer'), 'No active volunteers available.');
      return;
    }

    Alert.alert(
      t('assignVolunteer'),
      'Select a volunteer:',
      [...availableVolunteers, { text: 'Cancel', style: 'cancel' }]
    );
  };

  const sendEmail = (reportId: string) => {
    Alert.alert('Email Sent', 'Notification email sent to reporter');
  };

  const renderReport = ({ item }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportTitle}>{item.description}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.priorityText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.reportReporter}>
        Reporter ID: {item.userId ? item.userId : 'Anonymous'}
      </Text>
      <Text style={styles.reportDate}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
      <Text style={styles.reportDate}>
        Assigned to: {volunteers.find(v => v.id === item.assignedVolunteerId)?.name || 'Unassigned'}
      </Text>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => assignVolunteer(item.id)}
        >
          <UserPlus size={16} color="#667eea" />
          <Text style={styles.actionButtonText}>Assign</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => sendEmail(item.id)}
        >
          <Mail size={16} color="#667eea" />
          <Text style={styles.actionButtonText}>Email</Text>
        </TouchableOpacity>
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

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#f093fb" />
        <Text>Loading reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('allReports')}</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#ffffff" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.filterContainer}>
        {['all', 'pending', 'inProgress', 'resolved'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterChip, filter === status && styles.activeFilter]}
            onPress={() => setFilter(status)}
          >
            <Text style={[styles.filterText, filter === status && styles.activeFilterText]}>
              {status === 'all' ? 'All' : t(status)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredReports}
        renderItem={renderReport}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.centered}>
            <Text>No reports found for the selected filter.</Text>
          </View>
        )}
      />
    </View>
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  filterButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeFilter: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  reportLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  reportReporter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});