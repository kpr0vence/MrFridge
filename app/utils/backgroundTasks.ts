// backgroundTasks.ts
import * as Notifications from "expo-notifications";
import { SQLiteDatabase } from "expo-sqlite";
import * as TaskManager from "expo-task-manager";
import { BackgroundTaskResult, ItemType } from "./types";

export const GROCERY_TASK = "CHECK_EXPIRING_GROCERIES";

interface ExecResult {
  rows: { _array: ItemType[] };
}

// fetch items using execAsync
export const fetchExpiringItems = async (
  db: SQLiteDatabase,
): Promise<ItemType[]> => {
  const sql = `
    SELECT *,
      CAST(julianday(expiration_date) - julianday('now') AS INTEGER) AS daysRemaining
    FROM items
    WHERE julianday(expiration_date) - julianday('now') <= 4
    ORDER BY expiration_date;
  `;

  try {
    const result = (await db.execAsync(sql)) as unknown as ExecResult;

    // safely access _array
    if (!result?.rows?._array) return [];

    return result.rows._array.map((row: any) => ({
      ...row,
      daysRemaining: row.daysRemaining,
    })) as ItemType[];
  } catch (err) {
    console.error("SQL error in fetchExpiringItems:", err);
    return [];
  }
};

// send notification
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

// define background task
export const defineGroceryBackgroundTask = (db: SQLiteDatabase) => {
  TaskManager.defineTask(GROCERY_TASK, async () => {
    try {
      await sendExpiringItemsNotification(db);
      return BackgroundTaskResult.NewData;
    } catch (err) {
      console.error("Background task error:", err);
      return BackgroundTaskResult.Failed;
    }
  });
};
