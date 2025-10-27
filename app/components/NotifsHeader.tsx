import { Text, View } from "react-native";

export default function NotifsHeader() {
  return (
    <View className="">
      <View className="pt-safe-offset-5 p-5 bg-[#41d78f] justify-between flex-col items-center">
        <Text className="text-l text-white pb-0 w-24">Customize</Text>
        <Text className="text-5xl pt-0 mt-0 text-white">Notifications</Text>
      </View>
    </View>
  );
}
