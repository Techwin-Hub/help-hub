import { Stack } from 'expo-router';

export default function VolunteerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="assigned" />
      <Stack.Screen name="browse" />
      <Stack.Screen name="update" />
    </Stack>
  );
}