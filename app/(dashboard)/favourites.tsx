import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { getMeals } from "../../services/mealService";
import MealCard from "../../components/MealCard";

export default function FavouritesScreen() {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    if (user) {
      getMeals(user.uid).then((data) =>
        setMeals(data.filter((m) => m.favorite))
      );
    }
  }, [user]);

  return (
    <View>
      <Text>Your Favorite Meals</Text>
      <FlatList
        data={meals}
        renderItem={({ item }) => <MealCard meal={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
