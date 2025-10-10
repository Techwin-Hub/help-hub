import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router, useIsFocused } from 'expo-router';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react-native';
import { listAllVolunteers, deleteVolunteer } from '@/lib/database';
import { Volunteer } from '@/data/mockData';
import { LinearGradient } from 'expo-linear-gradient';

export default function ManageVolunteersScreen() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchVolunteers = useCallback(async () => {
    setLoading(true);
    try {
      const volunteerData = await listAllVolunteers();
      setVolunteers(volunteerData);
    } catch (error) {
      console.error('Failed to fetch volunteers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchVolunteers();
    }
  }, [isFocused, fetchVolunteers]);

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Volunteer",
      "Are you sure you want to delete this volunteer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteVolunteer(id);
              fetchVolunteers();
            } catch (error) {
              console.error('Failed to delete volunteer:', error);
              Alert.alert("Error", "Failed to delete volunteer.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/edit-volunteer?id=${id}`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Volunteers</Text>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {volunteers.map((volunteer) => (
            <View key={volunteer.id} style={styles.volunteerCard}>
              <View>
                <Text style={styles.volunteerName}>{volunteer.name}</Text>
                <Text style={styles.volunteerEmail}>{volunteer.email}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleEdit(volunteer.id)} style={styles.actionButton}>
                  <Edit size={20} color="#43e97b" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(volunteer.id)} style={styles.actionButton}>
                  <Trash2 size={20} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  volunteerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  volunteerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  volunteerEmail: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 8,
  }
});