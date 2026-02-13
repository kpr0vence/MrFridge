import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export interface ManualAddFormProps {
  updateName: React.Dispatch<React.SetStateAction<string>>;
  daysTilExpState: {
    daysTilExp: string;
    setDaysTilExp: React.Dispatch<React.SetStateAction<string>>;
  };
  editModeState: {
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  };
  submit: () => Promise<void>;
  moveToState: {
    moveTo: 1 | 2 | 3 | null;
    setMoveTo: React.Dispatch<React.SetStateAction<1 | 2 | 3 | null>>;
  };
}

interface props {
  props: ManualAddFormProps;
}

export default function ManualAddForm({ props }: props) {
  // Dropdown state
  const [open, setOpen] = useState(false);

  const [items, setItems] = useState([
    { label: "Fridge", value: 1 },
    { label: "Pantry", value: 2 },
    { label: "Freezer", value: 3 },
  ]);

  return (
    <View className="flex-col gap-4">
      <View className="flex-row items-center justify-between gap-4">
        <Text className="text-gray-800 text-xl font-bold">Name</Text>
        <TextInput
          placeholder="Name"
          //   defaultValue={name}
          onChangeText={(newText) => props.updateName(newText)}
          className="rounded-md p-4 mt-0 bg-gray-200 text-xl text-gray-500 w-3/4"
        />
      </View>

      <View className="flex-row gap-4 items-center">
        <TextInput
          placeholder="DaysTilExp"
          defaultValue={props.daysTilExpState.daysTilExp.toString()}
          onChangeText={(newText) =>
            props.daysTilExpState.setDaysTilExp(newText)
          }
          keyboardType="numeric"
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
          value={props.moveToState.moveTo}
          items={items}
          setOpen={setOpen}
          setValue={props.moveToState.setMoveTo}
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
            props.editModeState.setEditMode(false);
            router.back();
          }}
          className="bg-red-600 p-4 rounded-md"
        >
          <Text className="text-white">Cancel</Text>
        </Pressable>
        <Pressable
          onPress={props.submit}
          className="bg-green-600 p-4 rounded-md"
        >
          <Text className="text-white">
            {props.editModeState.editMode ? "Update" : "Add Item"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
