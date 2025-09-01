import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { login, register } from "@/services/authService";
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const handleLogin = async() => {
      // Handle login logic here
      if (!email || !password) {
        alert("Please fill in all fields");
        return;
      }
  
      setIsLoading(true);
      await login(email, password)
        .then((res) => {
          router.replace("/home");
        })
        .catch((err) => {
          alert("Login Failed");
          console.error("Login Error:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  return (
    <View className="flex-1 w-full justify-center align-items-center">
      <Text className="text-4xl text-center">Login</Text>
      <Text className="text-lg text-center">Sign in to your account</Text>

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
  
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg shadow-lg mt-4"
        onPress={handleLogin}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text className="text-lg text-center text-white">Login</Text>
        )}
      </TouchableOpacity>

      <Text className="text-center mt-4">Don't have an account?</Text>
      <Pressable
        className="bg-green-500 p-4 rounded-lg shadow-lg"
        onPress={() => router.push("/register")}
      >
        <Text className="text-2xl text-white text-center">Go to Register</Text>
      </Pressable>
    </View>
  );
};

export default Login;
