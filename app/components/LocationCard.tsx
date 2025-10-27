import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import { groceries } from "../dummyData";
import {
  getItemsFromLocationCloseToExpiration,
  getItemsFromLocationExpired,
} from "../itemFunctions";
import ItemsExpiredBubble from "./ItemsExpiredBubble";
import ItemsNearExpiredBubble from "./ItemsNearExpiredBubble";
import ToItemsButton from "./ToItemsButton";

interface locationCardProps {
  location: string;
  iconName: string;
}

function bottomRow(numNearExpired: number, numExpired: number) {
  if (numNearExpired === 0 && numExpired === 0)
    return (
      <Text className="text-l text-gray-500 pb-2 text-pretty">
        Nothing close or expired, nice!
      </Text>
    );
  return (
    <View className="flex-row gap-4">
      <ItemsNearExpiredBubble numItems={numNearExpired} />
      <ItemsExpiredBubble numItems={numExpired} />
    </View>
  );
}

export default function LocationCard({
  location,
  iconName,
}: locationCardProps) {
  let items = groceries.pantry;
  if (location === "Fridge") items = groceries.fridge;
  if (location === "Freezer") items = groceries.freezer;

  const nearExpired = getItemsFromLocationCloseToExpiration(items).length;
  const expired = getItemsFromLocationExpired(items).length;

  return (
    <View className="border-4 border-gray-200 rounded-lg w-full flex-row  p-2 gap-2">
      <Ionicons name={iconName} color={"#9ca3af"} size={105} />
      <View className="flex-col gap-4 w-4/6">
        <View className="flex-row gap-4 items-stretch justify-between align-bot">
          <View className="flex-row gap-4 items-end align-bot ">
            <Text className="text-6xl text-black">{items.length}</Text>
            <Text className="text-xl text-gray-500 pb-2 w-28">
              Items in the {location}
            </Text>
          </View>
          <ToItemsButton />
        </View>
        {bottomRow(nearExpired, expired)}
      </View>
    </View>
  );
}
