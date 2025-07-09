import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';

export default function AuthLayout() {
  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }} 
      keyboardShouldPersistTaps="handled"
    >
      <Stack>
        <Stack.Screen
          name="auth/login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="auth/register"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
      </Stack>
    </ScrollView>
  );
}
