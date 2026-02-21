import * as Notifications from "expo-notifications";
import React from "react";
import { Button, View } from "react-native";
import { useData } from "../DataContext";
import { fetchExpiringItems } from "../utils/backgroundTasks";
import { getItemsCloseToExpired } from "../utils/item.utils";
import { SQLiteDatabaseWithTransaction } from "../utils/types";

export default function TestNotifsButton() {
  const { database } = useData();
  const runDevNotification = async () => {
    try {
      const allItems = await fetchExpiringItems(
        database as SQLiteDatabaseWithTransaction,
      );
      const itemsToNotify = getItemsCloseToExpired(allItems);

      if (itemsToNotify.length === 0) {
        console.log("No items near expiration!");
        return;
      }

      let message: string;
      if (itemsToNotify.length <= 3) {
        message = itemsToNotify.map((i) => i.name).join(", ");
      } else {
        const closest = itemsToNotify[0];
        message = `${closest.name} expires soon, plus ${itemsToNotify.length - 1} other items`;
      }

      await Notifications.scheduleNotificationAsync({
        content: { title: "Grocery Alert 🛒 (Dev Test)", body: message },
        trigger: null, // shows immediately
      });

      console.log("Dev notification sent!");
    } catch (err) {
      console.error("Dev notification error:", err);
    }
  };

  return (
    <View style={{ padding: 10 }}>
      {__DEV__ && (
        <Button
          title="Trigger Expiration Notification (Dev)"
          onPress={runDevNotification}
        />
      )}
    </View>
  );
}
