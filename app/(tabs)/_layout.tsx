import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import AddHeader from "../components/AddHeader";
import CustomPlusButton from "../components/CustomPlusButton";
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
        name="add"
        options={({ navigation }) => ({
          title: "Add Groceries",
          header: () => <AddHeader />,
          tabBarLabel: "", // Hide the label for the plus button
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" color={color} size={40} /> // Customize icon and color
          ),
          tabBarButton: (props) => (
            <CustomPlusButton
              {...props}
              onPress={() => navigation.navigate("add")}
            />
          ),
        })}
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
      {/* <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          header: () => <AddHeader />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "camera" : "camera-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      /> */}
    </Tabs>
  );
}
