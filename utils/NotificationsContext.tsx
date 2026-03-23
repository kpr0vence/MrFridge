import * as Notifications from "expo-notifications";
import { useSQLiteContext } from "expo-sqlite";
import { createContext, ReactNode, useContext } from "react";
import { calculateDaysTilExp } from "./item.utils";
import { ItemType, NotificationTableType } from "./types";

interface NotificationsContextType {
  scheduleDailyReminder(): Promise<void>;
  removeItemReminder(item: ItemType): Promise<void>;
  scheduleItemReminder(item: ItemType): Promise<void>;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);
export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Static non-unique notification identifier
  const DAILY_NOTIFICATION_ID = "daily-kitchen-reminder";
  const database = useSQLiteContext();

  async function scheduleDailyReminder() {
    // Cancel existing ones to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Mr. Fridge",
        body: "Check out what might be close to expiring in your kitchen ➜",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9, // 9 hours from 12 in the morning (aka 9am)
        minute: 0,
        repeats: true,
      },
    });

    console.log("Daily 9 AM reminder scheduled.");
  }

  // Debug
  async function viewTable() {
    const results = await database.getAllAsync<NotificationTableType>(
      `SELECT * FROM notifications`,
    );

    await results.forEach((result) =>
      console.log(`${result.notification_id} - ${result.food_info_id}`),
    );
  }

  // Get all stored notif id's associated with an food id
  async function getAllNotifIdsForItem(item: ItemType): Promise<string[]> {
    console.log(`Looking for food item id: ${item.id}`);
    await viewTable();
    const results = await database.getAllAsync<NotificationTableType>(
      `SELECT * FROM notifications WHERE food_info_id = ?`,
      [item.id],
    );
    console.log("NotifIds for " + item.name + ": " + results);
    return results.map((result) => result.notification_id);
  }

  // Insert one notification Id into the table
  async function storeNotifIdForItem(item: ItemType, notifId: string) {
    await database.runAsync(
      `INSERT INTO notifications (notification_id, food_info_id) VALUES (?, ?)`,
      [notifId, item.id],
    );
  }

  function generateThreeDayMessage(item: ItemType): string {
    const itemTitleCase =
      item.name.charAt(0).toUpperCase() + item.name.slice(1);
    return `${itemTitleCase} is 3 days from expiration!`;
  }

  function generateTodayMessage(item: ItemType): string {
    const itemTitleCase =
      item.name.charAt(0).toUpperCase() + item.name.slice(1);
    return `${itemTitleCase} is very close to expiration, consider eating it soon!`;
  }

  function generateThreeDaysTillExp(item: ItemType): Date {
    const newDate = new Date();
    const daysTilExp = calculateDaysTilExp(item.expiration_date);
    console.log(item.expiration_date);
    newDate.setDate(newDate.getDate() + (daysTilExp - 3)); // -3 to get three days before exp

    return newDate;
  }

  // Removing an item needs to get rid of both of its notifications
  async function removeItemReminder(item: ItemType) {
    const notifIds = await getAllNotifIdsForItem(item);

    for (const notifId of notifIds) {
      await Notifications.cancelScheduledNotificationAsync(notifId); // Delete notifs

      await database.runAsync(
        // Delete the item in the db
        `DELETE FROM notifications WHERE notification_id = ?`,
        [notifId],
      );
      console.log(`Notification Id ${notifId} canceled.`);
    }
  }

  async function scheduleThreeDayReminder(item: ItemType) {
    const threeDaysTilExp: Date = generateThreeDaysTillExp(item);
    const now = new Date();

    if (threeDaysTilExp <= now) return; // Don't schedule a three day reminder if theres less than 3 days left

    // Make a new notification with the provided info
    const response: Promise<string> =
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Mr. Fridge",
          body: generateThreeDayMessage(item),
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: threeDaysTilExp,
        },
      });

    await storeNotifIdForItem(item, await response); // Add new notification to db
    console.log(
      `Three Day Notification scheduled for ${item.name}, id ${item.id} on ${threeDaysTilExp} with ID ${await response} `,
    );
  }

  async function scheduleNowReminder(item: ItemType) {
    let expDate = new Date(item.expiration_date);

    const daysTilExp = calculateDaysTilExp(item.expiration_date);
    if (daysTilExp === 0) expDate = new Date();

    const response: Promise<string> =
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Mr. Fridge",
          body: generateTodayMessage(item),
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: expDate,
        },
      });
    await storeNotifIdForItem(item, await response); // Add new notification to db
    console.log(
      `Same Day Notification scheduled for ${item.name}, id ${item.id} on ${expDate} with ID ${await response}`,
    );
  }

  // Responsible for making a three day and same day notif
  async function scheduleItemReminder(item: ItemType) {
    await removeItemReminder(item);
    await scheduleThreeDayReminder(item);
    await scheduleNowReminder(item);
  }

  return (
    <NotificationsContext.Provider
      value={{
        scheduleDailyReminder,
        removeItemReminder,
        scheduleItemReminder,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsData = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (!context)
    throw new Error(
      "useNotificationsData must be used within a NotificationsProvider",
    );
  return context;
};
