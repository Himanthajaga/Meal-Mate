import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createMeal, getMealById, updateMeal } from "@/services/mealService";
import { useLoader } from "@/context/LoaderContext";

const MealFormScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isNew = !id || id === "new";
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const router = useRouter();
  const { hideLoader, showLoader } = useLoader();

  useEffect(() => {
    const load = async () => {
      if (!isNew && id) {
        try {
          showLoader();
          const meal = await getMealById(id);
          if (meal) {
            setTitle(meal.title);
            setDescription(meal.description);
          }
        } finally {
          hideLoader();
        }
      }
    };
    load();
  }, [id]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Title is required");
      return;
    }
    try {
      showLoader();
      if (isNew) {
        await createMeal({ title, description });
      } else {
        await updateMeal(id, { title, description });
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
    <View className="flex-1 w-full p-5">
      <Text className="text-2xl font-bold">
        {isNew ? "Add Meal" : "Edit Meal"}
      </Text>
      <TextInput
        className="border border-gray-400 p-2 my-2 rounded-md"
        placeholder="Meal title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        className="border border-gray-400 p-2 my-2 rounded-md"
        placeholder="Meal description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity
        className="bg-blue-400 rounded-md px-6 py-3 my-2"
        onPress={handleSubmit}
      >
        <Text className="text-xl text-white text-center">
          {isNew ? "Add Meal" : "Update Meal"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MealFormScreen;
