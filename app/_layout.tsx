import { Stack } from "expo-router";
// import 'react-native-reanimated';
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import "../global.css";
import { DataProvider } from "./DataContext";

export default function RootLayout() {
  // Create a database to store the groceries. The location id is limited
  // to 1 (fridge) 2 (pantry) or 3 (freezer)
  const createDbIfNeeded = async (db: SQLiteDatabase) => {
    await db.execAsync(
      " CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, expiration_date TEXT, location_id INTEGER CHECK (location_id IN (1, 2, 3)));",
    );
  };

  return (
    <SQLiteProvider databaseName="test.db" onInit={createDbIfNeeded}>
      <DataProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="itemsDisplay"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ManualAdd"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PhotoAdd"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </DataProvider>
    </SQLiteProvider>
  );
}
