import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, View } from "react-native";

export default function BackButton() {
  return (
    // <View className="flex-1 relative bg-red-700">
    <Pressable
      onPress={() => router.back()}
      className="absolute  bottom-10 left-5 z-50"
    >
      <View className="bg-black rounded-full p-4 items-center justify-center opacity-45">
        <Ionicons name="arrow-back-outline" color="white" size={20} />
      </View>
    </Pressable>
    // </View>
  );
}
