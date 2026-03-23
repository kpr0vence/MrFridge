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

  function generateMessage(item: ItemType): string {
    const itemTitleCase =
      item.name.charAt(0).toUpperCase() + item.name.slice(1);
    return `${itemTitleCase} is 3 days from expiration!`;
  }

  function generateThreeDaysTillExp(item: ItemType): Date {
    const newDate = new Date();
    const daysTilExp = calculateDaysTilExp(item.expiration_date);
    console.log(item.expiration_date);
    newDate.setDate(newDate.getDate() + (daysTilExp - 3)); // -3 to get three days before exp

    return newDate;
  }

  async function removeItemReminder(id: number, locationId: number) {
    const notificationId = `${locationId}${id}`;
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Notification ${notificationId} canceled.`);
  }

  //   Function to be given an item and schedule it's thingie
  async function scheduleItemReminder(item: ItemType) {
    //Given an id and location, build a unique notif id
    const notificationId = generateNotifId(item);
    const threeDaysTilExp: Date = generateThreeDaysTillExp(item);

    // Delete notif if it's already there (not yet sure if this simply
    // fails silently if its not there or if I need to do a check of some typ first)
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(
      `Attempted to remove old notificaion (if exists): ${notificationId}`,
    );

    // Make a new notification with the provided info
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Mr. Fridge",
        body: generateMessage(item),
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: threeDaysTilExp,
      },
      identifier: notificationId,
    });
    console.log(
      "Notification scheduled for " + threeDaysTilExp + " day(s) with ID:",
      notificationId,
    );
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
