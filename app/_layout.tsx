import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { runMigrations } from "../db/migrations";
import "../global.css";
import { DataProvider } from "../utils/DataContext";
import { GuessProvider } from "../utils/GuessContext";

import * as backgroundTask from "expo-background-task";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

import { useEffect } from "react";
import { GROCERY_TASK } from "../utils/backgroundTasks";
import { scheduleDailyReminder } from "../utils/dailyNotifs";
import { FoodProvider } from "../utils/FoodContext";

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

// Register daily task for actual app (not expo go)
const registerDailyTask = async () => {
  const status = await backgroundTask.getStatusAsync();

  if (status !== backgroundTask.BackgroundFetchStatus.Available) {
    // Prevents errors while still on Expo Go
    console.log(
      "Background tasks are restricted/unavailable in this environment. Skipping registration.",
    );
    return;
  }

  // Register task if not already registered
  const isRegistered = await TaskManager.isTaskRegisteredAsync(GROCERY_TASK);
  if (!isRegistered) {
    // 2. Register the task (can be done in react components, so it's okay to )
    // to be here at the app entry point
    await backgroundTask.registerTaskAsync(GROCERY_TASK, {
      minimumInterval: 1440,
      stopOnTerminate: false,
      startOnBoot: true,
    }); // 1440 minutes is 24 hours, I think this was
    console.log("Grocery background task registered.");
  }
};

// Request notification permissions
const requestNotificationPermissions = async () => {
  const settings = await Notifications.getPermissionsAsync();

  if (settings.status === "granted") {
    return;
  }

  const requestResult = await Notifications.requestPermissionsAsync();
  if (requestResult.status !== "granted") {
    console.log("Notification permission denied");
  }
};

export default function RootLayout() {
  useEffect(() => {
    requestNotificationPermissions().catch(console.error);
    registerDailyTask().catch(console.error);
    scheduleDailyReminder().catch(console.error);
  }, []);

  return (
    <SQLiteProvider databaseName="test.db" onInit={createDbIfNeeded}>
      <FoodProvider>
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
      </FoodProvider>
    </SQLiteProvider>
  );
}
