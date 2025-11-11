import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useData } from "../DataContext";
import { ItemType } from "../types";
import EditItemModal from "./EditItemModal";

interface ItemCardContentProps {
  item: ItemType;
}

export default function ItemCardContent({ item }: ItemCardContentProps) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { handleDelete } = useData();

  const onEatenPress = () => {
    handleDelete(item.id);
  };

  const onEditPress = () => {
    setIsModalVisible(() => !isModalVisible);
  };

  return (
    <View className="flex-row justify-between">
      <Pressable
        className="p-4 rounded-md bg-[#00bf63] flex-row gap-2 items-center w-fit"
        onPress={onEatenPress}
      >
        <Ionicons name="checkmark-circle-outline" color={"#fff"} size={28} />
        <Text className="text-white text-lg">Eaten!</Text>
      </Pressable>
      <Pressable
        className="p-4 rounded-md flex-row gap-2 items-center w-fit"
        onPress={onEditPress}
      >
        <Ionicons name="pencil-outline" color={"#000"} size={28} />
      </Pressable>
      <EditItemModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        item={item}
      />
    </View>
  );
}
