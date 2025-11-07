import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function add() {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editMode, setEditMode] = useState(false);

  const database = useSQLiteContext();

  useEffect(() => {
    if (id) {
      setEditMode(true);
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    const result = await database.getFirstAsync<{
      name: String;
      email: string;
    }>("SELECT name, email FROM users WHERE id = ?;", [parseInt(id as string)]);
    setName(result!.name as string); // Probably not best practice
    setEmail(result!.email);
  };

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

  const handleUpdate = async () => {
    try {
      const response = await database.runAsync(
        `UPDATE users SET name = ?, email = ? WHERE id = ?`,
        [name, email, parseInt(id as string)]
      );
      console.log("Item updated successfully: ", response?.changes!);
      router.back();
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

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
          onPress={() => {
            setEditMode(false);
            router.back();
          }}
          className="bg-red-600 p-4 rounded-md"
        >
          <Text className="text-white">Cancel</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            editMode ? handleUpdate() : handleSubmit();
          }}
          className="bg-green-600 p-4 rounded-md"
        >
          <Text className="text-white">{editMode ? "Update" : "Add Item"}</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}
