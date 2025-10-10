import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { listAllVolunteers } from '@/lib/database';
import { Volunteer } from '@/data/mockData';

export default function MapViewScreen() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVolunteers() {
      try {
        const volunteerData = await listAllVolunteers();
        setVolunteers(volunteerData);
      } catch (error) {
        console.error('Failed to fetch volunteers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVolunteers();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#000" />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 12.9716,
            longitude: 77.5946,
            latitudeDelta: 1.5,
            longitudeDelta: 1.5,
          }}
        >
          {volunteers.map((volunteer) => (
            <Marker
              key={volunteer.id}
              coordinate={{
                latitude: volunteer.latitude,
                longitude: volunteer.longitude,
              }}
              title={volunteer.name}
            >
              <View style={styles.marker}>
                <Text style={styles.markerText}>
                  {volunteer.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 8,
    borderRadius: 20,
  },
  marker: {
    backgroundColor: '#667eea',
    padding: 10,
    borderRadius: 20,
    borderColor: '#fff',
    borderWidth: 2,
  },
  markerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});