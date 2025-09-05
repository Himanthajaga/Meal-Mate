import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Meal } from "../types/meal";

interface MealCardProps {
  meal: Meal;
  onFavorite: () => void;
  onDelete: () => void;
}

export default function MealCard({ meal, onFavorite, onDelete }: MealCardProps) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        padding: 16,
        marginBottom: 12,
      }}
    >
      {meal.image && (
        <Image
          source={{ uri: meal.image }}
          style={{ height: 120, width: "100%", borderRadius: 8 }}
        />
      )}
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>{meal.name}</Text>
      <Text style={{ color: "#666" }}>{meal.description}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <TouchableOpacity onPress={onFavorite}>
          <Text style={{ color: "#fbbf24" }}>
            {meal.favorite ? "★" : "☆"} Favorite
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Text style={{ color: "#ef4444" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
