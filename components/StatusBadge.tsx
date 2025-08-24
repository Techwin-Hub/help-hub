import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';

interface StatusBadgeProps {
  status: 'pending' | 'inProgress' | 'resolved';
  size?: 'small' | 'medium';
}

export default function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: '#f39c12',
          text: 'Pending',
        };
      case 'inProgress':
        return {
          icon: AlertCircle,
          color: '#3498db',
          text: 'In Progress',
        };
      case 'resolved':
        return {
          icon: CheckCircle,
          color: '#27ae60',
          text: 'Resolved',
        };
    }
  };

  const config = getStatusConfig();
  const iconSize = size === 'small' ? 16 : 20;
  const fontSize = size === 'small' ? 12 : 14;

  return (
    <View style={[styles.badge, { backgroundColor: config.color }]}>
      <config.icon size={iconSize} color="#ffffff" />
      <Text style={[styles.text, { fontSize }]}>{config.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  text: {
    color: '#ffffff',
    fontWeight: '500',
  },
});