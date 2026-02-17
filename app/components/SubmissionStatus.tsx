import { Text, View } from "react-native";
interface props {
  isSuccess: boolean;
}
export default function SubmissionStatus({ isSuccess }: props) {
  if (isSuccess) {
    return (
      <View className="bg-green-400 p-4 rounded-md">
        <Text className="text-white text-xl text-center">
          Item Successfully Added
        </Text>
      </View>
    );
  } else {
    return (
      <View className="bg-red-400 p-4 rounded-md">
        <Text className="text-white text-xl text-center">
          Failed to add item, please try again in a few moments
        </Text>
      </View>
    );
  }
}
