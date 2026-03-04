import { ScrollView, Text, View } from "react-native";

export default function HowSection() {
  return (
    <View className="border-4 border-gray-200 rounded-lg m-4 bg-white p-4">
      <ScrollView className="h-2/3">
        <Text className="text-3xl font-semibold mb-2 text-center">
          How to Best Use Mr. Fridge
        </Text>
        <Text className="border-solid border-b-2 border-gray-200 text-2xl font-medium text-gray-800">
          Entering Items
        </Text>
        <Text className="mb-4 text-lg">
          <Text className="font-lg">{"\u2022"} </Text>
          Take a clear photo of your receipt{" "}
          <Text className="italic underline">at the grocery store.</Text> This
          way you don't have to worry about the receipt getting wrinkled or
          lost!
        </Text>
        <Text className="mb-4 text-lg">
          <Text className="font-lg">{"\u2022"} </Text>
          Start the 'Photo Add' proccess while putting your groceries away. The
          ocular character recognition (OCR) can take a few minutes, so why not
          multitask?
        </Text>
        <Text className="border-solid border-b-2 border-gray-200 text-2xl font-medium text-gray-800">
          Understanding the Food Storage
        </Text>
        <Text className="mb-4 text-lg">
          <Text className="font-lg">{"\u2022"} </Text>
          The app is supposed to warn you about items{" "}
          <Text className="italic underline">before they spoil.</Text> So the
          estimated dates don't need to by hyper-accurate, just close enough to
          give you a pertinent reminder!
        </Text>
        <Text className="mb-4 text-lg">
          <Text className="font-lg">{"\u2022"} </Text>
          When editing an item's name or location, Mr. Fridge automatically
          tries to update the expiration estimation for your convenience. But
          don't worry, you can still change the estimation manually.
        </Text>
        <Text className="mb-4 text-lg">
          <Text className="font-lg">{"\u2022"} </Text>
          Don't forget to mark items as "Eaten" to stop getting notifications on
          them and remove them from your stored items!
        </Text>
      </ScrollView>
    </View>
  );
}
