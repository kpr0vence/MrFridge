import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import AddHeader from "./components/headers/AddHeader";

export default function SuccessfulSubmitMessage() {
  useEffect(() => {
    const timerId = setTimeout(() => {
      router.push({
        pathname: "/",
      });
    }, 3000);

    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <View className="flex-1 ">
      <AddHeader />
      <View className="flex justify-center items-center w-full p-4">
        <View className=" bg-green-600 p-4 rounded-md">
          <Text className="text-xl text-white">
            Your items were successfully submitted!
          </Text>
        </View>
      </View>
    </View>
  );
}
