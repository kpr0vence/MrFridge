import { Stack } from "expo-router";
// import 'react-native-reanimated';
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { Platform } from "react-native";
import "../global.css";

export default function RootLayout() {
  const createDbIfNeeded = async (db: SQLiteDatabase) => {
    await db.execAsync(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT);"
    );
  };

  // Use in-memory DB on web to avoid NoModificationAllowedError
  const dbName = Platform.OS === "web" ? ":memory:" : "test.db";

  return (
    <SQLiteProvider databaseName="test.db" onInit={createDbIfNeeded}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="itemsDisplay"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </SQLiteProvider>
  );
}
