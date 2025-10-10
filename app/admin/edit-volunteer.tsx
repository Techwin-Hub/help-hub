import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { TextInput, Button } from 'react-native-paper';
import { ArrowLeft } from 'lucide-react-native';
import { getVolunteerById, updateVolunteer } from '@/lib/database';
import { LinearGradient } from 'expo-linear-gradient';

export default function EditVolunteerScreen() {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVolunteer() {
      try {
        const volunteer = await getVolunteerById(Number(id));
        if (volunteer) {
          setName(volunteer.name);
          setEmail(volunteer.email);
        }
      } catch (error) {
        console.error('Failed to fetch volunteer:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVolunteer();
  }, [id]);

  const handleSave = async () => {
    try {
      await updateVolunteer(Number(id), name, email);
      Alert.alert("Success", "Volunteer updated successfully.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Failed to update volunteer:', error);
      Alert.alert("Error", "Failed to update volunteer.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Volunteer</Text>
      </LinearGradient>

      <View style={styles.formContainer}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
        />
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
        >
          Save Changes
        </Button>
      </View>
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
  formContainer: {
    padding: 20,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
  },
});