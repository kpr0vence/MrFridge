import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function add() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const database = useSQLiteContext();

  const handleSubmit = async () => {
    try {
      database.runAsync("INSERT INTO users (name, email) VALUES (?, ?);", [
        name,
        email,
      ]);
      setName("");
      setEmail("");
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setName("");
        setEmail("");
      };
    }, [])
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View className="bg-white p-6 rounded-md w-4/5 flex-col gap-4">
          <TextInput
            placeholder="Name"
            defaultValue={name}
            onChangeText={(newText) => setName(newText)}
            className="rounded-md p-4 mt-0 bg-gray-200 text-xl text-gray-500"
          />
          <TextInput
            placeholder="Email"
            defaultValue={email}
            onChangeText={(newText) => setEmail(newText)}
            className="rounded-md p-4 mt-0 bg-gray-200 text-xl text-gray-500"
          />
        </View>
        <Pressable
          onPress={handleSubmit}
          className="bg-green-600 p-4 rounded-md"
        >
          <Text className="text-white">Add Item</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}
