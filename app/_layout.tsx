import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { runMigrations } from "../db/migrations";
import "../global.css";
import { DataProvider } from "../utils/DataContext";
import { GuessProvider } from "../utils/GuessContext";

import * as Notifications from "expo-notifications";

import { Buffer } from "buffer";
import React, { useEffect } from "react";
import { FoodProvider } from "../utils/FoodContext";
import { NotificationsProvider } from "../utils/NotificationsContext";

global.Buffer = Buffer; // To get autocomplete to work

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

// Root Entry Point. Here I wrap the actual TSX in the custom contexts I've
// made, as well as open the access to the DB (which has a table for the
// generic food information, one for the stored items, and one for the
// notifications)
export default function RootLayout() {
  useEffect(() => {
    requestNotificationPermissions().catch(console.error);
  }, []);

  /*
      CONTEXTS AND THEIR JOBS
      - SQLiteProvider: Give everything within access to the DB
      - FoodProvider: Handles logic related to interacting with the food_info table
          - The contexts underneath (specifically GuessProvider) need access to this one
      - NotificationsProvider: Handles all notification logic
      - DataProvider: Handles all logic for the items a user stores
      - GuessProvider: Handles most of the logic for going from lines (OCR-ed from the 
        receipt) to estimations
          - Needs access to some of the other contexts, so its the most nested
  */

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
                {/* All possible screens, includes the ones in the tabs directory, as well as
                other screens that while they do exist, can't be navigated to from the navigation payne */}
              </Stack>
            </GuessProvider>
          </DataProvider>
        </NotificationsProvider>
      </FoodProvider>
    </SQLiteProvider>
  );
}
