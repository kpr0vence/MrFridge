import { useState } from "react";
import { ScrollView, View } from "react-native";
import { GuessType } from "../types";
import AddHeader from "./AddHeader";
import VerifyGuessFormItem from "./VerifyGuessFormItem";

interface props {
  guessedItems: GuessType[];
}
export default function DisplayResults(myProps: props) {
  const [formItems, setFormItems] = useState<GuessType[]>([]);

  const addItem = (item: GuessType) => {
    const updatedItems = [...formItems, item];
    setFormItems(updatedItems);
  };

  return (
    <View>
      <AddHeader />
      <View className="flex-1 min-h-screen pb-40">
        <ScrollView className=" pb-15 flex-col gap-5 bg-white">
          <View id="form-container?">
            {myProps.guessedItems.map((guessedItem) => {
              return (
                <VerifyGuessFormItem item={guessedItem} onConfirm={addItem} />
              );
            })}
          </View>
        </ScrollView>
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
