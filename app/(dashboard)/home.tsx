import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { getMeals } from "../../services/mealService";
import MealCard from "../../components/MealCard";

export default function HomeScreen() {
  const context = useContext(AuthContext);
  const user = context?.user;
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setLoading(true);
      getMeals(user.uid)
        .then((data) => setMeals(data))
        .catch((e) => setError("Failed to load meals"))
        .finally(() => setLoading(false));
    } else {
      setMeals([]);
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <View>
        <Text>Please log in to view your meals.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View>
        <Text>Loading meals...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome to MealMate!</Text>
      <FlatList
        data={meals}
        renderItem={({ item }) => <MealCard meal={item} />}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        ListEmptyComponent={<Text>No meals found.</Text>}
      />
    </View>
  );
}
