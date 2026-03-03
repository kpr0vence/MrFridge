import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import BackButton from "./components/buttons/BackButton";
import ItemsDisplayHeader from "./components/headers/ItemsDisplayHeader";
import ItemsAccordian from "./components/ItemsAccordian";
import { useData } from "../utils/DataContext";

export default function ItemsDisplay() {
  const { getDataFromLocation } = useData();
  const { data } = useLocalSearchParams();
  const locationCard = data ? JSON.parse(data as string) : {};
  const items = getDataFromLocation(locationCard.name);

  return (
    <View className="flex-1 relative">
      <ItemsDisplayHeader locationName={locationCard.name} items={items} />
      <View className="flex-1 min-h-screen pb-40">
        <ScrollView className="bg-gray-50 p-5 pt-10 flex-col gap-5">
          <ItemsAccordian items={items} />
        </ScrollView>
      </View>
      <BackButton />
    </View>
  );
}
