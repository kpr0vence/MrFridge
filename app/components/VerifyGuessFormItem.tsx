import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { GuessType } from "../../utils/types";
import DialogueButtonGroup from "./buttons/DialogueButtonGroup";

interface Props {
  item: GuessType;
  updateItem: (id: number, item: GuessType) => void;
  removeItem: (id: number) => void;
}

export default function VerifyGuessFormItem({
  item,
  updateItem,
  removeItem,
}: Props) {
  const [isVisible, setIsVisible] = useState(true);

  const [name, setName] = useState<string>(item.guessedItem);
  const [estimation, setEstimation] = useState<number>(
    parseInt(item.daysTilExp) || 0,
  );
  const [locationStatus, setLocationStatus] = useState<1 | 2 | 3>(
    item.location,
  );

  function handleNameChange(text: string) {
    setName(text);

    updateItem(item.id, {
      ...item,
      guessedItem: text,
      location: locationStatus,
      daysTilExp: estimation.toString(),
    });
  }

  function handleEstimationChange(text: string) {
    const numericValue = +text;

    if (!isNaN(numericValue)) {
      setEstimation(numericValue);

      updateItem(item.id, {
        ...item,
        guessedItem: name,
        location: locationStatus,
        daysTilExp: numericValue.toString(),
      });
    }
  }

  function handleLocationChange(newLocation: 1 | 2 | 3) {
    setLocationStatus(newLocation);

    updateItem(item.id, {
      ...item,
      guessedItem: name,
      location: newLocation,
      daysTilExp: estimation.toString(),
    });
  }

  function handleConfirm() {
    if (name.trim() === "") {
      Alert.alert("Please fill out each field.");
      return;
    }

    updateItem(item.id, {
      ...item,
      guessedItem: name,
      location: locationStatus,
      daysTilExp: estimation.toString(),
    });

    setIsVisible(false);
  }

  function handleDelete() {
    removeItem(item.id);
    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    <View className="border-b-2 border-gray-300">
      <View className="flex-row gap-3 items-center mb-4 justify-between p-5 pb-0">
        <View className="flex-col gap-4">
          <View className="bg-gray-200 rounded-md p-4">
            <TextInput
              value={name}
              onChangeText={handleNameChange}
              className="text-lg font-bold text-center"
            />
          </View>

          <DialogueButtonGroup
            location={locationStatus}
            setLocation={setLocationStatus}
            locationChange={handleLocationChange}
          />
        </View>

        <View className="flex-col gap-4 w-1/2">
          <Text className="text-gray-800 text-lg font-bold text-center">
            Estimated Days Until Spoilage
          </Text>

          <View className="bg-gray-200 rounded-md p-4">
            <TextInput
              value={estimation.toString()}
              onChangeText={handleEstimationChange}
              keyboardType="numeric"
              className="text-lg font-bold text-center"
            />
          </View>
        </View>
      </View>

      <View className="flex-row gap-5 justify-center w-full mb-4">
        <Pressable
          onPress={handleDelete}
          className="w-1/4 rounded-full p-2 items-center justify-center bg-red-600"
        >
          <MaterialCommunityIcons name="delete" color="#fff" size={24} />
        </Pressable>

        <Pressable
          onPress={handleConfirm}
          className="w-1/4 p-2 rounded-full items-center justify-center bg-green-600"
        >
          <Ionicons name="checkmark" color="#fff" size={24} />
        </Pressable>
      </View>
    </View>
  );
}
