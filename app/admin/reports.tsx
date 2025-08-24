import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Filter, UserPlus, Mail } from 'lucide-react-native';

const mockReports = [
  {
    id: '1',
    title: 'Broken streetlight on Main Street',
    status: 'pending',
    date: '2024-01-15',
    location: 'Main Street, Downtown',
    reporter: 'Anonymous',
    priority: 'medium',
  },
  {
    id: '2',
    title: 'Pothole on Highway 101',
    status: 'inProgress',
    date: '2024-01-14',
    location: 'Highway 101, Mile 15',
    reporter: 'John Doe',
    priority: 'high',
  },
  {
    id: '3',
    title: 'Garbage collection missed',
    status: 'resolved',
    date: '2024-01-13',
    location: 'Residential Area, Block A',
    reporter: 'Jane Smith',
    priority: 'low',
  },
];

const volunteers = ['Alex Johnson', 'Maria Garcia', 'David Chen', 'Sarah Wilson'];

export default function AdminReports() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');

  const filteredReports = mockReports.filter(report => 
    filter === 'all' || report.status === filter
  );

  const assignVolunteer = (reportId: string) => {
    Alert.alert(
      t('assignVolunteer'),
      'Select a volunteer:',
      volunteers.map(volunteer => ({
        text: volunteer,
        onPress: () => Alert.alert('Success', `Assigned to ${volunteer}`)
      })).concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };

  const sendEmail = (reportId: string) => {
    Alert.alert('Email Sent', 'Notification email sent to reporter');
  };

  const renderReport = ({ item }: { item: typeof mockReports[0] }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportTitle}>{item.title}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>
      <Text style={styles.reportLocation}>{item.location}</Text>
      <Text style={styles.reportReporter}>Reporter: {item.reporter}</Text>
      <Text style={styles.reportDate}>{item.date}</Text>
      
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

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
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
});