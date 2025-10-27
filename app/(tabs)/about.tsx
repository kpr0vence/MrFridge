import { ScrollView, StyleSheet, View } from "react-native";
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
