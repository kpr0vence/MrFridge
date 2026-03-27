import * as Notifications from "expo-notifications";
import { Button } from "react-native";

export function GeneralNotifsTest() {
  async function triggerTask() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "TEST",
        body: "This should fire in 5 seconds",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
      },
    });
  }

  return <Button title="Trigger Notifs" onPress={triggerTask} />;
}
