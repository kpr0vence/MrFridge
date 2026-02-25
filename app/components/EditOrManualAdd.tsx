import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { calculateDaysTilExp } from "../../utils/item.utils";
import { ItemToAdd, ItemType } from "../../utils/types";
import DialogueButtonGroup from "./buttons/DialogueButtonGroup";

interface props {
  editMode: boolean;
  modalVisible: {
    isModalVisable: boolean;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  };

  originalItem?: ItemType;
  onAdd?: (item: ItemToAdd) => void;
  onUpdate?: (item: ItemType) => void;
}

// Handles either editing an existing item, where the item and its estimation are already given
//  OR adding a new item where not even the item name exists yet
export default function EditOrManualAdd({
  editMode,
  originalItem,
  modalVisible,
  onAdd,
  onUpdate,
}: props) {
  //   const [isModalVisible, setIsModalVisible] = useState<boolean>(true);

  const [name, setName] = useState<string>("");
  const [estimation, setEstimation] = useState<string>("0");
  const [locationStatus, setLocationStatus] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (originalItem && editMode) {
      setName(originalItem.name);
      setEstimation(
        calculateDaysTilExp(originalItem.expiration_date).toString(),
      );
      setLocationStatus(originalItem.location_id);
    }
  }, [originalItem]);

  function handleNameChange(text: string) {
    setName(text);
  }

  function handleEstimationChange(text: string) {
    // Allow empty string and "-"
    if (/^-?\d*$/.test(text)) {
      setEstimation(text);
    }
  }

  function handleLocationChange(newLocation: 1 | 2 | 3) {
    setLocationStatus(newLocation);
  }

  function handleSubmit() {
    // either way, we're going to pass all of the options to the hanlde change function we're given. Then clonse
    // TODO: Later add success and failure indicators
    if (editMode && originalItem && onUpdate) {
      const updateItem: ItemType = {
        id: originalItem?.id,
        name: name,
        expiration_date: estimation.toString(),
        location_id: locationStatus,
      };
      onUpdate(updateItem);
    }
    if (onAdd) {
      const addItem: ItemToAdd = {
        name: name,
        locationId: locationStatus,
        daysTilExp: estimation.toString(),
      };
      onAdd(addItem);
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible.isModalVisable}
      onRequestClose={() => modalVisible.setIsModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {/*  <View className="">
        <View className="*/}
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="bg-white rounded-md w-4/5 flex-col gap-4  items-center mb-4 justify-between p-5">
            <View className="flex-row items-center justify-between gap-4">
              <Text className="text-gray-800 text-xl font-bold">Name</Text>
              <TextInput
                placeholder="Name"
                value={name}
                onChangeText={(newText) => handleNameChange(newText)}
                className="rounded-md p-4 mt-0 bg-gray-200 text-xl text-gray-500 w-3/4"
              />
            </View>

            <View className="flex-row gap-4 items-center">
              <TextInput
                value={estimation}
                onChangeText={(newText) => {
                  handleEstimationChange(newText);
                }}
                keyboardType="numeric"
                className="rounded-md p-4 mt-0 bg-gray-200 text-xl w-1/3 text-gray-500"
              />
              <Text className="text-gray-800 text-xl font-bold">
                Days Until Expiration
              </Text>
            </View>

            <View className="flex-row items-center justify-between gap-4">
              <Text className="text-gray-800 text-xl font-bold">Stored In</Text>
              <DialogueButtonGroup
                location={locationStatus}
                setLocation={setLocationStatus}
                locationChange={handleLocationChange}
              />
            </View>
            <View className="flex-row justify-between w-full gap-">
              <Pressable
                onPress={() => {
                  modalVisible.setIsModalVisible(false);
                }} // handle discard changes
                className=" rounded-full p-4 items-center justify-center bg-red-600"
              >
                <Text className="text-white text-lg font-bold">
                  {editMode ? "Discard Changes" : "Cancel Add"}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit} // handle Confrim
                className="rounded-full p-4 items-center justify-center bg-green-600"
              >
                <Text className="text-white text-lg font-bold">
                  {editMode ? "Update Item" : "Add Item"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
