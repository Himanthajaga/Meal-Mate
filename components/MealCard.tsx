import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Meal } from "../types/meal";

export default function MealCard({ meal, onFavorite, onDelete }) {
  return (
    <View className="bg-white rounded-lg shadow p-4 mb-4">
      <Image source={{ uri: meal.image }} className="h-32 w-full rounded" />
      <Text className="text-lg font-bold mt-2">{meal.name}</Text>
      <Text className="text-gray-600">{meal.description}</Text>
      <View className="flex-row justify-between mt-2">
        <TouchableOpacity onPress={onFavorite}>
          <Text className="text-yellow-500">
            {meal.favorite ? "★" : "☆"} Favorite
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Text className="text-red-500">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
