import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AddHeader from "./components/headers/AddHeader";
import VerifyGuessFormItem from "./components/VerifyGuessFormItem";
import { useData } from "./DataContext";
import { useGuessData } from "./GuessContext";
import { GuessType, ItemToAdd } from "./utils/types";

export default function DisplayResults() {
  const { guessedItems } = useGuessData();
  const { handleSubmit } = useData();

  const [itemsToSave, setItemsToSave] = useState<GuessType[]>(guessedItems);

  useEffect(() => {
    setItemsToSave(guessedItems);
  }, [guessedItems]);

  function removeItem(idToRemove: number) {
    // Do stuff
    const trimmedArr = itemsToSave.filter((item) => item.id != idToRemove);
    console.log("Item was removed, array is: " + trimmedArr);
    setItemsToSave(trimmedArr);
  }

  function updateItem(idToUpdate: number, newItem: GuessType) {
    // Do stuff
    const updatedInfoArr = itemsToSave.map((item) => {
      return item.id == idToUpdate ? newItem : item;
    });
    console.log("Update Item: ");
    updatedInfoArr.forEach((item) =>
      console.log(
        `{ ${item.guessedItem}, ${item.daysTilExp}, ${item.location}}`,
      ),
    );

    setItemsToSave(updatedInfoArr);
  }

  function makeItem(item: GuessType): ItemToAdd {
    return {
      name: item.guessedItem,
      locationId: item.location,
      daysTilExp: item.daysTilExp,
    };
  }

  const onFinalSubmit = async () => {
    // on finsal submit, all items remaining should be added to the form items
    // Final submit should also make sure no items with bad params are added

    const itemsToSubmit: ItemToAdd[] = itemsToSave
      .filter((item) => item.guessedItem.trim() !== "")
      .map((item) => makeItem(item));

    await handleSubmit(
      itemsToSubmit,
      () => {
        // onSuccess
        console.log("Items saved successfully");
        router.push({
          pathname: "/SuccessfulSubmitMessage",
        });
      },
      (error) => {
        // onFailure
        console.error("Failed to save items:", error);
        router.push({
          pathname: "/FailureSubmitMessage",
        });
      },
    );
  };

  function cancelAddItems() {
    router.back();
  }

  return (
    <View className="">
      <AddHeader />
      <View className="flex-1 min-h-screen pb-48">
        <KeyboardAwareScrollView
          enableResetScrollToCoords={false}
          keyboardDismissMode="on-drag"
          keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
          contentContainerStyle={{ flexGrow: 1 }} // Ensures content can grow
          className=" flex-col gap-5 bg-white m-5 rounded-md"
        >
          <View id="form-container">
            {itemsToSave.map((guessedItem) => {
              return (
                <VerifyGuessFormItem
                  key={guessedItem.id}
                  item={guessedItem}
                  updateItem={updateItem}
                  removeItem={removeItem}
                />
              );
            })}
          </View>
        </KeyboardAwareScrollView>
        <View id="finalSubmitButton" className=" flex-row gap-4 justify-center">
          <Pressable
            onPress={cancelAddItems}
            className="p-4 w-1/3 rounded-md items-center justify-center bg-slate-400"
          >
            <Text className="text-xl text-center text-white">
              Choose New Photo
            </Text>
          </Pressable>
          <Pressable
            onPress={onFinalSubmit}
            className="p-4 rounded-md items-center justify-center bg-[#41d78f]"
          >
            <Text className="text-xl font-bold text-center text-white text-wrap w-min">
              Confirm all Remaining {"\n"}Items
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
