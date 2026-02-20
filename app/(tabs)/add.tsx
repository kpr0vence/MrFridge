import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import EditOrManualAdd from "../components/EditOrManualAdd";
import { useData } from "../DataContext";
import { ItemToAdd, ItemType } from "../utils/types";

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
    <View>
      <View className="w-screen flex-row justify-around gap-5 p-4">
        <Pressable
          onPress={() => {
            setIsModalVisible(true);
          }}
          className="bg-red-600 p-4 rounded-md"
        >
          <Text className="text-white">Add Manually</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/PhotoAdd",
            });
          }}
          className="bg-green-600 p-4 rounded-md"
        >
          <Text className="text-white">Add by Photo</Text>
        </Pressable>
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
