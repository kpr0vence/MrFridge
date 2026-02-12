import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import DisplayResults from "./components/DisplayResults";
import ProcessImage from "./components/ProcessImage";
import { GuessType } from "./types";

// Handles the logic between showing ProcessImage.tsx and ConfrimItemsModal.tsx
export default function ProcessDisplay() {
  const { data } = useLocalSearchParams();
  const [imageUri, setImageUri] = useState("");
  const [ocrDone, setOcrDone] = useState<boolean>(false);
  const [guessedItems, setGuessedItems] = useState<GuessType[]>([]);

  useEffect(() => {
    setImageUri(data ? JSON.parse(data as string) : "");
  }, []);

  function handleOrcDone() {
    setOcrDone(true);
  }

  function renderTsx(): React.JSX.Element {
    if (ocrDone) {
      return (
        <View>
          <DisplayResults guessedItems={guessedItems} />
        </View>
      );
    } else {
      return (
        <View>
          <ProcessImage
            imageUri={imageUri}
            setOcrDone={handleOrcDone}
            setGuessedItems={setGuessedItems}
          />
        </View>
      );
    }
  }

  return <View>{renderTsx()}</View>;
}
