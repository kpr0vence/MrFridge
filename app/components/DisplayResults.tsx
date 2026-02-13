import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GuessType } from "../utils/types";
import AddHeader from "./headers/AddHeader";
import VerifyGuessFormItem from "./VerifyGuessFormItem";

interface props {
  guessedItems: GuessType[];
}
export default function DisplayResults(myProps: props) {
  const [itemsToSave, setItemsToSave] = useState<GuessType[]>(
    myProps.guessedItems,
  );

  // New logic: all items are in the list that we want to save
  // onDeleteItem logic -> delete it from the list of items to save
  // onConfrim and onHadleClickOff -> update it in the list

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
    console.log("Updated Array = " + updatedInfoArr);
    setItemsToSave(updatedInfoArr);
  }

  const onFinalSubmit = () => {
    // on final submit, all items remaining should be added to the form items
    // Final submit should also make sure no items with bad params are added
    itemsToSave.forEach((item) =>
      item.guessedItem.trim() === ""
        ? console.log("Bad input found, shouldn't proceed")
        : 0,
    );
    console.log(
      "final items: [" +
        itemsToSave.map((item) => `${item.guessedItem}, `) +
        "]",
    );
    // Submission Logic

    // Logic to success or error page
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
            {myProps.guessedItems.map((guessedItem) => {
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

/*
Each item is its own form, but they all share the same submit button?

- Make a copy of the incoming list that is a state variable
- Each form modifies this sate function, using thw wisdom from stack overflow
- OnSubmit, the (modified) values in the state variable are assigned to the static object

- Then do more later

*/
