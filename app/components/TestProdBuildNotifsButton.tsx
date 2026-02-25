import * as BackgroundTask from "expo-background-task";
import { Button, View } from "react-native";


export default function TestProdBuildNotifsButton() {
    const runBackgroundTaskTest = async () => {
        try {
          const status = await BackgroundTask.getStatusAsync();
          if (status !== BackgroundTask.BackgroundTaskStatus.Available) {
            console.log(
              "Background tasks are restricted/unavailable in this environment (e.g., Expo Go or simulator). Skipping test run.",
            );
            return;
          }
    
          await BackgroundTask.triggerTaskWorkerForTestingAsync();
          console.log("Background task worker triggered for testing.");
        } catch (err) {
          console.error("Error triggering background task worker for testing:", err);
        }
      };

    return (
        <View className="p-10">
            {__DEV__ && (
        <View className="mt-4">
          <Button
            title="Run Background Task (Dev)"
            onPress={runBackgroundTaskTest}
          />
        </View>
      )}
        </View>
    )
}