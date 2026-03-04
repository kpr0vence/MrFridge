import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function WhoSection() {
  const websiteURL = "https://github.com/kpr0vence/MrFridge";
  async function openGithubRepo() {
    const supported = await Linking.canOpenURL(websiteURL);

    if (supported) {
      await Linking.openURL(websiteURL);
    } else {
      console.error("Don't know how to open URI: " + websiteURL);
      Alert.alert(`Don't know how to open this URL: ${websiteURL}`);
    }
  }

  return (
    <View className="border-4 border-gray-200 rounded-lg m-4 bg-white p-4">
      <ScrollView>
        <Text className="text-3xl font-semibold mb-2">
          Who Made Mr. Fridge?
        </Text>
        <Text className="mb-4 text-lg">
          Hi! My name is Kati, and you're currently using my senior year
          (2025-2026) Computer Science Capstone project!
        </Text>
        <Text className="text-2xl font-medium text-gray-800">
          Check Out the Code!
        </Text>
        <Text className="mb-4 text-lg">
          If you want to see a... general timeline of my work, or the codebase,
          check out my GitHub profile.
        </Text>
        <Pressable
          className="p-2 bg-green-600 rounded-md flex-row items-center gap-2 justify-center"
          onPress={openGithubRepo}
        >
          <Ionicons name="logo-github" color="white" size={20} />
          <Text className="text-center text-white font-medium">
            {websiteURL}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
