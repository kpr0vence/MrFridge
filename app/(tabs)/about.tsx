import React, { useState } from "react";
import { View } from "react-native";
import SectionDialogueButtonGroup from "../components/buttons/SectionDialogueButtonGroup";
import HowSection from "../components/HowSection";
import WhoSection from "../components/WhoSection";
import WhySection from "../components/WhySection";

export default function AboutScreen() {
  const [activeSection, setActiveSection] = useState<1 | 2 | 3>(1);

  return (
    <View className="bg-white min-h-full">
      <SectionDialogueButtonGroup
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      {/* <ScrollView></ScrollView> */}
      {activeSection === 1 ? <WhoSection /> : <></>}
      {activeSection === 2 ? <HowSection /> : <></>}
      {activeSection === 3 ? <WhySection /> : <></>}
    </View>
  );
}
