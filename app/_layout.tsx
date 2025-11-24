import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Ignore specific warnings that are safe to ignore
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function RootLayout() {
  useEffect(() => {
    // Setup global error handler
    const errorHandler = (error: Error, isFatal?: boolean) => {
      console.error('Global error handler:', error, 'Fatal:', isFatal);
      // Don't crash the app, just log
    };

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // @ts-ignore
      if (global.ErrorUtils) {
        // @ts-ignore
        global.ErrorUtils.setGlobalHandler(errorHandler);
      }
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />
    </GestureHandlerRootView>
  );
}