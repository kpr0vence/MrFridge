import { useLocalSearchParams } from "expo-router";
import { extractTextFromImage, isSupported } from "expo-text-extractor";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useData } from "../DataContext";
import AddHeader from "./AddHeader";

export default function ProcessImage() {
  const [result, setResult] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getDataFromLocation } = useData();
  const { data } = useLocalSearchParams();

  const [imageUri, setImageUri] = useState("");

  const processImage = async (path?: string) => {
    if (!path) return;

    setImageUri(path);
    setIsLoading(true);
    setResult([]);

    if (isSupported) {
      // Can do the OCR
      try {
        const extractedTexts = await extractTextFromImage(path); // Function from the new library
        setResult(extractedTexts);
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

  async function handleProcessImage(path: string) {
    await processImage(path);
  }

  useEffect(() => {
    setImageUri(data ? JSON.parse(data as string) : "");
    processImage;
  }, []);

  return (
    <View>
      <AddHeader />
      <Text>{result}</Text>
    </View>
  );
}
