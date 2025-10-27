import { Dispatch, SetStateAction, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { item } from "../types";

interface EditItemModalProps {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  item: item;
  setItemVar: React.Dispatch<SetStateAction<item>>;
}

export default function EditItemModal({
  isModalVisible,
  setIsModalVisible,
  item,
  setItemVar,
}: EditItemModalProps) {
  // Variables to track the form data
  const [name, setName] = useState(item.name || "");
  const [daysUntilExpiration, setDaysUntilExpiration] = useState(String(9));
  const [moveTo, setMoveTo] = useState("--Don't Move--");

  // On submit, we need to do minor validation (make sure I can conver to number for days),
  // Find values that have been changed (only change those values)
  // TODO: What do I do about redrawing the screen if name/location/days is edited?
  const handleSubmit = () => {
    const result: Record<string, any> = {};

    if (name.trim() !== "") result.name = name.trim();
    if (daysUntilExpiration.trim() !== "")
      result.daysUntilExpiration = parseInt(daysUntilExpiration);
    if (moveTo !== "--Don't Move--") result.moveTo = moveTo;

    console.log("Form data:", result); // Handle update logic

    // Handle updates TEMP CODE until there is a backend and server with more formal writing
    item.name = result.name;
    item.expireDate = makeDayXDaysAway(result.daysUntilExpiration);
    console.log("NEW EXPIRE DATE: " + item.expireDate);

    setItemVar(item);

    setIsModalVisible(false);
  };

  const handleDiscard = () => {
    // Reset to defaults
    setName(item.name);
    setDaysUntilExpiration("9");
    setMoveTo("--Don't Move--");

    setIsModalVisible(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white p-6 rounded-md w-4/5 flex-col gap-4">
          {/* Name Input */}
          <TextInput
            className="rounded-md p-4 mt-0 bg-gray-200 text-xl text-gray-500"
            value={name}
            onChangeText={setName}
            placeholder="Item Name"
            style={{ textAlignVertical: "center" }}
          />

          {/* Days Until Expiration */}
          <View className="flex-row gap-4 items-center">
            <TextInput
              className="rounded-md p-4 bg-gray-200 w-1/3 text-xl  text-gray-500"
              value={daysUntilExpiration}
              onChangeText={setDaysUntilExpiration}
              keyboardType="numeric"
              placeholder="X"
              style={{ textAlignVertical: "center" }}
            />
            <Text className="text-gray-800 text-xl font-bold">
              Days until Expiration
            </Text>
          </View>

          {/* Move To Dropdown */}
          <Text>TODO: Change location dropdown </Text>

          {/* Buttons */}
          <View className="flex-row justify-between mt-4">
            <Pressable
              className="bg-red-600 p-4 rounded-md"
              onPress={handleDiscard}
            >
              <Text className="text-black text-lg font-bold">Discard</Text>
            </Pressable>
            <Pressable
              className="bg-green-600 p-4 rounded-md"
              onPress={handleSubmit}
            >
              <Text className="text-white text-lg font-bold">Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
function makeDayXDaysAway(num: number): Date {
  const toReturn: Date = new Date();
  toReturn.setDate(toReturn.getDate() + num);

  return toReturn;
}
