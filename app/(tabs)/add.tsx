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
import { useData } from "../DataContext";

export default function add() {
  const { id } = useLocalSearchParams(); // Used for the update version of the function
  const { calculateDaysTilExp } = useData();
  const [name, setName] = useState("");
  const [daysTilExp, setDaysTilExp] = useState("0");
  const [locationId, setLocationId] = useState("1"); // Currently defaults to 1 (fridge)

  // Controls if the user is updating or adding an item for the first time
  const [editMode, setEditMode] = useState(false);

  const { handleSubmit, handleUpdate, getItemById } = useData();

  // Checks if the id exists, which determines if we're in "edit mode"
  useEffect(() => {
    if (id) {
      setEditMode(true);
      (async () => {
        const item = await getItemById(parseInt(id as string));
        if (item) {
          setName(item.name);
          setLocationId(item.location_id.toString());
          setDaysTilExp(calculateDaysTilExp(item.expiration_date).toString());
        }
      })();
    }
  }, [id]);

  // Clears values on new load of the page/screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        setName("");
        setLocationId("1");
        setDaysTilExp("0");
      };
    }, [])
  );

  const onSubmit = async () => {
    if (editMode && id) {
      await handleUpdate(
        parseInt(id as string),
        name,
        parseInt(locationId),
        daysTilExp
      );
    } else {
      await handleSubmit(name, locationId, daysTilExp);
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
        <Pressable onPress={onSubmit} className="bg-green-600 p-4 rounded-md">
          <Text className="text-white">{editMode ? "Update" : "Add Item"}</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}
