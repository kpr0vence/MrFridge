// import { extractTextFromImage, isSupported } from "expo-text-extractor";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import process_text from "../utils/parser";
import { GuessType } from "../utils/types";
import AddHeader from "./headers/AddHeader";

// Given an image file path, does text recognition
interface props {
  imageUri: string;
  setOcrDone: () => void;
  setGuessedItems: (arg0: GuessType[]) => void;
}

const dummyData = [
  "A   R.w.CR.MUSHRM   1.98 B",
  "B  LLALUMINUMFOIL   1.98 T",
  "SC 8900 A  ADV SAVINGS     1.00",
  "PRODUCE",
  "A  LL. JUMBO EGGS 2.98 B",
  "A  BORDENLACTOSEPC  2.48 B",
  "A  PEPPERS  1.00 B",
];

export default function ProcessImage(myProps: props) {
  const [result, setResult] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const processImage = async (path?: string) => {
    if (!path) return;

    setIsLoading(true);
    setResult([]);

    // if (isSupported) {   // Commenting out code that is causing the import issue
    if (path) {
      // Can do the OCR
      try {
        // const extractedTexts = await extractTextFromImage(path); // Function from the new library
        const extractedTexts = dummyData;
        setResult(extractedTexts);
        setTimeout(() => {
          // just until the text-recognizer library works
          myProps.setGuessedItems(generateFoodItemList(extractedTexts));
          myProps.setOcrDone();
        }, 500);
      } catch (error) {
        if (error instanceof Error)
          Alert.alert("Text Extraction Error", error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      Alert.alert(
        "Not Supported",
        "Text extraction is not supported on this device",
      );
    }
  };

  async function handleProcessImage(uri: string) {
    await processImage(uri);
  }

  useEffect(() => {
    if (!myProps.imageUri) return;
    handleProcessImage(myProps.imageUri);
  }, [myProps.imageUri]);

  return (
    <View>
      <AddHeader />
      {/* <Text>{imageUri}</Text> */}
      <Text>ProcessImage.tsx</Text>
      <Text>{result}</Text>
    </View>
  );
}

// Use the parser method to estimate the food items and send those back up
// through the parent
function generateFoodItemList(extractedTexts: string[]): GuessType[] {
  const items: GuessType[] = [];
  for (let i = 0; i < extractedTexts.length; i++) {
    const { match, confidence, isFood } = process_text(extractedTexts[i]);
    if (isFood) {
      items.push({
        id: i,
        guessedItem: match,
        location: 1,
        daysTilExp: "0",
      });
    }
  }
  return items;
}
