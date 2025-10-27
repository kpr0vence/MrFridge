import { Text, View } from "react-native";

interface itemExpiredBubbleProps {
  numItems: number;
}

export default function itemsExpiredBubble({
  numItems,
}: itemExpiredBubbleProps) {
  if (numItems < 1) return <></>;
  return (
    <View className="flex-row gap-1">
      <View className="bg-[#ff5757] rounded-full justify-center items-center h-10 w-10">
        <Text className="text-white text-xl font-bold">{numItems}</Text>
      </View>
      <View className="flex-1 justify-center">
        <Text className="text-l text-gray-500 pb-2 w-24">Expired</Text>
      </View>
    </View>
  );
}
