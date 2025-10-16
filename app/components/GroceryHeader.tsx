import { Text, View } from "react-native";
import { groceries } from "../dummyData";
import { getNumItemsCloseToExpiration, getTotalItems } from "./itemFunctions";

const total_items = getTotalItems(groceries);
const items_near_expiration = getNumItemsCloseToExpiration(groceries);


export default function GroceryHeader() {
  return (
    <View className='' >
      <View className='pt-safe-offset-5 p-5 bg-[#41d78f] justify-between flex-row'>
        <View className='flex-row gap-4 items-end align-bot'>
          <Text className='text-6xl text-white'>{total_items}</Text>
          <Text className='text-xl text-white pb-2 w-24'>Items Stored</Text>
        </View>
        
        <View className='flex-row gap-4 items-end'>
          <Text className='text-xl text-white pb-2 w-24 text-right'>Close to Expiration</Text>
          <Text className='text-6xl text-white'>{items_near_expiration}</Text>
        </View>
      </View>
    </View>
  )
}