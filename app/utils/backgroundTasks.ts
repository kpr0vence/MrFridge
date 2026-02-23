import * as Notifications from "expo-notifications";
import { SQLiteDatabase, openDatabaseSync } from "expo-sqlite";
import * as TaskManager from "expo-task-manager";
import { BackgroundTaskResult, ItemType } from "./types";

export const GROCERY_TASK = "CHECK_EXPIRING_GROCERIES";

interface ExecResult {
  rows: { _array: ItemType[] };
}

// Open a standalone DB (for background tasks in production builds)
const openDb = (): SQLiteDatabase => openDatabaseSync("test.db");

// Fetch items expiring in <=4 days
export const fetchExpiringItems = async (
  db: SQLiteDatabase,
): Promise<ItemType[]> => {
  const sql = `
    SELECT *,
      julianday(expiration_date) - julianday('now') AS daysRemaining
    FROM items
    ORDER BY expiration_date;
  `;

  try {
    const results = (await db.execAsync(sql)) as unknown as {
      rows: { _array: ItemType[] };
    }[];

    if (!results?.length || !results[0]?.rows?._array) return [];

    return results[0].rows._array
      .map((row: any) => ({
        ...row,
        daysRemaining: Math.round(row.daysRemaining), // round to nearest int
      }))
      .filter((row) => row.daysRemaining <= 4); // <= 4 days, includes negative (expired)
  } catch (err) {
    console.error("SQL error in fetchExpiringItems:", err);
    return [];
  }
};
// Send notification about expiring items
export const sendExpiringItemsNotification = async (db: SQLiteDatabase) => {
  const expiringItems = await fetchExpiringItems(db);
  if (!expiringItems.length) return;

  let message: string;
  if (expiringItems.length <= 3) {
    message = expiringItems.map((i) => i.name).join(", ");
  } else {
    const closest = expiringItems[0];
    message = `${closest.name} and ${expiringItems.length - 1} other items are expiring soon`;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Mr. Fridge -- Consider Eating these Items",
      body: message,
    },
    trigger: null,
  });
};

// Define background task (used in _layout)
export const defineGroceryBackgroundTask = (db?: SQLiteDatabase) => {
  TaskManager.defineTask(GROCERY_TASK, async () => {
    try {
      // If no DB passed, open a standalone one
      const taskDb = db ?? openDb();
      await sendExpiringItemsNotification(taskDb);
      return BackgroundTaskResult.NewData;
    } catch (err) {
      console.error("Background task error:", err);
      return BackgroundTaskResult.Failed;
    }
  });
};
