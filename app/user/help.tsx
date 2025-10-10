import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function HelpScreen() {
  const { t } = useLanguage();

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('help')}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Text style={styles.question}>How do I report an issue?</Text>
        <Text style={styles.answer}>
          You can report an issue from the user dashboard by tapping on the "Report Issue" button. You can also report anonymously from the home screen.
        </Text>

        <Text style={styles.question}>Can I track my reports?</Text>
        <Text style={styles.answer}>
          Yes, if you are a registered user, you can view the status of your submitted reports in the "My Reports" section.
        </Text>

        <Text style={styles.question}>Is my location shared?</Text>
        <Text style={styles.answer}>
          Yes, your location is used to help us address the issue more effectively. We respect your privacy and only use this information for its intended purpose.
        </Text>
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
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  answer: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
});