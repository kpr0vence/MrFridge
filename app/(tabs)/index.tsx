import { router } from "expo-router";
import { Pressable, View } from "react-native";
import LocationCard from "../components/LocationCard";

// "Main View" with the fridge freezer and pantry sections
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
  ] as const;

  return (
    <View className="bg-gray-50 h-screen p-5 pt-10 flex-col gap-5">
      {locations?.map((locationCard, index) => (
        <Pressable
          key={index}
          onPress={() => {
            // Navigate to that container's item display
            router.push({
              pathname: "/itemsDisplay",
              params: {
                data: JSON.stringify(locationCard),
              }, // Sending just the icon name and location name (which
            }); // determines the behavior of the Location Card)
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
