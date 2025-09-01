import React, { useContext, useState } from "react";
import { View, TextInput, Button } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { addMeal } from "../../services/mealService";

export default function PlannerScreen() {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");

  const handleAdd = async () => {
    if (user) {
      await addMeal({
        name,
        description: desc,
        image,
        date: new Date().toISOString(),
        favorite: false,
        userId: user.uid,
      });
      setName("");
      setDesc("");
      setImage("");
      alert("Meal added!");
    }
  };

  return (
    <View>
      <TextInput placeholder="Meal Name" value={name} onChangeText={setName} />
      <TextInput
        placeholder="Description"
        value={desc}
        onChangeText={setDesc}
      />
      <TextInput
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
      />
      <Button title="Add Meal" onPress={handleAdd} />
    </View>
  );
}
