import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { GuessType } from "../types";
import DialogueButtonGroup from "./DialogueButtonGroup";

interface props {
  item: GuessType;
  onConfirm: (item: GuessType) => void;
}

// Renders a form item. On confirm callback function to add to parent's list
// on delete and on confirm remove item from view
export default function VerifyGuessFormItem({ item, onConfirm }: props) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
  const [name, setName] = useState<string>(item.guessedItem);
  const [estimation, setEstimation] = useState<number>(88);
  const [location, setLocation] = useState<number>(1);

  function updateEstimation(name: String, location: number) {
    // Handle update logic
    setEstimation((prev) => prev + 1);
  } // Do I need both?

  function handleClickOff() {
    setEstimation((prev) => prev + 1);
  }

  function handleLocationChange(newLocation: number) {
    updateEstimation(name, newLocation);
    setLocation(newLocation);
  }

  function handleEstimationChange(text: string) {
    // Convert the input string back to a number using the unary plus operator or parseInt/parseFloat
    const numericValue = +text;
    // You might also want to add validation here to ensure it's a valid number before setting the state
    if (!isNaN(numericValue)) {
      setEstimation(numericValue);
    }
  }

  function handleConfirm(item: GuessType) {
    onConfirm(item);
    setIsModalVisible(false);
  }

  function handleDelete() {
    setIsModalVisible(false);
  }
  // The delete and confrim buttons are the form submission
  // make a form for name location and time estimate
  // wire the functions for those
  return (
    isModalVisible && (
      // Todo: Consider turning this into a modal, so it can slide in/out
      // TODO: fix infinite scroll bug that happens when you open keyboard after "deleting/confirming" an item
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // or 'height', 'position'
        key={item.id}
        className="border-b-2 border-gray-300 mb-2"
      >
        <View className="flex-row gap-3 items-center mb-4 justify-between  p-5 pb-0">
          <View className="flex-col gap-4 ">
            <View className="bg-gray-200  text-gray-500 rounded-md p-4">
              <TextInput
                value={name}
                onChangeText={setName}
                onBlur={handleClickOff}
                className="text-lg font-bold text-center"
              />
            </View>
            <View className=" ">
              <DialogueButtonGroup
                location={location}
                setLocation={setLocation}
                locationChange={handleLocationChange}
              />
            </View>
          </View>

          <View className="flex-col gap-4 w-1/2">
            <Text className="text-gray-800 text-lg font-bold text-center">
              Estimated Days Until Spoilage
            </Text>
            <View className="bg-gray-200  text-gray-500 rounded-md p-4">
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
            <MaterialCommunityIcons name={"delete"} color={"#fff"} size={24} />
          </Pressable>
          <Pressable
            onPress={() => handleConfirm(item)}
            className="w-1/4 p-2 rounded-full items-center justify-center bg-green-600"
          >
            <Ionicons name="checkmark" color={"#fff"} size={24} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    )
  );
}
