import * as Notifications from "expo-notifications";
import { SQLiteDatabase } from "expo-sqlite";
import React from "react";
import { Button, View } from "react-native";
import { useData } from "../DataContext";
import { fetchExpiringItems } from "../utils/backgroundTasks";

export default function TestNotifsButton() {
  const { database } = useData();

  const runDevNotification = async () => {
    try {
      // 🔹 Debug: log all rows in the items table
      const allRows = await database.getAllAsync("SELECT * FROM items;");
      console.log("All items in DB:", allRows);

      if (!database) {
        console.log("DB not ready yet!");
        return;
      }

      // Use provider DB for dev testing
      const allItems = await fetchExpiringItems(database as SQLiteDatabase);
      console.log("All Items: ", allItems);
      // const itemsToNotify = getItemsCloseToExpired(allItems);
      const itemsToNotify = allItems;

      if (itemsToNotify.length === 0) {
        console.log("No items near expiration!");
        return;
      }

      let message: string;
      if (itemsToNotify.length <= 3) {
        message = itemsToNotify.map((i) => i.name).join(", ");
      } else {
        const closest = itemsToNotify[0];
        message = `${closest.name} and ${itemsToNotify.length - 1} other items are expiring soon`;
      }

      await Notifications.scheduleNotificationAsync({
        content: { title: "Mr. Fridge (Dev Test)", body: message },
        trigger: null,
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
