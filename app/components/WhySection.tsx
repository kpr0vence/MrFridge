import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, Text, View } from "react-native";

export default function WhySection() {
  return (
    <View className="border-4 border-gray-200 rounded-lg m-4 bg-white p-4">
      <ScrollView>
        <View className="flex-row gap-2 items-center">
          <Text className="text-3xl font-semibold mb-2">A Yucky Eureka</Text>
          <Ionicons name="bulb" color="black" size={30} className="pb-2" />
        </View>
        <Text className="mb-4 text-lg">
          The idea for this project came to me while I was cleaning the molding
          strawberries out from the back of my dorm refridgerator. Every time it
          came to choosing a snack, I'd completely forgotten they were there! I
          found myself thinking{" "}
          <Text className="font-semibold">
            "if only I'd remembered they were there..."
          </Text>
        </Text>
        <Text className="text-right text-2xl font-medium text-gray-800">
          Out of Sight Out of Mind.
        </Text>
        <Text className="text-right mb-4 text-lg">
          It{"'"}s so easy to forget about what{"'"}s behind those cabnites,
          what{"'"}s burried deep in the freezer, or sitting at the back of the
          fridge. Mr. Fridge just provides that extra nudge, bringing your
          groceries to the forefront of your mind using the thing you see most:
          your phone!
        </Text>
      </ScrollView>
    </View>
  );
}
