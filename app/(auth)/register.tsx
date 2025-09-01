import { register } from "@/services/authService";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const handleRegister = async () => {
    // Handle registration logic here
    if (!email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    await register(email, password)
      .then((res) => {
        router.replace("/home");
      })
      .catch((err) => {
        alert("Registration Failed");
        console.error("Registration Error:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View className="flex-1 w-full justify-center align-items-center">
      <Text className="text-4xl text-center">Register</Text>
      <Text className="text-lg text-center">Create a new account</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="p-4 border border-gray-300 rounded-lg"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="p-4 border border-gray-300 rounded-lg mt-4"
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        className="p-4 border border-gray-300 rounded-lg mt-4"
      />
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg shadow-lg mt-4"
        onPress={handleRegister}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text className="text-lg text-center text-white">Register</Text>
        )}
      </TouchableOpacity>

      <Text className="text-center mt-4">Already have an account?</Text>
      <Pressable
        className="bg-green-500 p-4 rounded-lg shadow-lg"
        onPress={() => router.push("/login")}
      >
        <Text className="text-2xl text-white text-center">Go to Login</Text>
      </Pressable>
    </View>
  );
};

export default Register;
