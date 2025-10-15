import { Text, View } from "react-native";
import { groceries } from "../dummyData";
import { getItemsFromLocationCloseToExpiration, getItemsFromLocationExpired } from "./itemFunctions";

// Currenlty hard coded for fridge
export default function ItemsDisplayHeader() {
    const items = groceries.fridge
    const nearExpired = getItemsFromLocationCloseToExpiration(items).length;
    const expired = getItemsFromLocationExpired(items).length

    return (
        <View className='' >
            <View className='pt-safe-offset-5 p-5 bg-[#41d78f] flex-row justify-between items-end'>
                <View className="flex-col items-center">
                    <View className="bg-[#ffbd59] rounded-full justify-center items-center h-10 w-10">
                        <Text className="text-white text-xl font-bold text-center">{nearExpired}</Text>
                    </View>
                    <Text className="text-xl text-white">Close</Text>
                </View>
                <Text className="text-6xl text-white">Fridge</Text>
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