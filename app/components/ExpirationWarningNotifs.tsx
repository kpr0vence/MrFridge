import { useState } from "react";
import { Switch, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ExpirationWarningDetails from "./ExpirationWarningDetails";

export default function ExpirationWarningNotifs() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View className="p-4">
      <Text className="font-bold text-3xl text-black pb-4">
        Expiration Warning
      </Text>
      <View className="flex-row items-between gap-4">
        <Text className="text-gray-500 text-2xl w-3/4">
          Notify me when groceries are close to expiration
        </Text>
        <SafeAreaProvider>
          <View className="flex-row justify-end">
            <Switch
              trackColor={{ false: "#767577", true: "#41d78f" }}
              thumbColor={isEnabled ? "#fff" : "#fff"}
              ios_backgroundColor="#e5e7eb"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </SafeAreaProvider>
      </View>
      <View className=" h-0.5 bg-gray-300 w-full" />
      <ExpirationWarningDetails
        isModalVisible={isEnabled}
        setIsModalVisible={toggleSwitch}
      />
    </View>
  );
}
