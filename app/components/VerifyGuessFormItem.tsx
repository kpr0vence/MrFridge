import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useFoodData } from "../../utils/FoodContext";
import { Estimation, GuessType } from "../../utils/types";
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
  const { estimateItemAtLocation, items } = useFoodData();

  const foodItems = useMemo(() => items.map((i) => i.name), [items]);

  const [isVisible, setIsVisible] = useState(true);

  const [name, setName] = useState(item.guessedItem);
  const [estimation, setEstimation] = useState<number>(
    parseInt(item.daysTilExp) || 0,
  );
  const [locationStatus, setLocationStatus] = useState<1 | 2 | 3>(
    item.location,
  );

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedName, setDebouncedName] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedName(name), 120);
    return () => clearTimeout(t);
  }, [name]);

  const filtered = useMemo(() => {
    if (!debouncedName) return [];

    return foodItems
      .filter((f) => f.toLowerCase().includes(debouncedName.toLowerCase()))
      .slice(0, 20);
  }, [debouncedName, foodItems]);

  const exactMatch = foodItems.some(
    (f) => f.toLowerCase() === name.toLowerCase(),
  );

  const suggestions =
    name.length > 0 && !exactMatch ? [`Use "${name}"`, ...filtered] : filtered;

  function handleNameChange(text: string) {
    setName(text);
    setShowSuggestions(true);

    updateItem(item.id, {
      ...item,
      guessedItem: text,
      location: locationStatus,
      daysTilExp: estimation.toString(),
    });
  }

  async function handleNameEditEnd(value: string) {
    if (!value) return;

    const est: Estimation = await estimateItemAtLocation(
      value.toLowerCase(),
      locationStatus,
    );

    if (est.matchFound) {
      setEstimation(est.estimation);
    }
  }

  function handleEstimationChange(text: string) {
    const num = +text;
    if (isNaN(num)) return;

    setEstimation(num);

    updateItem(item.id, {
      ...item,
      guessedItem: name,
      location: locationStatus,
      daysTilExp: num.toString(),
    });
  }

  async function handleLocationChange(newLocation: 1 | 2 | 3) {
    setLocationStatus(newLocation);

    const est: Estimation = await estimateItemAtLocation(
      name.toLowerCase(),
      newLocation,
    );

    if (est.matchFound) {
      setEstimation(est.estimation);
    }

    updateItem(item.id, {
      ...item,
      guessedItem: name,
      location: newLocation,
      daysTilExp: est.matchFound
        ? est.estimation.toString()
        : estimation.toString(),
    });
  }

  function handleDelete() {
    removeItem(item.id);
    setIsVisible(false);
  }

  function handleConfirm() {
    if (!name.trim()) {
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

  if (!isVisible) return null;

  return (
    <View className="border-b border-gray-300">
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss;
          setShowSuggestions(false);
        }}
      >
        <View>
          <View className="flex-row gap-3 items-center mb-4 justify-between p-5 pb-0">
            <View className="flex-col gap-4 flex-1 min-w-0">
              {/* name (with suggestions) */}
              <View className="bg-gray-200 rounded-md p-4 relative">
                <TextInput
                  value={name}
                  onChangeText={handleNameChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => handleNameEditEnd(name)}
                  className="text-lg font-bold text-center"
                />

                {showSuggestions && suggestions.length > 0 && (
                  <View className="absolute top-16  left-0 right-0 bg-white border border-gray-200 rounded-md max-h-48 z-50">
                    <FlatList
                      data={suggestions}
                      keyboardShouldPersistTaps="handled"
                      scrollEnabled={false}
                      keyExtractor={(s, idx) => s + idx}
                      renderItem={({ item: suggestion }) => {
                        const isCustom = suggestion.startsWith("Use ");

                        return (
                          <TouchableOpacity
                            onPress={() => {
                              const value = isCustom ? name : suggestion;

                              setName(value);
                              setShowSuggestions(false);
                              handleNameEditEnd(value);

                              updateItem(item.id, {
                                ...item,
                                guessedItem: value,
                                location: locationStatus,
                                daysTilExp: estimation.toString(),
                              });
                            }}
                            className="px-3 py-3 active:bg-gray-100"
                          >
                            <Text
                              className={
                                isCustom
                                  ? "text-blue-600 italic"
                                  : "text-gray-700"
                              }
                            >
                              {suggestion}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  </View>
                )}
              </View>

              <DialogueButtonGroup
                location={locationStatus}
                setLocation={setLocationStatus}
                locationChange={handleLocationChange}
              />
            </View>

            {/* ESTIMATION */}
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

          {/* ACTIONS */}
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

          {item.originalLine ? (
            <Text className="p-4 text-sm">
              Original Line Read From Receipt: {item.originalLine}
            </Text>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
