import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  getMeals,
  deleteMeal,
} from "@/services/mealService";
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
      (snapshot: { docs: any[]; }) => {
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
      <View className="absolute bottom-5 right-5 z-40">
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
        {meals.map((meal) => {
          return (
            <View
              key={meal.id}
              className="bg-gray-200 p-4 mb-3 rounded-lg mx-4 border border-gray-400"
            >
              <Text className="text-lg font-semibold">{meal.title}</Text>
              <Text className="text-sm text-gray-700 mb-2">
                {meal.description}
              </Text>
              <View className="flex-row">
                <TouchableOpacity
                  className="bg-yellow-300 px-3 py-1 rounded"
                  onPress={() => router.push(`/(dashboard)/meals/${meal.id}`)}
                >
                  <Text className="text-xl">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-red-500 px-3 py-1 rounded ml-3"
                  onPress={() => handleDelete(meal.id)}
                >
                  <Text className="text-xl">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default MealsScreen;
