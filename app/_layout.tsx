import { Stack } from "expo-router";
// import 'react-native-reanimated';
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

// Create a database to store the groceries. The location id is limited
// to 1 (fridge) 2 (pantry) or 3 (freezer)
const createDbIfNeeded = async (db: SQLiteDatabase) => {
  await db.execAsync(
    " CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, expiration_date TEXT, location_id INTEGER CHECK (location_id IN (1, 2, 3)));",
  );
  defineGroceryBackgroundTask(db);

  const registerDailyTask = async () => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(GROCERY_TASK);
    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(GROCERY_TASK, {
        minimumInterval: 24 * 60 * 60, // once per day
      });
      console.log("Grocery background task registered.");
    }
  };
  registerDailyTask().catch(console.error);
};

// // Make the notification task go daily
// const registerDailyTask = async () => {
//   const hasTask = await TaskManager.isTaskRegisteredAsync(GROCERY_TASK);
//   if (!hasTask) {
//     await BackgroundTask.registerTaskAsync(GROCERY_TASK, {
//       minimumInterval: 24 * 60 * 60, // run once per day
//     });
//     console.log("Grocery background task registered.");
//   }
// };

// Get notification permisions
const requestNotificationPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
};

export default function RootLayout() {
  useEffect(() => {
    requestNotificationPermissions().catch(console.error);
    // registerDailyTask().catch(console.error); // only minimumInterval option
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
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ManualAdd"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="PhotoAdd"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="DisplayResults"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SuccessfulSubmitMessage"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="FailureSubmitMessage"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </GuessProvider>
      </DataProvider>
    </SQLiteProvider>
  );
}
