import * as BackgroundTask from "expo-background-task";
import { Button } from "react-native";

export function BackgroundTaskTestingButton() {
  const triggerTask = async () => {
    await BackgroundTask.triggerTaskWorkerForTestingAsync();
  };

  return <Button title="Trigger Background Task" onPress={triggerTask} />;
}
