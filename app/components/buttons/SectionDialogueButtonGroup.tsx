import { Dispatch, SetStateAction } from "react";
import { Pressable, Text, View } from "react-native";

interface sectionContols {
  activeSection: 1 | 2 | 3;
  setActiveSection: Dispatch<SetStateAction<1 | 2 | 3>>;
}

export default function SectionDialogueButtonGroup({
  activeSection,
  setActiveSection,
}: sectionContols) {
  function determineBackgroundColor(buttonDesignation: 1 | 2 | 3) {
    return buttonDesignation === activeSection
      ? " bg-[#41d78f] border-[#41d78f] text-white"
      : " bg-white  border-black";
  }

  function determineTextColor(buttonDesignation: 1 | 2 | 3) {
    return buttonDesignation === activeSection ? " text-white" : "";
  }

  return (
    <View className="flex-row align-middle p-4 justify-around">
      <Pressable
        className={`border-solid border-2 rounded-md py-2 px-6 ${determineBackgroundColor(1)}`}
        onPress={() => setActiveSection(1)}
      >
        <Text className={`text-lg ${determineTextColor(1)}`}>Who?</Text>
      </Pressable>
      <Pressable
        className={`border-solid border-2 rounded-md py-2 px-6 ${determineBackgroundColor(2)}`}
        onPress={() => setActiveSection(2)}
      >
        <Text className={`text-lg ${determineTextColor(2)}`}>How?</Text>
      </Pressable>
      <Pressable
        className={`border-solid border-2 rounded-md py-2 px-6 ${determineBackgroundColor(3)}`}
        onPress={() => setActiveSection(3)}
      >
        <Text className={`text-lg ${determineTextColor(3)}`}>Why?</Text>
      </Pressable>
    </View>
  );
}
