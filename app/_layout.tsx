import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import "../global.css";
import { DataProvider } from "./DataContext";
import { GuessProvider } from "./GuessContext";

import * as BackgroundTask from "expo-background-task";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

import { useEffect } from "react";
import {
  defineGroceryBackgroundTask,
  GROCERY_TASK,
} from "./utils/backgroundTasks";

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

  // Define the background task
  defineGroceryBackgroundTask(db);

  // Register daily task for production/dev builds
  const registerDailyTask = async () => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(GROCERY_TASK);
    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(GROCERY_TASK, {
        minimumInterval: 24 * 60 * 60, // run once per day
      });
      console.log("Grocery background task registered.");
    }
  };
  registerDailyTask().catch(console.error);
};

// Request notification permissions
const requestNotificationPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
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
            <Stack.Screen name="ManualAdd" options={{ headerShown: false }} />
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
