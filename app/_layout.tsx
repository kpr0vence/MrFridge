import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { runMigrations } from "../db/migrations";
import "../global.css";
import { DataProvider } from "../utils/DataContext";
import { GuessProvider } from "../utils/GuessContext";

import * as Notifications from "expo-notifications";

import { NotificationRequest } from "expo-notifications/build/Notifications.types";
import { useEffect } from "react";
import { FoodProvider } from "../utils/FoodContext";
import { NotificationsProvider } from "../utils/NotificationsContext";

// Ensure notifications are shown even when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Create the DB table and define the background task
const createDbIfNeeded = async (db: SQLiteDatabase) => {
  await runMigrations(db);
};

// Request notification permissions
const requestNotificationPermissions = async () => {
  const settings = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  if (settings.status === "granted") {
    return;
  }

  const requestResult = await Notifications.requestPermissionsAsync();
  if (requestResult.status !== "granted") {
    console.log("Notification permission denied");
  }
};

async function verifyNotificationsAreScheduled() {
  const scheduled: NotificationRequest[] =
    await Notifications.getAllScheduledNotificationsAsync();
  console.log(`${scheduled.length} notifications scheduled`);
}

export default function RootLayout() {
  useEffect(() => {
    requestNotificationPermissions().catch(console.error);
    // verifyNotificationsAreScheduled();
  }, []);

  return (
    <SQLiteProvider databaseName="test.db" onInit={createDbIfNeeded}>
      <FoodProvider>
        <NotificationsProvider>
          <DataProvider>
            <GuessProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
                <Stack.Screen
                  name="itemsDisplay"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="PhotoAdd"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="DisplayResults"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="SuccessfulSubmitMessage"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="FailureSubmitMessage"
                  options={{ headerShown: false }}
                />
              </Stack>
            </GuessProvider>
          </DataProvider>
        </NotificationsProvider>
      </FoodProvider>
    </SQLiteProvider>
  );
}
