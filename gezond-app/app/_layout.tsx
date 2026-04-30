import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#f8fdf8' },
          headerTintColor: '#2e7d32',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#f8fdf8' },
        }}
      />
    </>
  );
}
