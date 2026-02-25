import * as ImagePicker from "expo-image-picker";
import type { SetStateAction } from "react";
import { Alert, Linking, Platform, View } from "react-native";
import PickImageButton from "./buttons/PickImageButton";
import ImageViewer from "./ImageViewer";

interface imagePickerProps {
  PlaceholderImage: any;
  selectedImage: string | undefined;
  setSelectedImage: (value: SetStateAction<string | undefined>) => void;
  photoToTextPost: () => Promise<void>;
}

export default function ImagePickerModal({
  PlaceholderImage,
  selectedImage,
  setSelectedImage,
  photoToTextPost,
}: imagePickerProps) {
  const [status2, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const pickImageAsync = async () => {
    try {
      if (Platform.OS !== "web") {
        // Don't need permission for web, not that this
        // app intends to be on web
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          const permissonResponse = await requestPermission();
          if (permissonResponse.status !== "granted") {
            Alert.alert(
              "You have not given Mr. Fridge permisson to access your photo library. ",
              "You can change this in your phone settings.",
              [
                {
                  text: "Cancel",
                },
                {
                  text: "Open Settings",
                  onPress: () => {
                    Platform.OS === "ios"
                      ? Linking.openURL("app-settings:")
                      : Linking.openSettings;
                  },
                },
              ],
            );
            return; // Don't run image picker if permissions denied
          }
        }
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        // allowsEditing: true, // Lets you crop the image
        quality: 1,
        base64: true, // The format you want if you're sending the image to an api?
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      } else {
        // No image was selected, don't set any variables
      }
    } catch (error) {
      console.log("There was an issue");
    }
  };

  return (
    <View className="pt-10 flex-col items-stretch justify-between gap-4">
      <View className="flex-col items-center">
        <ImageViewer
          imgSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
      </View>
      <View className="flex-row justify-center gap-4">
        <PickImageButton
          theme="tertiary"
          label="Cancel"
          onPress={() => setSelectedImage(undefined)}
        />
        <PickImageButton
          theme="primary"
          label="Choose a photo"
          onPress={pickImageAsync}
        />
        <PickImageButton label="Use this photo" onPress={photoToTextPost} />
      </View>
    </View>
  );
}
