import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import MealCard from "@/components/MealCard";
import React, { useEffect, useState } from "react";
import { getMeals, deleteMeal } from "@/services/mealService";
import { mealColRef } from "@/services/mealService";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Meal } from "@/types/meal";
import { useLoader } from "@/context/LoaderContext";
import { onSnapshot } from "firebase/firestore";

const MealsScreen = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const { hideLoader, showLoader } = useLoader();
  const router = useRouter();

  useEffect(() => {
    const unsubcribe = onSnapshot(
      mealColRef,
      (snapshot: { docs: any[] }) => {
        const mealList = snapshot.docs.map((mealRef) => ({
          id: mealRef.id,
          ...mealRef.data(),
        })) as Meal[];
        setMeals(mealList);
      },
      (err) => {
        console.error(err);
      }
    );
    return () => unsubcribe();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this meal?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            showLoader();
            try {
              await deleteMeal(id);
              setMeals((prevMeals) =>
                prevMeals.filter((meal) => meal.id !== id)
              );
            } catch (error) {
              console.error(error);
            } finally {
              hideLoader();
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 w-full justify-center align-items-center">
      <Text className="text-center text-4xl">Meals screen</Text>
      <View className="absolute bottom-5 right-24 z-40">
        <Pressable
          className="bg-blue-500 rounded-full p-5 shadow-lg"
          onPress={() => {
            router.push("/(dashboard)/meals/new");
          }}
        >
          <MaterialIcons name="add" size={28} color={"#fff"} />
        </Pressable>
      </View>

      <ScrollView className="mt-4">
        {meals.map((meal) => (
          <View
            key={meal.id}
            style={{ position: "relative", marginBottom: 16 }}
          >
            <MealCard
              meal={meal}
              onFavorite={() => {}}
              onDelete={() => handleDelete(meal.id ?? "")}
            />
            <Pressable
              onPress={() => router.push(`/(dashboard)/meals/${meal.id}`)}
              style={{ position: "absolute", top: 10, right: 16 }}
            >
              <Text style={{ color: "#3b82f6", fontWeight: "bold" }}>Edit</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MealsScreen;
