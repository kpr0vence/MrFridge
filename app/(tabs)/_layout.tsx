import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import GroceryHeader from "../components/GroceryHeader";
import NotifsHeader from "../components/NotifsHeader";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#41d78f",
        headerStyle: {
          backgroundColor: "#41d78f",
        },
        headerShadowVisible: false,
        headerTintColor: "#ffff",
        tabBarStyle: {
          backgroundColor: "#ffff",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Groceries",
          header: () => <GroceryHeader />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "nutrition" : "nutrition-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "Notifications",
          header: () => <NotifsHeader />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
