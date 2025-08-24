import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="volunteers" />
      <Stack.Screen name="stats" />
    </Stack>
  );
}