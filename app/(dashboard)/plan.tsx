import React, { useContext, useState } from "react";
import { View, TextInput, Button } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { createMeal } from "../../services/mealService";

export default function PlanScreen() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleAdd = async () => {
    if (user) {
      await createMeal({
        title,
        description: desc,
        userId: user.uid,
      });
      setTitle(""); setDesc("");
      alert("Meal added!");
    }
  };

  return (
    <View>
      <TextInput placeholder="Meal Name" value={title} onChangeText={setTitle} />
      <TextInput placeholder="Description" value={desc} onChangeText={setDesc} />
      <Button title="Add Meal" onPress={handleAdd} />
    </View>
  );
}