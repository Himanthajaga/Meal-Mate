import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <View>
      <Text>Email: {user?.email}</Text>
      <Button title="Logout" onPress={signOut} />
    </View>
  );
}
