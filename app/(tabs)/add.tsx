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
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [locationId, setLocationId] = useState(1);
  const [doSubmit, setDoSubmit] = useState(false);

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
      name: string;
      expiration_date: string;
      location_id: string;
    }>("SELECT name, expiration_date, location_id FROM items WHERE id = ?;", [
      parseInt(id as string),
    ]);
    setName(result!.name as string); // Probably not best practice
    setExpirationDate(new Date(result!.expiration_date as string));
    setLocationId(parseInt(result!.location_id as string));
  };

  useEffect(() => {
    if (doSubmit) {
      console.log("New expDate: " + expirationDate);

      try {
        database.runAsync(
          "INSERT INTO items (name, expiration_date, location_id) VALUES (?, ?, ?);",
          [name, expirationDate.toISOString(), locationId]
        );
        // Restore defaults
        setName("");
        setExpirationDate(new Date());
        setLocationId(1);
      } catch (error) {
        console.log(error);
      }
    }
  }, [doSubmit]);

  const handleSubmit = async () => {
    // Adding a fake number of days to the date
    const calculatedDate = new Date();
    calculatedDate.setDate(expirationDate.getDate() + 50);
    console.log(
      "New date: " + calculatedDate + " Old exp_date: " + expirationDate
    );
    setExpirationDate(calculatedDate);
    setDoSubmit(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setName("");
        setExpirationDate(new Date());
        setLocationId(1);
      };
    }, [])
  );

  const handleUpdate = async () => {
    try {
      const response = await database.runAsync(
        `UPDATE items SET name = ?, expiration_date = ?, location_id = ? WHERE id = ?`,
        [name, expirationDate.toISOString(), locationId, parseInt(id as string)]
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
            placeholder="Date"
            defaultValue={expirationDate.toISOString()}
            onChangeText={(newText) => setExpirationDate(new Date())}
            className="rounded-md p-4 mt-0 bg-gray-200 text-xl text-gray-500"
          />
          <TextInput
            placeholder="Location"
            defaultValue={locationId.toString()}
            onChangeText={(newText) => setLocationId(parseInt(newText))}
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
