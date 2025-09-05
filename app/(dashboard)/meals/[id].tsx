import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createMeal, getMealById, updateMeal } from "@/services/mealService";
import { useLoader } from "@/context/LoaderContext";
import { storage } from "@/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const MealFormScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isNew = !id || id === "new";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // image URI
  const router = useRouter();
  const { hideLoader, showLoader } = useLoader();
    const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!isNew && id) {
        try {
          showLoader();
          const meal = await getMealById(id);
          if (meal) {
            setTitle(meal.title);
            setDescription(meal.description);
            setImage(meal.image || "");
          }
        } finally {
          hideLoader();
        }
      }
    };
    load();
  }, [id]);

  // Image picker handler
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };
   const uploadImageAsync = async (uri) => {
     if (!uri) return "";
     setUploading(true);
     try {
       const response = await fetch(uri);
       const blob = await response.blob();
       const filename = `meals/${Date.now()}.jpg`;
       const storageRef = ref(storage, filename);
       await uploadBytes(storageRef, blob);
       const downloadURL = await getDownloadURL(storageRef);
       return downloadURL;
     } catch (err) {
       console.error("Image upload error:", err);
       return "";
     } finally {
       setUploading(false);
     }
   };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Title is required");
      return;
    }
    try {
      showLoader();
      let imageUrl = image;
      // If image is a local URI, upload it
      if (image && image.startsWith("file://")) {
        imageUrl = await uploadImageAsync(image);
      }
      const mealData = { title, description, image: imageUrl };
      if (isNew) {
        await createMeal(mealData);
      } else {
        await updateMeal(id, mealData);
      }
      router.back();
    } catch (err) {
      console.error("Error saving meal : ", err);
      Alert.alert("Error", "Fail to save meal");
    } finally {
      hideLoader();
    }
  };
  return (
    <View style={{ flex: 1, width: "100%", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        {isNew ? "Add Meal" : "Edit Meal"}
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          marginVertical: 8,
          borderRadius: 6,
        }}
        placeholder="Meal title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          marginVertical: 8,
          borderRadius: 6,
        }}
        placeholder="Meal description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity
        style={{
          backgroundColor: "#fbbf24",
          borderRadius: 6,
          padding: 12,
          marginVertical: 8,
        }}
        onPress={pickImage}
        disabled={uploading}
      >
        <Text style={{ fontSize: 16, color: "#fff", textAlign: "center" }}>
          {image ? "Change Meal Image" : "Select Meal Image"}
        </Text>
      </TouchableOpacity>
      {image ? (
        <Image
          source={{ uri: image }}
          style={{
            width: "100%",
            height: 180,
            borderRadius: 8,
            marginBottom: 8,
          }}
        />
      ) : null}
      <TouchableOpacity
        style={{
          backgroundColor: "#3b82f6",
          borderRadius: 6,
          padding: 12,
          marginVertical: 8,
        }}
        onPress={handleSubmit}
        disabled={uploading}
      >
        <Text style={{ fontSize: 18, color: "#fff", textAlign: "center" }}>
          {uploading ? "Uploading..." : isNew ? "Add Meal" : "Update Meal"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MealFormScreen;
