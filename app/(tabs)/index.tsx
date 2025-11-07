import { router, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import LocationCard from "../components/LocationCard";
import { groceries } from "../dummyData";
import { item } from "../types";

// Define a type
export type LocationCard = {
  name: string;
  iconName: string;
  info: item[];
};

type UserType = {
  id: number;
  name: string;
  email: string;
};

export default function Index() {
  const [data, setData] = useState<UserType[]>([]);
  const database = useSQLiteContext();

  const loadData = async () => {
    const result = await database.getAllAsync<UserType>("SELECT * FROM users;");
    setData(result);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const [locations, setLocations] = useState<LocationCard[]>();
  // Below are for later use
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    const groceryContainers = groceries;
    setLocations([
      {
        name: "Fridge",
        iconName: "tablet-portrait-outline",
        info: groceryContainers.freezer,
      },
      {
        name: "Pantry",
        iconName: "beaker-outline",
        info: groceryContainers.pantry,
      },
      {
        name: "Freezer",
        iconName: "fish-outline",
        info: groceryContainers.freezer,
      },
    ]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await database.runAsync("DELETE FROM users WHERE id = ?;", [id]);
      loadData(); // to redraw the guys
    } catch (error) {
      console.log(error);
    }
  };

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
      <View className="border-4 border-black">
        <FlatList
          data={data}
          renderItem={({ item }) => {
            return (
              <View className="flex-row justify-between pb-5">
                <Text>{item.name}</Text>
                <Text>{item.email}</Text>
                <Pressable
                  onPress={() => {
                    router.push(`/add?id=${item.id}`);
                  }}
                >
                  <Text className="bg-blue-500">Edit</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    handleDelete(item.id);
                  }}
                >
                  <Text className="bg-red-500">DELETE FOREVER</Text>
                </Pressable>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
