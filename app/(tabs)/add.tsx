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
import { calculateDaysTilExp } from "../itemFunctions";

export default function add() {
  const { id } = useLocalSearchParams(); // Used for the update version of the function

  // Variables in control of the record values
  // CURRENTLY: expiration date holds the date in the future the product will expire
  //  (if given, else it holds the current day).
  // BUT the date isn't show to the user unless updating so I may change this
  const [name, setName] = useState("");
  const [daysTilExp, setDaysTilExp] = useState("0");
  const [locationId, setLocationId] = useState("1"); // Currently defaults to 1 (fridge)

  // Controls if the user is updating or adding an item for the first time
  const [editMode, setEditMode] = useState(false);

  // Loads the items databse into the variable
  const database = useSQLiteContext();

  // Checks if the id exists, which determines if we're in "edit mode"
  useEffect(() => {
    if (id) {
      setEditMode(true);
      loadData();
    }
  }, [id]);

  // If in edit mode, this gets the values from the table associated with the id
  const loadData = async () => {
    const result = await database.getFirstAsync<{
      name: string;
      expiration_date: string;
      location_id: string;
    }>("SELECT name, expiration_date, location_id FROM items WHERE id = ?;", [
      parseInt(id as string),
    ]);
    setName(result!.name as string); // Probably not best practice
    setLocationId(result!.location_id as string);

    // ! New date logic
    const itemExpireDate = new Date(result!.expiration_date as string);
    setDaysTilExp(calculateDaysTilExp(itemExpireDate).toString());
  };

  const handleSubmit = async () => {
    // ! New date logic
    const today = new Date();
    const dateToInsert = new Date();
    dateToInsert.setDate(today.getDate() + parseInt(daysTilExp));

    try {
      database.runAsync(
        "INSERT INTO items (name, expiration_date, location_id) VALUES (?, ?, ?);",
        [name, dateToInsert.toISOString(), locationId]
      );
      // Restore defaults
      setName("");
      setLocationId("1");

      // ! New date logic
      setDaysTilExp("0");
    } catch (error) {
      console.log(error);
    }
  };

  // Clears values on new load of the page/screen
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setName("");
        setLocationId("1");

        // ! New date logic
        setDaysTilExp("0");
      };
    }, [])
  );

  // Button trigger for update
  const handleUpdate = async () => {
    try {
      // ! New date logic
      const today = new Date();
      const dateToInsert = new Date();
      dateToInsert.setDate(today.getDate() + parseInt(daysTilExp));

      const response = await database.runAsync(
        `UPDATE items SET name = ?, expiration_date = ?, location_id = ? WHERE id = ?`,
        [name, dateToInsert.toISOString(), locationId, parseInt(id as string)]
      );
      console.log("Item updated successfully: ", response?.changes!);
      router.back();
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

  // Acutal component
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
            placeholder="DaysTilExp"
            defaultValue={daysTilExp.toString()}
            onChangeText={(newText) => setDaysTilExp(newText)}
            className="rounded-md p-4 mt-0 bg-gray-200 text-xl text-gray-500"
          />
          <TextInput
            placeholder="Location"
            defaultValue={locationId.toString()}
            onChangeText={(newText) => setLocationId(newText)}
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
