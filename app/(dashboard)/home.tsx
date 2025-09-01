import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { getMeals } from "../../services/mealService";
import MealCard from "../../components/MealCard";

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    if (user) {
      getMeals(user.uid).then(setMeals);
    }
  }, [user]);

  return (
    <View>
      <Text>Welcome to MealMate!</Text>
      <FlatList
        data={meals}
        renderItem={({ item }) => <MealCard meal={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
