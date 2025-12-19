import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useData } from "../DataContext";

export default function Add() {
  const { id } = useLocalSearchParams(); // Used for the update version of the function
  const { calculateDaysTilExp } = useData();
  const [name, setName] = useState("");
  const [moveTo, setMoveTo] = useState<number | null>(null);
  const [daysTilExp, setDaysTilExp] = useState("0");

  // Controls if the user is updating or adding an item for the first time
  const [editMode, setEditMode] = useState(false);

  // Dropdown state
  const [open, setOpen] = useState(false);

  const [items, setItems] = useState([
    { label: "Fridge", value: 1 },
    { label: "Pantry", value: 2 },
    { label: "Freezer", value: 3 },
  ]);

  const { handleSubmit, handleUpdate, getItemById } = useData();

  // Checks if the id exists, which determines if we're in "edit mode"
  useEffect(() => {
    if (id) {
      setEditMode(true);
      (async () => {
        const item = await getItemById(parseInt(id as string));
        if (item) {
          setName(item.name);
          setMoveTo(item.location_id);
          setDaysTilExp(calculateDaysTilExp(item.expiration_date).toString());
        }
      })();
    }
  }, [id, getItemById, calculateDaysTilExp]);

  // Clears values on new load of the page/screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        setName("");
        setMoveTo(null);
        setDaysTilExp("0");
      };
    }, [])
  );

  const onSubmit = async () => {
    if (editMode && id) {
      await handleUpdate(parseInt(id as string), name, moveTo!, daysTilExp);
    } else {
      await handleSubmit(name, moveTo!.toString(), daysTilExp);
    }

    router.back();
  };

  // Acutal component
  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View className="bg-white p-6 rounded-md w-4/5 flex-col gap-4">
          <View className="flex-row items-center justify-between gap-4">
            <Text className="text-gray-800 text-xl font-bold">Name</Text>
            <TextInput
              placeholder="Name"
              defaultValue={name}
              onChangeText={(newText) => setName(newText)}
              className="rounded-md p-4 mt-0 bg-gray-200 text-xl text-gray-500 w-3/4"
            />
          </View>

          <View className="flex-row gap-4 items-center">
            <TextInput
              placeholder="DaysTilExp"
              defaultValue={daysTilExp.toString()}
              onChangeText={(newText) => setDaysTilExp(newText)}
              className="rounded-md p-4 mt-0 bg-gray-200 text-xl w-1/3 text-gray-500"
            />
            <Text className="text-gray-800 text-xl font-bold">
              Days Until Expiration
            </Text>
          </View>

          <View className="flex-row items-center justify-between gap-4">
            <Text className="text-gray-800 text-xl font-bold">Stored In</Text>
            <DropDownPicker
              open={open}
              value={moveTo}
              items={items}
              setOpen={setOpen}
              setValue={setMoveTo}
              setItems={setItems}
              style={{
                backgroundColor: "#e5e7eb",
                borderRadius: 8,
                borderWidth: 0,
                height: 50,
                width: "70%",
              }}
              dropDownContainerStyle={{
                backgroundColor: "#f9fafb",
                borderRadius: 4,
                borderWidth: 4,
                borderColor: "#e5e7eb",
                width: "70%",
              }}
              textStyle={{
                fontSize: 18,
                color: "#6b7280",
              }}
            />
          </View>
          <View className="flex-row justify-between">
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
              onPress={onSubmit}
              className="bg-green-600 p-4 rounded-md"
            >
              <Text className="text-white">
                {editMode ? "Update" : "Add Item"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
