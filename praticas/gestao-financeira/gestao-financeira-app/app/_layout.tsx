import { Stack } from "expo-router";
import AuthProvider from "../src/contexts/AuthContext";
import GlobalState from "../src/contexts/GlobalState";

export default function RootLayout() {
  return (
    <AuthProvider>
      <GlobalState>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </GlobalState>
    </AuthProvider>
  );
}