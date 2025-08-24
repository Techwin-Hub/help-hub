import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Calendar } from 'lucide-react-native';
import StatusBadge from './StatusBadge';

interface Report {
  id: string;
  title: string;
  status: 'pending' | 'inProgress' | 'resolved';
  date: string;
  location: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
}

interface ReportCardProps {
  report: Report;
  onPress?: () => void;
  showActions?: boolean;
  actions?: React.ReactNode;
}

export default function ReportCard({ report, onPress, showActions, actions }: ReportCardProps) {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{report.title}</Text>
        <StatusBadge status={report.status} size="small" />
      </View>

      {report.priority && (
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(report.priority) }]}>
          <Text style={styles.priorityText}>{report.priority.toUpperCase()}</Text>
        </View>
      )}

      <Text style={styles.description} numberOfLines={2}>
        {report.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.locationContainer}>
          <MapPin size={14} color="#666" />
          <Text style={styles.location}>{report.location}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Calendar size={14} color="#666" />
          <Text style={styles.date}>{report.date}</Text>
        </View>
      </View>

      {showActions && actions && (
        <View style={styles.actionsContainer}>
          {actions}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 8,
  },
  priorityText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  actionsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});