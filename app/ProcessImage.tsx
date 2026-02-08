import { useLocalSearchParams } from "expo-router";
// import { extractTextFromImage, isSupported } from "expo-text-extractor";
import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useData } from "./DataContext";
import AddHeader from "./components/AddHeader";

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

    // if (isSupported) {   // Commenting out code that is causing the import issue
    if (path) {
      // Can do the OCR
      try {
        // const extractedTexts = await extractTextFromImage(path); // Function from the new library
        const extractedTexts = [
          "A   R.w.CR.MUSHRM   1.98 B",
          "B  LLALUMINUMFOIL   1.98 T",
          "SC 8900 A  ADV SAVINGS     1.00",
          "PRODUCE",
        ];
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
    handleProcessImage(data as string);
  }, []);

  return (
    <View>
      <AddHeader />
      {/* <Text>{imageUri}</Text> */}
      <Text>{result}</Text>
    </View>
  );
}
