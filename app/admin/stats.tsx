import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { listReportsForAdmin, listAllVolunteers } from '@/lib/database';
import { Report, Volunteer } from '@/data/mockData';

export default function StatisticsScreen() {
  const [reportData, setReportData] = useState<Report[]>([]);
  const [volunteerData, setVolunteerData] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const reports = await listReportsForAdmin();
        const volunteers = await listAllVolunteers();
        setReportData(reports);
        setVolunteerData(volunteers);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const processReportData = () => {
    const dataByDate = reportData.reduce((acc, report) => {
      const date = new Date(report.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(dataByDate).slice(-7);
    const data = labels.map(label => dataByDate[label]);

    if (labels.length === 0) {
      return { labels: ['No Data'], datasets: [{ data: [0] }] };
    }

    return {
      labels,
      datasets: [{ data }],
    };
  };

  const processVolunteerData = () => {
    const active = volunteerData.filter(v => v.status === 'active').length;
    const inactive = volunteerData.length - active;

    if (volunteerData.length === 0) {
        return { labels: ['No Data'], datasets: [{ data: [0] }] };
    }

    return {
      labels: ['Active', 'Inactive'],
      datasets: [{ data: [active, inactive] }],
    };
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator style={styles.loader} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#fa709a', '#fee140']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statistics</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Reports Over Last 7 Days</Text>
          <LineChart
            data={processReportData()}
            width={Dimensions.get('window').width - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Volunteer Status</Text>
          <BarChart
            data={processVolunteerData()}
            width={Dimensions.get('window').width - 40}
            height={220}
            yAxisLabel=""
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
          />
        </View>
      </ScrollView>
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadows: false,
};

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
  contentContainer: {
    padding: 20,
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  placeholderText: {
    color: '#9e9e9e',
    fontSize: 16,
  },
});