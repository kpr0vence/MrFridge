import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useData } from "../../utils/DataContext";
import { ItemToAdd, ItemType } from "../../utils/types";
import EditOrManualAdd from "../components/EditOrManualAdd";

export default function Add() {
  const { handleSubmit, handleUpdate } = useData();
  const [isModalVisable, setIsModalVisible] = useState<boolean>(false);
  const [actionSuccessful, setActionSuccessful] = useState<
    boolean | undefined
  >();
  function actionIsSuccessful() {
    setActionSuccessful(true);
  }

  function actionNotSuccessful() {
    setActionSuccessful(false);
  }

  // Has behavior for failed submission AFTER param checks
  async function submitCheckedParams(submissionItem: ItemToAdd) {
    await handleSubmit(
      [submissionItem],
      actionIsSuccessful,
      actionNotSuccessful,
    );
  }

  async function onSubmit(submissionItem: ItemToAdd) {
    if (
      submissionItem.name.trim() === "" ||
      submissionItem.daysTilExp.trim() === "" ||
      submissionItem.locationId === null
    ) {
      Alert.alert("Please fill out each field.");
      return;
    }
    try {
      parseInt(submissionItem.daysTilExp);
    } catch (error) {
      Alert.alert(
        "Please make sure the 'Days Until Expiration' field is a number",
      );
      return;
    }
    await submitCheckedParams(submissionItem);
    setIsModalVisible(false);
  }

  function onUpdate(updateItem: ItemType) {
    handleUpdate(
      updateItem.id,
      updateItem.name,
      updateItem.location_id,
      updateItem.expiration_date,
    );
  }

  // Acutal component
  return (
    <View className="bg-white">
      {/* <View className="w-screen flex-row justify-around gap-5 p-4"> */}
      <View className="flex-col gap-4 p-4 items-center border-solid border-b-2 border-gray-200">
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/PhotoAdd",
            });
          }}
          className="bg-green-600 w-2/3 p-4 rounded-md"
        >
          <Text className="text-white text-center">Add by Photo</Text>
        </Pressable>
        <Text className="text-3xl font-semibold text-center">
          Upload a Photo of your Receipt
        </Text>
        <Text className="mb-4 text-lg ">
          Mr. Fridge will perform ocular character recognition to read the lines
          on the receipt, and then estimate what grocery item each line
          represents, and how long it is expected to last.
        </Text>
      </View>
      <View className="flex-col gap-4 p-4 items-center border-solid border-b-2 border-gray-200">
        <Pressable
          onPress={() => {
            setIsModalVisible(true);
          }}
          className="bg-green-800 p-4 rounded-md w-2/3"
        >
          <Text className="text-white text-center">Add Manually</Text>
        </Pressable>
        <Text className="text-2xl font-semibold text-center">
          Enter the Name of an Item
        </Text>
        <Text className="mb-4 text-lg ">
          Type in the name of an item and select it's location, and Mr. Fridge
          will create an estimate for the entered item. This method is best used
          for single items, or items with very unique names that Mr. Fridge
          might not recognize.
        </Text>
      </View>
      <EditOrManualAdd
        editMode={false}
        onAdd={onSubmit}
        modalVisible={{
          isModalVisable: isModalVisable,
          setIsModalVisible: setIsModalVisible,
        }}
      />
    </View>
  );
}
