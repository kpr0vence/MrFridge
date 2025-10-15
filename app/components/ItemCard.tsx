import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import { item } from "../types";
import { differenceInDays, isCloseToExpired, isExpired } from "./itemFunctions";


interface ItemCardProps {
    item: item
}

function daysBubbleColor(item: item) {
    if (isExpired(item))
        return "bg-[#ff5757] rounded-full justify-center items-center h-12 w-12"
    if (isCloseToExpired(item))
        return "bg-[#ffbd59] rounded-full justify-center items-center h-12 w-12"
    return "bg-[#41d78f] rounded-full justify-center items-center h-12 w-12"
}

export default function ItemCard({ item }: ItemCardProps) {
    const daysLeft = differenceInDays(new Date(), item.expireDate)
    return (
        <View className="border-4 border-gray-200 rounded-lg w-full flex-row justify-between items-center p-2 gap-2" >
            <Text className="text-black text-xl font-bold">{item.name}</Text>
            <View className="flex-row gap-10 bg-purple-600">
                <View className="flex-row items-center bg-pink-500 gap-2">
                    <View className={daysBubbleColor(item)}>
                        <Text className="text-white text-xl font-bold">{daysLeft}</Text>
                    </View>
                    <Text>{Math.abs(daysLeft) === 1? "Day": "Days"}</Text>
                </View>
                <Ionicons name={"chevron-down-outline"} color={"#9ca3af"} size={30} /> 
            </View>
            

        </View>
    );
}