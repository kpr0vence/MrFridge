import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import "../global.css";
import { DataProvider } from "../utils/DataContext";
import { GuessProvider } from "../utils/GuessContext";

import * as BackgroundTask from "expo-background-task";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

import { useEffect } from "react";
import { GROCERY_TASK } from "../utils/backgroundTasks";

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
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      expiration_date TEXT,
      location_id INTEGER CHECK (location_id IN (1, 2, 3))
    );`,
  );

  // Register daily task for actual app (not expo go)
  const registerDailyTask = async () => {
    const status = await BackgroundTask.getStatusAsync();
    if (status !== BackgroundTask.BackgroundTaskStatus.Available) { // Prevents errors while still on Expo Go
      console.log(
        "Background tasks are restricted/unavailable in this environment. Skipping registration.",
      );
      return;
    }

    // Register task if not already registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(GROCERY_TASK);
    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(GROCERY_TASK, {
        minimumInterval: 24 * 60, // run ~ once per day, the interval is in minutes
      });
      console.log("Grocery background task registered.");
    }
  };
  registerDailyTask().catch(console.error);
};

// Request notification permissions
const requestNotificationPermissions = async () => {
  const settings = await Notifications.getPermissionsAsync();

  if (settings.status === "granted") {
    return;
  }

  const requestResult = await Notifications.requestPermissionsAsync();
};

export default function RootLayout() {
  useEffect(() => {
    requestNotificationPermissions().catch(console.error);
  }, []);

  return (
    <SQLiteProvider databaseName="test.db" onInit={createDbIfNeeded}>
      <DataProvider>
        <GuessProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="itemsDisplay"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="PhotoAdd" options={{ headerShown: false }} />
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
    </SQLiteProvider>
  );
}
