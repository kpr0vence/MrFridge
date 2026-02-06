import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function Add() {
  // Acutal component
  return (
    <View>
      <View className="w-screen flex-row justify-around gap-5 p-4">
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/ManualAdd",
            });
          }}
          className="bg-red-600 p-4 rounded-md"
        >
          <Text className="text-white">Add Manually</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/PhotoAdd",
            });
          }}
          className="bg-green-600 p-4 rounded-md"
        >
          <Text className="text-white">Add by Photo</Text>
        </Pressable>
      </View>
    </View>
  );
}
