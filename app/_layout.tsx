import { View, Text } from "react-native";
import React from "react";
import { Stack, Slot } from "expo-router";
import "./../global.css";
import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/context/LoaderContext";
import { ThemeProvider } from "@/context/ThemeContext";

const RootLayout = () => {
  return (
    <ThemeProvider>
      <LoaderProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </LoaderProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
