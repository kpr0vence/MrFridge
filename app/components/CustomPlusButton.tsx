import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View } from "react-native";

type CustomPlusButtonProps = {
  onPress: () => {};
};

export default function CustomPlusButton({ onPress }: CustomPlusButtonProps) {
  return (
    <Pressable className="-300" onPress={onPress}>
      <View>
        <View className="flex-1 items-center justify-center">
          <View className="bg-[#41d78f] rounded-full justify-center items-center h-24 w-24">
            <Ionicons name="add" color="white" size={40} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
