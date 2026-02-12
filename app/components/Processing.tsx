import { ActivityIndicator, View } from "react-native";
import Disclaimer from "./Disclaimer";

export default function Processing() {
  return (
    <View>
      <Disclaimer />
      <ActivityIndicator />
    </View>
  );
}
