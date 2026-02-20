import { Dispatch, SetStateAction, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useData } from "../DataContext";
import { ItemType } from "../utils/types";

interface EditItemModalProps {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
  item: ItemType;
}

export default function EditItemModal({
  isModalVisible,
  setIsModalVisible,
  item,
}: EditItemModalProps) {
  const { handleUpdate, calculateDaysTilExp } = useData();

  // Form state
  const [name, setName] = useState(item.name || "");
  const [daysUntilExpiration, setDaysUntilExpiration] = useState(
    String(calculateDaysTilExp(item.expiration_date)),
  );

  // Dropdown state
  const [open, setOpen] = useState(false);
  const [moveTo, setMoveTo] = useState<1 | 2 | 3 | null>(
    item.location_id || null,
  );
  const [items, setItems] = useState([
    { label: "Fridge", value: 1 },
    { label: "Pantry", value: 2 },
    { label: "Freezer", value: 3 },
  ]);

  const handleSubmit = () => {
    const result = {
      name: item.name,
      daysUntilExpiration: calculateDaysTilExp(item.expiration_date),
      moveTo: item.location_id,
    };

    const trimmedName = name.trim();
    if (trimmedName.length > 0) result.name = trimmedName;

    const trimmedDays = daysUntilExpiration.trim();
    if (trimmedDays.length > 0) {
      const parsedDays = parseInt(trimmedDays, 10);
      if (!isNaN(parsedDays)) result.daysUntilExpiration = parsedDays;
    }

    if (moveTo !== null) result.moveTo = moveTo;

    console.log("Form data being submitted:", result);

    handleUpdate(
      item.id,
      result.name,
      result.moveTo,
      result.daysUntilExpiration.toString(),
    );

    setIsModalVisible(false);
  };

  const handleDiscard = () => {
    setName(item.name);
    setDaysUntilExpiration(String(calculateDaysTilExp(item.expiration_date)));
    setMoveTo(item.location_id || null);
    setIsModalVisible(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
      key={item.id}
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
              className="rounded-md p-4 bg-gray-200 w-1/3 text-xl text-gray-500"
              value={daysUntilExpiration}
              onChangeText={setDaysUntilExpiration}
              keyboardType="numeric"
              placeholder="X"
              style={{ textAlignVertical: "center" }}
            />
            <Text className="text-gray-800 text-xl font-bold">
              Days Until Expiration
            </Text>
          </View>

          {/* Move To Dropdown */}
          <Text className="text-gray-600 text-lg font-medium mt-2">
            Move To
          </Text>
          <DropDownPicker
            open={open}
            value={moveTo}
            items={items}
            setOpen={setOpen}
            setValue={setMoveTo}
            setItems={setItems}
            placeholder="--Don't Move--"
            style={{
              backgroundColor: "#e5e7eb",
              borderRadius: 8,
              borderWidth: 0,
              paddingHorizontal: 12,
              height: 50,
            }}
            dropDownContainerStyle={{
              backgroundColor: "#f9fafb",
              borderRadius: 8,
              borderWidth: 4,
              borderColor: "#e5e7eb",
            }}
            textStyle={{
              fontSize: 18,
              color: "#6b7280",
            }}
            placeholderStyle={{
              color: "#9ca3af",
            }}
            containerStyle={{ marginBottom: 16 }}
          />

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
