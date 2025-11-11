import { Text, View } from "react-native";
import { useData } from "../DataContext";
import { ItemType } from "../types";

interface itemsDisplayHeaderProps {
  locationName: string;
  items: ItemType[];
}

export default function ItemsDisplayHeader({
  locationName,
  items,
}: itemsDisplayHeaderProps) {
  const { getItemsCloseToExpired, getItemsExpired } = useData();
  const nearExpired = getItemsCloseToExpired(items).length;
  const expired = getItemsExpired(items).length;

  return (
    <View className="">
      <View className="pt-safe-offset-5 p-5 bg-[#41d78f] flex-row justify-between items-end">
        <View className="flex-col items-center">
          <View className="bg-[#ffbd59] rounded-full justify-center items-center h-10 w-10">
            <Text className="text-white text-xl font-bold text-center">
              {nearExpired}
            </Text>
          </View>
          <Text className="text-xl text-white">Close</Text>
        </View>
        <Text className="text-6xl text-white">{locationName}</Text>
        <View className="flex-col items-center">
          <View className="bg-[#ff5757] rounded-full justify-center items-center h-10 w-10">
            <Text className="text-white text-xl font-bold">{expired}</Text>
          </View>
          <Text className="text-xl text-white">Expired</Text>
        </View>
      </View>
    </View>
  );
}
