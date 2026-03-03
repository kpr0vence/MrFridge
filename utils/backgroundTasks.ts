import * as Notifications from "expo-notifications";
import { SQLiteDatabase, openDatabaseSync } from "expo-sqlite";
import * as TaskManager from "expo-task-manager";
import { calculateDaysTilExp } from "./item.utils";
import { BackgroundTaskResult, ItemType } from "./types";

export const GROCERY_TASK = "CHECK_EXPIRING_GROCERIES";


// Open a standalone DB (for background tasks in production builds)
const openDb = (): SQLiteDatabase => openDatabaseSync("test.db");

// Fetch items close to or "past" expiration
const fetchExpiringItems = async (
  db: SQLiteDatabase,
): Promise<ItemType[]> => {
  try {
    const items = await db.getAllAsync<ItemType>(
      "SELECT * FROM items ORDER BY expiration_date;",
    );
    return items.filter((item) => calculateDaysTilExp(item.expiration_date) <= 4);
  } catch (err) {
    console.error("SQL error in fetchExpiringItems:", err);
    return [];
  }
};

// Send notification about expiring items
export const sendExpiringItemsNotification = async (db: SQLiteDatabase) => {
  const expiringItems = await fetchExpiringItems(db);
  if (expiringItems.length === 0) {
    console.log("No expiring items found for notification.");
    return;
  }

  // Create message body
  let message: string = '';
  if (expiringItems.length <= 3) {
    message = expiringItems.map((i) => i.name).join(", ");
  } else {
    const closest = expiringItems[0];
    message = `${closest.name} and ${expiringItems.length - 1} other items are expiring soon...`;
  }

  // Schedule notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Consider Eating these Items",
      body: message,
    },
    trigger: null,
  });
};

// It has to be defined this way so that it can run in the background
TaskManager.defineTask(GROCERY_TASK, async () => {
  try {
    const taskDb = openDb();
    await sendExpiringItemsNotification(taskDb);
    return BackgroundTaskResult.NewData;
  } catch (err) {
    console.error("Background task error:", err);
    return BackgroundTaskResult.Failed;
  }
});

// Kept for API compatibility; no-op because the task is now defined at module scope
export const defineGroceryBackgroundTask = (_db?: SQLiteDatabase) => {};
