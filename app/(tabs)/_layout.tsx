import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { GroceryHeader } from '../components/GroceryHeader';
import ItemsDisplayHeader from '../components/ItemsDisplayHeader';


export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#41d78f',
            headerStyle: {
            backgroundColor: '#41d78f',
            },
            headerShadowVisible: false,
            headerTintColor: '#ffff',
            tabBarStyle: {
            backgroundColor: '#ffff',
            },
        }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Groceries',
          header: () => <GroceryHeader />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'nutrition' : 'nutrition-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="itemsDisplay"
        options={{
          title: 'Items',
          header: () => <ItemsDisplayHeader />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'fish' : 'fish-outline'} color={color} size={24}/>
          ),
        }}  // I don't want this on the tab bar but idk how to remove
      />
    </Tabs>
  );
}
