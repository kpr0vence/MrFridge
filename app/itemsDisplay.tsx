import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import ItemsAccordian from "./components/ItemsAccordian";
import ItemsDisplayHeader from "./components/ItemsDisplayHeader";
import { groceries } from "./dummyData";

function getTrueItems(name: string) {
  console.log(name);
  if (name === "Freezer") return groceries.freezer;
  if (name === "Fridge") return groceries.fridge;
  return groceries.pantry;
}

export default function ItemsDisplay() {
  const { data } = useLocalSearchParams();
  const locationCard = data ? JSON.parse(data as string) : {};
  // Not the best solution, but I'm having a difficult time sending the params, because it stringifies them to oblivion
  const items = getTrueItems(locationCard.name);

  return (
    <View>
      <ItemsDisplayHeader locationName={locationCard.name} items={items} />
      <View className="flex-1 min-h-screen pb-40">
        <ScrollView className="bg-gray-50 p-5 pt-10 flex-col gap-5">
          <ItemsAccordian items={items} />
        </ScrollView>
      </View>
    </View>
  );
}
