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
        <View className=" bg-red-600 p-4">
          <Text className="text-xl">
            Something went wrong. Please try again in a few minutes.
          </Text>
        </View>
      </View>
    </View>
  );
}
