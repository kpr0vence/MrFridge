import React, { Dispatch, SetStateAction } from "react";
import { Pressable, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface props {
  location: 1 | 2 | 3;
  setLocation: Dispatch<SetStateAction<1 | 2 | 3>>;
  locationChange: (newLocation: 1 | 2 | 3) => void;
}

export default function DialogueButtonGroup({
  location,
  setLocation,
  locationChange,
}: props) {
  const viewDetails = "rounded-full p-2 items-center justify-center";
  //   const [selectedLocation, setSelectedLocation] = useState<number>(3);
  // Make a state variable to track which one is toggled
  // of three options one will be toggled, the rest wont. On press, update the toggle

  function determineBackgroundColor(newLocation: 1 | 2 | 3) {
    return newLocation === location
      ? viewDetails + " bg-[#41d78f]"
      : viewDetails + " bg-slate-200";
  }

  function determineForegroundColor(newLocation: 1 | 2 | 3) {
    return newLocation === location ? "#fff" : "#9ca3af";
  }

  function handleOnPress(newLocation: 1 | 2 | 3) {
    setLocation(newLocation);
    locationChange(newLocation);
  }

  return (
    <View className="flex-row gap-4">
      <Pressable
        className={`rounded-full p-2 items-center justify-center ${determineBackgroundColor(1)}`}
        onPress={() => handleOnPress(1)}
      >
        <MaterialCommunityIcons
          name={"fridge"}
          color={`${determineForegroundColor(1)}`}
          size={30}
        />
      </Pressable>

      <Pressable
        className={`rounded-full p-2 items-center justify-center ${determineBackgroundColor(2)}`}
        onPress={() => handleOnPress(2)}
      >
        <MaterialCommunityIcons
          name={"door"}
          color={`${determineForegroundColor(2)}`}
          size={30}
        />
      </Pressable>
      <Pressable
        className={`rounded-full p-2 items-center justify-center ${determineBackgroundColor(3)}`}
        onPress={() => handleOnPress(3)}
      >
        <MaterialCommunityIcons
          name={"snowflake"}
          color={`${determineForegroundColor(3)}`}
          size={30}
        />
      </Pressable>
    </View>
  );
}
