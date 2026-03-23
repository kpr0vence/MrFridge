import * as Notifications from "expo-notifications";
import { createContext, ReactNode, useContext } from "react";
import { calculateDaysTilExp } from "./item.utils";
import { ItemType } from "./types";

interface NotificationsContextType {
  scheduleDailyReminder(): Promise<void>;
  removeItemReminder(id: number, locationId: number): Promise<void>;
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

  // Helper function to put the logic on one place
  function generateNotifId(item: ItemType): string {
    return `${item.location_id}${item.id}`;
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
  async function removeItemReminder(id: number, locationId: number) {
    const notificationIdBase = `${locationId}${id}`;
    const threeDaysId = `${notificationIdBase}three`;
    const nowDaysId = `${notificationIdBase}now`;

    await Notifications.cancelScheduledNotificationAsync(threeDaysId);
    await Notifications.cancelScheduledNotificationAsync(nowDaysId);
    console.log(`Notifications ${threeDaysId} and ${nowDaysId} canceled.`);
  }

  async function scheduleThreeDayReminder(
    item: ItemType,
    notificationIdBase: string,
  ) {
    const threeDaysId = `${notificationIdBase}three`;
    const threeDaysTilExp: Date = generateThreeDaysTillExp(item);
    const now = new Date();

    await Notifications.cancelScheduledNotificationAsync(threeDaysId);
    console.log(
      `Attempted to remove old notificaion (if exists): ${threeDaysId}`,
    );

    if (threeDaysTilExp <= now) return; // Don't schedule a three day reminder if theres less than 3 days left

    // Make a new notification with the provided info
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
      identifier: threeDaysId,
    });
    console.log(
      "Three Day Notification scheduled for " + threeDaysTilExp + " with ID:",
      threeDaysId,
    );
  }

  async function scheduleNowReminder(
    item: ItemType,
    notificationIdBase: string,
  ) {
    const nowDaysId = `${notificationIdBase}now`;
    const expDate = new Date(item.expiration_date);
    await Notifications.cancelScheduledNotificationAsync(nowDaysId);
    console.log(
      `Attempted to remove old notificaion (if exists): ${nowDaysId}`,
    );

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
      identifier: nowDaysId,
    });
    console.log(
      "Same Day Notification scheduled for " + expDate + " with ID:",
      nowDaysId,
    );
  }

  // Responsible for making a three day and same day notif
  async function scheduleItemReminder(item: ItemType) {
    const notificationId = generateNotifId(item);
    scheduleThreeDayReminder(item, notificationId);
    scheduleNowReminder(item, notificationId);
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
