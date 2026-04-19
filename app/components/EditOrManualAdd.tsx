import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useFoodData } from "../../utils/FoodContext";
import { calculateDaysTilExp } from "../../utils/item.utils";
import { Estimation, ItemToAdd, ItemType } from "../../utils/types";
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

export default function EditOrManualAdd({
  editMode,
  originalItem,
  modalVisible,
  onAdd,
  onUpdate,
}: props) {
  const { estimateItemAtLocation, items } = useFoodData();

  const foodItems = useMemo(() => items.map((item) => item.name), [items]);

  const [name, setName] = useState("");
  const [estimation, setEstimation] = useState("0");
  const [locationStatus, setLocationStatus] = useState<1 | 2 | 3>(1);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedName, setDebouncedName] = useState("");

  // makes the text you enter NOT jitter (that was so annoying omg)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedName(name);
    }, 120);
    return () => clearTimeout(timeout);
  }, [name]);

  function resetToDefaults() {
    setName("");
    setEstimation("0");
    setLocationStatus(1);
    setShowSuggestions(false);
  }

  useEffect(() => {
    if (originalItem && editMode) {
      setName(originalItem.name);
      setEstimation(
        calculateDaysTilExp(originalItem.expiration_date).toString(),
      );
      setLocationStatus(originalItem.location_id);
    }
  }, [originalItem]);

  useEffect(() => {
    // Clean form on reopen
    resetToDefaults();
    if (originalItem && editMode) {
      setName(originalItem.name);
      setEstimation(
        calculateDaysTilExp(originalItem.expiration_date).toString(),
      );
      setLocationStatus(originalItem.location_id);
    }
  }, []);

  async function handleNameEditEnd(input: string) {
    if (!input) return;

    const estimation: Estimation = await estimateItemAtLocation(
      input.toLowerCase(),
      locationStatus,
    );

    if (estimation.matchFound) {
      setEstimation(estimation.estimation.toString());
    }
  }

  async function handleLocationChange(newLocation: 1 | 2 | 3) {
    setLocationStatus(newLocation);

    if (!name) return;

    const estimation: Estimation = await estimateItemAtLocation(
      name.toLowerCase(),
      newLocation,
    );

    if (estimation.matchFound) {
      setEstimation(estimation.estimation.toString());
    }
  }

  function handleSubmit() {
    if (editMode && originalItem && onUpdate) {
      const updateItem: ItemType = {
        id: originalItem.id,
        name,
        expiration_date: estimation.toString(),
        location_id: locationStatus,
      };
      onUpdate(updateItem);
    }

    if (onAdd) {
      const addItem: ItemToAdd = {
        name,
        locationId: locationStatus,
        daysTilExp: estimation.toString(),
      };
      onAdd(addItem);
    }

    resetToDefaults();
  }

  // How the recommendations are filtered
  const filtered = useMemo(() => {
    if (!debouncedName) return [];

    return foodItems
      .filter((item) =>
        item.toLowerCase().includes(debouncedName.toLowerCase()),
      )
      .slice(0, 20);
  }, [debouncedName, foodItems]);

  const exactMatch = foodItems.some(
    (item) => item.toLowerCase() === name.toLowerCase(),
  );

  const suggestions =
    name.length > 0 && !exactMatch ? [`Use "${name}"`, ...filtered] : filtered;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalVisible.isModalVisable}
      onRequestClose={() => modalVisible.setIsModalVisible(false)}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss;
          setShowSuggestions(false);
        }}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="bg-white rounded-md w-4/5 gap-4 p-5">
            <View className="w-full  flex-row items-center  gap-4">
              <Text className="text-gray-800 text-xl font-bold mb-2">Name</Text>

              <View className="relative w-[80%]">
                <TextInput
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    handleNameEditEnd(name);
                  }}
                  placeholder="Enter or Select Name"
                  className="bg-gray-200 rounded-md px-3 py-3 text-gray-700"
                />

                {showSuggestions && suggestions.length > 0 && (
                  <View className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md max-h-48 z-50">
                    <FlatList
                      keyboardShouldPersistTaps="always"
                      data={suggestions}
                      keyExtractor={(item, index) => item + index}
                      renderItem={({ item }) => {
                        const isCustom = item.startsWith("Use ");

                        return (
                          <TouchableOpacity
                            onPress={() => {
                              const value = isCustom ? name : item;

                              setName(value);
                              setShowSuggestions(false);
                              handleNameEditEnd(value);
                            }}
                            className="px-3 py-3 active:bg-gray-100"
                          >
                            <Text
                              className={`${
                                isCustom
                                  ? "text-blue-600 italic"
                                  : "text-gray-700"
                              }`}
                            >
                              {item}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </View>
                )}
              </View>
            </View>

            {/* ESTIMATION */}
            <View className="flex-row gap-4 items-center">
              <TextInput
                value={estimation}
                onChangeText={(text) => {
                  if (/^-?\d*$/.test(text)) setEstimation(text);
                }}
                keyboardType="numeric"
                className="rounded-md p-4 bg-gray-200 text-xl w-1/3 text-gray-500"
              />
              <Text className="text-gray-800 text-xl font-bold">
                Days Until Expiration
              </Text>
            </View>

            {/* LOCATION */}
            <View className="flex-row items-center gap-4">
              <Text className="text-gray-800 text-xl font-bold">Stored In</Text>
              <DialogueButtonGroup
                location={locationStatus}
                setLocation={setLocationStatus}
                locationChange={handleLocationChange}
              />
            </View>

            {/* ACTIONS */}
            <View className="flex-row justify-between">
              <Pressable
                onPress={() => {
                  resetToDefaults();
                  modalVisible.setIsModalVisible(false);
                }}
                className="rounded-full p-4 bg-red-600"
              >
                <Text className="text-white text-lg font-bold">
                  {editMode ? "Discard Changes" : "Cancel Add"}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                className="rounded-full p-4 bg-green-600"
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
