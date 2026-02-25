import React from "react";
import { Button, View } from "react-native";
import { useData } from "../DataContext";
import { sendExpiringItemsNotification } from "../utils/backgroundTasks";

export default function TestExpoGoNotifsButton() {
  const { database } = useData();

  const runDevNotification = async () => {
    try {
      if (!database) {
        console.log("DB not ready yet!");
        return;
      }
      await sendExpiringItemsNotification(database);

      console.log("Dev notification triggered via sendExpiringItemsNotification");
    } catch (err) {
      console.error("Dev notification error:", err);
    }
  };

  return (
    <View className="p-10">
      {__DEV__ && (
        <Button
          title="Trigger Expiration Notification (Dev)"
          onPress={runDevNotification}
        />
      )}
    </View>
  );
}
