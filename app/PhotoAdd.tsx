import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Linking, Platform, View } from "react-native";
import AddHeader from "./components/AddHeader";
import BackButton from "./components/BackButton";
import ImageViewer from "./components/ImageViewer";
import PickImageButton from "./components/PickImageButton";

const PlaceholderImage = require("../assets/images/mrFridgeLogo.png");

export default function Camera() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const [status2, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  // status2 works for iOS mainly, but requestPermission is used by both?
  // TODO: Rename to something better

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
        alert("No image selected");
      }
    } catch (error) {
      console.log("There was an issue");
    }
  };

  const usePhoto = () => {
    if (selectedImage) {
      router.push({
        pathname: "/ProcessDisplay",
        params: {
          data: JSON.stringify(selectedImage),
        },
      });
    } else {
      alert("No image selected.");
    }
  };

  return (
    <View className="flex-1 relative">
      <AddHeader />
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
          <PickImageButton label="Use this photo" onPress={usePhoto} />
        </View>
      </View>
      <BackButton />
    </View>
  );
}

/*
Return Type Example:
iOs:
{
  "assets": [
    {
      "assetId": "99D53A1F-FEEF-40E1-8BB3-7DD55A43C8B7/L0/001",
      "base64": null,
      "duration": null,
      "exif": null,
      "fileName": "IMG_0004.JPG",
      "fileSize": 2548364,
      "height": 1669,
      "mimeType": "image/jpeg",
      "type": "image",
      "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FStickerSmash-13f21121-fc9d-4ec6-bf89-bf7d6165eb69/ImagePicker/ea574eaa-f332-44a7-85b7-99704c22b402.jpeg",
      "width": 1668
    }
  ],
  "canceled": false
}

Android:
{
  "assets": [
    {
      "assetId": null,
      "base64": null,
      "duration": null,
      "exif": null,
      "fileName": "ea574eaa-f332-44a7-85b7-99704c22b402.jpeg",
      "fileSize": 4513577,
      "height": 4570,
      "mimeType": "image/jpeg",
      "rotation": null,
      "type": "image",
      "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FStickerSmash-13f21121-fc9d-4ec6-bf89-bf7d6165eb69/ImagePicker/ea574eaa-f332-44a7-85b7-99704c22b402.jpeg",
      "width": 2854
    }
  ],
  "canceled": false
}
*/
