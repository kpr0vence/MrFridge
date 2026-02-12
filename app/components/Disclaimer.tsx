import { Image, Text, View } from "react-native";

// This "popup" could be changed into the "processing..." page while things are calculated
// between getting the estimated product and finding the associated term spoilage time
export default function Disclaimer() {
  return (
    <View className="bg-gray-50 p-4 flex-col gap-2 rounded-md m-4 ">
      <View className="flex-row  pb-4 items-center">
        <Image
          source={require("../../assets/images/mrFridge.png")}
          className="h-48 w-48 "
          resizeMode="contain"
        />
        <View className="w-1/2 flex-col gap-2 ">
          <Text className="text-xl">
            Mr. Fridge has done his best to read your reciept and suggest how
            long each item he found will last.{" "}
            <Text className="color-[#41d78f]">But nobody is perfect.</Text>
          </Text>
        </View>
      </View>
      <Text className="text-xl bg-[#41d78f] text-white p-2 rounded-md text-center">
        Please edit any product names, locations, or estimated spoilage dates as
        needed.
      </Text>
      <Text className="text-lg">
        Mr. Fridge might have missed an item! Use the plus button at the bottom
        to add an item to the list.
      </Text>
    </View>
  );
}
