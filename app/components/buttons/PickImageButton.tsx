import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, View } from "react-native";

type Props = {
  label: string;
  theme?: "primary" | "tertiary";
  onPress?: () => void;
};

export default function PickImageButton({ label, theme, onPress }: Props) {
  if (theme === "primary") {
    return (
      <View className="bg-[#41d78f] rounded-full justify-center items-center p-4">
        <Pressable onPress={onPress}>
          <Ionicons name="add" color="white" size={40} />
          {/* <Text className="text-white text-lg">{label}</Text> */}
        </Pressable>
      </View>
    );
  }

  if (theme === "tertiary") {
    return (
      <View className="bg-red-600 rounded-full justify-center items-center p-4">
        <Pressable onPress={onPress}>
          <Ionicons name="close" color="white" size={40} />
          {/* <Text className="text-white text-lg">{label}</Text> */}
        </Pressable>
      </View>
    );
  }

  return (
    <View className="bg-green-600 rounded-full justify-center items-center p-4">
      <Pressable onPress={onPress}>
        {/* <Text className="text-white text-lg text-center">{label}</Text> */}
        <Ionicons name="checkmark" color="white" size={40} />
      </Pressable>
    </View>
  );
}
