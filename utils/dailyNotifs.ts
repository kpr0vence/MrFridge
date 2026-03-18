import * as Notifications from "expo-notifications";

const DAILY_NOTIFICATION_ID = "daily-kitchen-reminder";

export async function scheduleDailyReminder() {
  // Cancel existing ones to avoid duplicates
  const existing = await Notifications.getAllScheduledNotificationsAsync();

  const alreadyExists = existing.some(
    (n: { identifier: string }) => n.identifier === DAILY_NOTIFICATION_ID,
  );

  if (alreadyExists) return;

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
