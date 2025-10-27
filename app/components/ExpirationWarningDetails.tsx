import { Dispatch, SetStateAction } from "react";
import { Text, View } from "react-native";

interface ExpirationWarningModalProps {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
}

export default function EpirationWarningDetails({
  isModalVisible,
  setIsModalVisible,
}: ExpirationWarningModalProps) {
  if (!isModalVisible) return <View></View>;

  return (
    <View>
      <Text>Its here!</Text>
    </View>
  );
}
