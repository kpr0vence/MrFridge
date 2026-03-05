import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useGuessData } from "../utils/GuessContext";
import BackButton from "./components/buttons/BackButton";
import AddHeader from "./components/headers/AddHeader";
import ImagePickerModal from "./components/ImagePickerModal";
import Processing from "./components/Processing";

// -------------------------------------
// Helper Functions
// -------------------------------------
const PlaceholderImage = require("../assets/images/mrFridgeLogo.png");

// Use the Railway URL from .env
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!; // `!` assumes it's defined

async function fetchApi(path: string, init: RequestInit): Promise<Response> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return await fetch(`${API_BASE_URL}${normalizedPath}`, init);
}

// -------------------------------------
// Main Component
// -------------------------------------
export default function PhotoAdd() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const [processing, setProcessing] = useState<boolean>(false);
  const { setGuessedItems, textToItemMatch, matchToEstimation } =
    useGuessData();

  useEffect(() => {
    setSelectedImage(undefined);
  }, []); // Clear image on reload

  const photoToTextPost = async () => {
    setProcessing(true);
    if (!selectedImage) {
      alert("No image selected.");
      setProcessing(false);
      return;
    }

    const uri = selectedImage;
    const name = uri.split("/").pop() ?? "photo.jpg";
    const ext = name.split(".").pop()?.toLowerCase();
    const type =
      ext === "png"
        ? "image/png"
        : ext === "heic"
          ? "image/heic"
          : "image/jpeg";

    const formData = new FormData();
    // FastAPI expects UploadFile with param name "file"
    formData.append("file", { uri, name, type } as any);

    try {
      const res = await fetchApi("/ocr", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      const itemMatches = textToItemMatch(JSON.parse(text));
      const guessedItems = await matchToEstimation(itemMatches);

      setGuessedItems(
        guessedItems.filter(
          (item) =>
            item.guessedItem &&
            item.guessedItem.trim() !== "" &&
            item.guessedItem !== "undefined",
        ),
      );

      router.push({ pathname: "/DisplayResults" });
    } catch (err) {
      console.error("[ocr] upload error:", err);
      alert("Failed to process image. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View className="flex-1 relative">
      <AddHeader />
      {processing ? (
        <Processing />
      ) : (
        <ImagePickerModal
          PlaceholderImage={PlaceholderImage}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          photoToTextPost={photoToTextPost}
        />
      )}
      <BackButton />
    </View>
  );
}
