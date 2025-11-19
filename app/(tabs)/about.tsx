import { ScrollView, View } from "react-native";
import ExpirationWarningNotifs from "../components/ExpirationWarningNotifs";

export default function AboutScreen() {
  return (
    <View className="bg-white min-h-full">
      <ScrollView>
        <ExpirationWarningNotifs />
      </ScrollView>
    </View>
  );
}
