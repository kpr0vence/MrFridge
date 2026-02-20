import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useData } from "../DataContext";
import { calculateDaysTilExp } from "../utils/item.utils";
import { ItemType } from "../utils/types";
import EditOrManualAdd from "./EditOrManualAdd";

interface ItemCardContentProps {
  item: ItemType;
}

export default function ItemCardContent({ item }: ItemCardContentProps) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { handleDelete, handleUpdate } = useData();

  const onEatenPress = () => {
    handleDelete(item.id);
  };

  const onEditPress = () => {
    setIsModalVisible(() => !isModalVisible);
  };

  const handleSubmit = (updateItem: ItemType) => {
    // TODO: Just don't submit if nothing has changed
    // Begin with the original values
    const result = {
      name: item.name,
      daysUntilExpiration: calculateDaysTilExp(item.expiration_date),
      moveTo: item.location_id,
    };

    // Update the ones that are actually valid inputs
    const trimmedName = updateItem.name.trim();
    if (trimmedName.length > 0) result.name = trimmedName;

    const trimmedDays = updateItem.expiration_date.trim();
    if (trimmedDays.length > 0) {
      const parsedDays = parseInt(trimmedDays, 10);
      console.log("Parsed Days: " + parsedDays);
      if (!isNaN(parsedDays)) result.daysUntilExpiration = parsedDays;
    }

    if (updateItem.location_id !== null) result.moveTo = updateItem.location_id;

    console.log("Form data being submitted:", result);

    // Update it
    handleUpdate(
      item.id,
      result.name,
      result.moveTo,
      result.daysUntilExpiration.toString(),
    );

    setIsModalVisible(false);
  };

  return (
    <View key={item.id} className="flex-row justify-between">
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
      <EditOrManualAdd
        editMode={true}
        originalItem={item}
        onUpdate={handleSubmit}
        modalVisible={{
          isModalVisable: isModalVisible,
          setIsModalVisible: setIsModalVisible,
        }}
      />
    </View>
  );
}
