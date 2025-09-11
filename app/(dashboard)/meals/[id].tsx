import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createMeal, getMealById, updateMeal } from "@/services/mealService";
import { Meal } from "@/types/meal";
import { useLoader } from "@/context/LoaderContext";
import { useAuth } from "@/context/AuthContext";
import IntegratedCamera from "@/components/IntegratedCamera";
import NotificationService from "@/services/notificationService";
import { MaterialIcons } from "@expo/vector-icons";
const MealFormScreen = () => {
  const { id, imageUri, prefilledData } = useLocalSearchParams<{
    id?: string;
    imageUri?: string;
    prefilledData?: string;
  }>();
  const isNew = !id || id === "new";
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // image URI
  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  const [plannedDate, setPlannedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [ingredients, setIngredients] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState("");
  const [calories, setCalories] = useState("");
  const [isPlanned, setIsPlanned] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("");
  const router = useRouter();
  const { hideLoader, showLoader } = useLoader();
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth(); // Get user from auth context
  const currentUserId = user?.uid; // Adjust based on your auth context structure

  useEffect(() => {
    const load = async () => {
      // Set image from camera if provided
      if (imageUri) {
        setImage(imageUri as string);
      }

      // Handle prefilled data from QR recipe scans
      if (prefilledData && isNew) {
        try {
          const recipeData = JSON.parse(prefilledData as string);
          setTitle(recipeData.title || recipeData.name || "");
          setName(recipeData.name || recipeData.title || "");
          setDescription(
            recipeData.description || recipeData.instructions || ""
          );
          setIngredients(
            Array.isArray(recipeData.ingredients)
              ? recipeData.ingredients.join(", ")
              : recipeData.ingredients || ""
          );
          setCookingTime(
            recipeData.cookingTime?.toString() ||
              recipeData.prepTime?.toString() ||
              ""
          );
          setServings(
            recipeData.servings?.toString() ||
              recipeData.serves?.toString() ||
              ""
          );
          setCalories(
            recipeData.calories?.toString() ||
              recipeData.nutrition?.calories?.toString() ||
              ""
          );
          if (recipeData.image || recipeData.imageUrl) {
            setImage(recipeData.image || recipeData.imageUrl);
          }
        } catch (error) {
          console.log("Error parsing prefilled data:", error);
        }
      }

      if (!isNew && id) {
        try {
          showLoader();
          const meal = await getMealById(id);
          if (meal) {
            const mealData = meal as Meal;
            setTitle(mealData.title || "");
            setName(mealData.name || "");
            setDescription(mealData.description || "");
            setImage(mealData.image || "");
            setMealType(mealData.mealType || "breakfast");
            setPlannedDate(
              mealData.plannedDate
                ? mealData.plannedDate.split("T")[0]
                : new Date().toISOString().split("T")[0]
            );
            setIngredients(
              mealData.ingredients ? mealData.ingredients.join(", ") : ""
            );
            setCookingTime(
              mealData.cookingTime ? mealData.cookingTime.toString() : ""
            );
            setServings(mealData.servings ? mealData.servings.toString() : "");
            setCalories(mealData.calories ? mealData.calories.toString() : "");
            setIsPlanned(mealData.isPlanned || false);

            // Set reminder defaults
            setReminderEnabled(mealData.isPlanned || false);
            setReminderTime(
              NotificationService.getDefaultNotificationTimes()[
                mealData.mealType || "lunch"
              ]
            );
          }
        } finally {
          hideLoader();
        }
      }
    };
    load();
  }, [id, imageUri, prefilledData]);

  // Image picker handler
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use enum value as per expo-image-picker docs
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Camera handlers
  const handleCameraCapture = (imageUri: string) => {
    setImage(imageUri);
    setShowCamera(false);
  };

  const handleGallerySelect = (imageUri: string) => {
    setImage(imageUri);
    setShowCamera(false);
  };

  // Cloudinary upload
  const uploadImageAsync = async (uri: string) => {
    if (!uri) return "";
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", {
        uri,
        type: "image/jpeg",
        name: "upload.jpg",
      } as any);
      data.append("upload_preset", "my_preset"); // Replace with your preset

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dfwzzxgja/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const result = await res.json();
      if (!result.secure_url) {
        console.error("Cloudinary upload failed:", result);
        return "";
      }
      return result.secure_url;
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
      let imageUrl = image ?? "";
      // If image is a local URI, upload it
      if (imageUrl && imageUrl.startsWith("file://")) {
        imageUrl = await uploadImageAsync(imageUrl);
      }
      const mealData: Meal = {
        title,
        name,
        description,
        image: imageUrl,
        userId: currentUserId ?? "",
        favorite: false,
        date: new Date().toISOString(),
        mealType,
        plannedDate: plannedDate + "T12:00:00.000Z",
        ingredients: ingredients
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i),
        cookingTime: cookingTime ? parseInt(cookingTime) : undefined,
        servings: servings ? parseInt(servings) : undefined,
        calories: calories ? parseInt(calories) : undefined,
        isPlanned,
      };
      let mealId: string;
      if (isNew) {
        mealId = await createMeal(mealData);
      } else {
        await updateMeal(id, mealData);
        mealId = id;
      }

      // Handle notification scheduling
      if (isPlanned && reminderEnabled) {
        const notificationTime =
          reminderTime ||
          NotificationService.getDefaultNotificationTimes()[mealType];
        await NotificationService.scheduleMealNotification({
          id: mealId,
          title: title || name,
          name: name || title,
          mealType,
          plannedDate,
          reminderTime: notificationTime,
        });

        Alert.alert(
          "Meal Saved",
          `Your meal has been saved and a reminder is set for ${NotificationService.formatNotificationTime(notificationTime)} on ${new Date(plannedDate).toLocaleDateString()}`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        // Cancel notification if meal is no longer planned or reminder is disabled
        if (!isNew) {
          await NotificationService.cancelMealNotification(mealId);
        }
        router.back();
      }
    } catch (err) {
      console.error("Error saving meal : ", err);
      Alert.alert("Error", "Fail to save meal");
    } finally {
      hideLoader();
    }
  };
  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        {isNew ? "Add Meal" : "Edit Meal"}
      </Text>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginVertical: 8,
          borderRadius: 8,
          fontSize: 16,
          backgroundColor: "#fff",
        }}
        placeholder="Meal Title *"
        placeholderTextColor="#999"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginVertical: 8,
          borderRadius: 8,
          fontSize: 16,
          backgroundColor: "#fff",
        }}
        placeholder="Meal Name *"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginVertical: 8,
          borderRadius: 8,
          fontSize: 16,
          height: 80,
          textAlignVertical: "top",
          backgroundColor: "#fff",
        }}
        placeholder="Meal Description"
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity
        style={{
          backgroundColor: "#fbbf24",
          borderRadius: 8,
          padding: 15,
          marginVertical: 8,
          alignItems: "center",
        }}
        onPress={pickImage}
        disabled={uploading}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 8,
              marginBottom: 8,
            }}
          />
        ) : (
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: "#ccc",
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text>Add Photo</Text>
          </View>
        )}
        <Text style={{ fontSize: 16, color: "#fff", textAlign: "center" }}>
          {image ? "Change Meal Image" : "Select from Gallery"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#10b981",
          borderRadius: 8,
          padding: 15,
          marginVertical: 8,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
        onPress={() => setShowCamera(true)}
        disabled={uploading}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#fff",
            textAlign: "center",
            marginRight: 8,
          }}
        >
          Take Photo with Camera
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginTop: 15,
          marginBottom: 10,
        }}
      >
        Meal Type
      </Text>
      <View style={{ flexDirection: "row", marginBottom: 15 }}>
        {["breakfast", "lunch", "dinner", "snack"].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => setMealType(type as any)}
            style={{
              backgroundColor: mealType === type ? "#007AFF" : "#e0e0e0",
              padding: 10,
              borderRadius: 8,
              marginRight: 10,
            }}
          >
            <Text
              style={{
                color: mealType === type ? "white" : "black",
                textTransform: "capitalize",
              }}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
        Planned Date
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginVertical: 8,
          borderRadius: 8,
          fontSize: 16,
          backgroundColor: "#fff",
        }}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#999"
        value={plannedDate}
        onChangeText={setPlannedDate}
      />

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginVertical: 8,
          borderRadius: 8,
          fontSize: 16,
          backgroundColor: "#fff",
        }}
        placeholder="Ingredients (comma-separated)"
        placeholderTextColor="#999"
        value={ingredients}
        onChangeText={setIngredients}
      />

      <View style={{ flexDirection: "row", marginVertical: 8 }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 12,
            borderRadius: 8,
            fontSize: 16,
            flex: 1,
            marginRight: 5,
            backgroundColor: "#fff",
          }}
          placeholder="Cooking time (min)"
          placeholderTextColor="#999"
          value={cookingTime}
          onChangeText={setCookingTime}
          keyboardType="numeric"
        />
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 12,
            borderRadius: 8,
            fontSize: 16,
            flex: 1,
            marginHorizontal: 5,
            backgroundColor: "#fff",
          }}
          placeholder="Servings"
          placeholderTextColor="#999"
          value={servings}
          onChangeText={setServings}
          keyboardType="numeric"
        />
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 12,
            borderRadius: 8,
            fontSize: 16,
            flex: 1,
            marginLeft: 5,
            backgroundColor: "#fff",
          }}
          placeholder="Calories"
          placeholderTextColor="#999"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
        />
      </View>

      <View
        style={{
          backgroundColor: "#f8f9fa",
          padding: 15,
          borderRadius: 8,
          marginVertical: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Switch
            value={isPlanned}
            onValueChange={setIsPlanned}
            trackColor={{ false: "#ccc", true: "#007AFF" }}
            thumbColor={isPlanned ? "#fff" : "#f4f3f4"}
          />
          <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: "600" }}>
            Schedule this meal
          </Text>
        </View>
        <Text style={{ fontSize: 14, color: "#666", marginLeft: 35 }}>
          {isPlanned
            ? `This meal will be scheduled for ${mealType} on ${new Date(plannedDate).toLocaleDateString()}`
            : "Enable this to automatically add this meal to your planned meals for the selected date and meal type"}
        </Text>

        {isPlanned && (
          <View style={{ marginTop: 12, marginLeft: 35 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
              Schedule Date
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 12,
                borderRadius: 8,
                fontSize: 16,
                backgroundColor: "#fff",
              }}
              placeholder="YYYY-MM-DD"
              value={plannedDate}
              onChangeText={setPlannedDate}
            />
          </View>
        )}
      </View>

      {/* Notification Settings */}
      {isPlanned && (
        <View
          style={{
            backgroundColor: "#f0f9ff",
            padding: 15,
            borderRadius: 8,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: "#3b82f6",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <MaterialIcons name="notifications" size={24} color="#3b82f6" />
            <Text
              style={{
                marginLeft: 10,
                fontSize: 18,
                fontWeight: "600",
                color: "#1e40af",
              }}
            >
              Meal Reminder
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ false: "#ccc", true: "#3b82f6" }}
              thumbColor={reminderEnabled ? "#fff" : "#f4f3f4"}
            />
            <Text style={{ marginLeft: 10, fontSize: 16 }}>
              Send reminder notification
            </Text>
          </View>

          {reminderEnabled && (
            <View style={{ marginLeft: 35 }}>
              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                Default time:{" "}
                {NotificationService.formatNotificationTime(
                  reminderTime ||
                    NotificationService.getDefaultNotificationTimes()[mealType]
                )}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#3b82f6",
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 6,
                  alignSelf: "flex-start",
                }}
                onPress={() => {
                  Alert.prompt(
                    "Set Reminder Time",
                    "Enter time (HH:MM format)",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Set",
                        onPress: (time) => {
                          if (
                            time &&
                            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)
                          ) {
                            setReminderTime(time);
                          } else {
                            Alert.alert(
                              "Invalid Time",
                              "Please enter a valid time in HH:MM format"
                            );
                          }
                        },
                      },
                    ],
                    "plain-text",
                    reminderTime ||
                      NotificationService.getDefaultNotificationTimes()[
                        mealType
                      ]
                  );
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 14, fontWeight: "500" }}
                >
                  Change Time
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text
            style={{
              fontSize: 12,
              color: "#666",
              marginTop: 8,
              fontStyle: "italic",
            }}
          >
            📱 You'll receive a notification at the scheduled time to remind you
            about this meal
          </Text>
        </View>
      )}
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

      {/* Integrated Camera */}
      <IntegratedCamera
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onImageCaptured={handleCameraCapture}
        onImageSelected={handleGallerySelect}
        mode="photo"
        title="Capture Meal Photo"
      />
    </ScrollView>
  );
};

export default MealFormScreen;
