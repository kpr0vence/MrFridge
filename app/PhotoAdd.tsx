import Constants from "expo-constants";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, View } from "react-native";
import BackButton from "./components/buttons/BackButton";
import AddHeader from "./components/headers/AddHeader";
import ImagePickerModal from "./components/ImagePickerModal";
import Processing from "./components/Processing";
import { useGuessData } from "./GuessContext";

// -------------------------------------
// Helper Functions
// -------------------------------------
const PlaceholderImage = require("../assets/images/mrFridgeLogo.png");

const DEFAULT_API_PORT = 8000;

function getLanHostFromExpo(): string | undefined {
  // Usually looks like "10.126.15.233:8081"
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as any)?.manifest?.debuggerHost ??
    (Constants as any)?.manifest2?.extra?.expoClient?.hostUri;

  if (typeof hostUri !== "string") return undefined;
  return hostUri.split(":")[0];
}

function getApiBaseCandidates(): string[] {
  const port = process.env.EXPO_PUBLIC_API_PORT ?? String(DEFAULT_API_PORT);

  const envBase =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? process.env.EXPO_PUBLIC_API_URL;

  const bases: string[] = [];
  if (envBase) bases.push(envBase.replace(/\/$/, ""));

  const lanHost = getLanHostFromExpo();

  if (Platform.OS === "android") {
    // Physical Android device (Expo Go) usually needs LAN IP; emulator can use 10.0.2.2
    if (lanHost) bases.push(`http://${lanHost}:${port}`);
    bases.push(`http://10.0.2.2:${port}`);
  } else {
    // iOS simulator -> host machine
    bases.push(`http://127.0.0.1:${port}`);
    if (lanHost) bases.push(`http://${lanHost}:${port}`);
  }

  return Array.from(new Set(bases));
}

async function fetchApi(path: string, init: RequestInit): Promise<Response> {
  let lastErr: unknown;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const candidates = getApiBaseCandidates();
  console.log("[ocr] trying API bases:", candidates);

  for (const base of candidates) {
    try {
      return await fetch(`${base}${normalizedPath}`, init);
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr ?? new Error("Network request failed");
}

// -------------------------------------
// Main Component
//  -------------------------------------
export default function PhotoAdd() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const [processing, setProcessing] = useState<boolean>(false);
  const { setGuessedItems, textToItemMatch, matchToEstimation } =
    useGuessData();

  const photoToTextPost = async () => {
    setProcessing(true);
    if (!selectedImage) {
      alert("No image selected.");
      return;
    }

    const uri = selectedImage; // e.g. "file:///.../ImagePicker/abc.jpeg"
    const name = uri.split("/").pop() ?? "photo.jpg";
    const ext = name.split(".").pop()?.toLowerCase();
    const type =
      ext === "png"
        ? "image/png"
        : ext === "heic"
          ? "image/heic"
          : "image/jpeg";

    const makeForm = (fieldName: string) => {
      const form = new FormData();
      // FastAPI commonly expects UploadFile = File(...), param name often "file"
      form.append(fieldName, { uri, name, type } as any);
      return form;
    };

    const postOnce = async (fieldName: string) => {
      const res = await fetchApi("/ocr", {
        method: "POST",
        body: makeForm(fieldName),
      });
      const text = await res.text();
      return { res, text, fieldName };
    };

    // Try the two most common multipart field names
    let { res, text, fieldName } = await postOnce("file");
    if (res.status === 422) {
      ({ res, text, fieldName } = await postOnce("image"));
    }
    // Here is where we get the actual results? idk we need a loading indicator
    setProcessing(false);

    console.log("[ocr] upload field:", fieldName, "status:", res.status);
    try {
      const itemMatches = textToItemMatch(JSON.parse(text));
      const guessedItems = matchToEstimation(itemMatches); // We get all the way to guess types which go into DisplayResults
      setGuessedItems(guessedItems);
      router.push({
        pathname: "/DisplayResults",
      });
    } catch {
      console.log(text);
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
