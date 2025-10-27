import React, { useState } from "react";
import { View } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import { item } from "../types";
import ItemCardContent from "./ItemCardContent";
import ItemCardHeader from "./ItemCardHeader";

interface ItemsAccordianProps {
  items: item[];
}

export default function ItemsAccordian({ items }: ItemsAccordianProps) {
  const [activeSections, setActiveSections] = useState([]);
  const sections = items;

  function renderHeader(section: item, _: any, isActive: boolean) {
    return <ItemCardHeader item={section} isActive={isActive} />;
  }

  function renderContent(section: item, _: any) {
    return (
      <View className="border-4 border-t-0 border-gray-200  rounded-b-lg  w-full mb-4 p-4">
        <ItemCardContent item={section} />
      </View>
    );
  }
  return (
    <Accordion
      align="bottom"
      sections={sections}
      activeSections={activeSections}
      renderHeader={renderHeader}
      renderContent={renderContent}
      underlayColor={"#f9fafb"}
      onChange={(sections) => setActiveSections(sections as any)}
      // sectionContainerStyle={styles.accordContainer}
    />
  );
}
