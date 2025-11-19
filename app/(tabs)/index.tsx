import { router } from "expo-router";
import { Pressable, View } from "react-native";
import LocationCard from "../components/LocationCard";

// Define a type
// export type LocationCard = {
//   name: string;
//   iconName: string;
// };

export default function Index() {
  const locations = [
    {
      name: "Fridge",
      iconName: "fridge",
    },
    {
      name: "Pantry",
      iconName: "door",
    },
    {
      name: "Freezer",
      iconName: "snowflake",
    },
  ];

  return (
    <View className="bg-gray-50 h-screen p-5 pt-10 flex-col gap-5">
      {locations?.map((locationCard, index) => (
        <Pressable
          key={index}
          onPress={() => {
            // Navigate to that containers item display
            router.push({
              pathname: "/itemsDisplay",
              params: {
                data: JSON.stringify(locationCard),
              },
            });
          }}
        >
          <LocationCard
            location={locationCard.name}
            iconName={locationCard.iconName}
          />
        </Pressable>
      ))}
    </View>
  );
}
