import * as Notifications from "expo-notifications";

const DAILY_NOTIFICATION_ID = "daily-kitchen-reminder";

// Handles actually scheduling the notifications (interacts
// with the Notification context
export async function scheduleDailyReminder() {
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
