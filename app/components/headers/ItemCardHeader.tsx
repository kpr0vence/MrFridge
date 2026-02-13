import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import { useData } from "../../DataContext";
import { ItemType } from "../../utils/types";

interface ItemCardHeaderProps {
  item: ItemType;
  isActive: boolean;
}

function daysBubbleColor(
  item: ItemType,
  isExpired: (item: ItemType) => boolean,
  isCloseToExpired: (item: ItemType) => boolean,
) {
  if (isExpired(item))
    return "bg-[#ff5757] rounded-full justify-center items-center h-12 w-12";
  if (isCloseToExpired(item))
    return "bg-[#ffbd59] rounded-full justify-center items-center h-12 w-12";
  return "bg-[#41d78f] rounded-full justify-center items-center h-12 w-12";
}

export default function ItemCardHeader({
  item,
  isActive,
}: ItemCardHeaderProps) {
  const { calculateDaysTilExp, isExpired, isCloseToExpired } = useData();

  const daysLeft = calculateDaysTilExp(item.expiration_date);
  const classNameClosed: string =
    "border-4 border-gray-200 rounded-lg w-full flex-row justify-between items-center p-2 gap-2 mb-4";
  const classNameOpen: string =
    "border-4 border-b-2 border-gray-200 rounded-t-lg w-full flex-row justify-between items-center p-2 gap-2";

  return (
    <View className={isActive ? classNameOpen : classNameClosed}>
      <Text className="text-black text-xl font-bold">{item.name}</Text>
      <View className="flex-row gap-10">
        <View className="flex-row items-center gap-2">
          <View className={daysBubbleColor(item, isExpired, isCloseToExpired)}>
            <Text className="text-white text-xl font-bold">{daysLeft}</Text>
          </View>
          <Text>{Math.abs(daysLeft) === 1 ? "Day" : "Days"}</Text>
        </View>
        <Ionicons
          name={isActive ? "chevron-up-outline" : "chevron-down-outline"}
          color={"#9ca3af"}
          size={30}
        />
      </View>
    </View>
  );
}
