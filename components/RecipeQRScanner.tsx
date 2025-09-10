import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from "expo-router";
import IntegratedCamera from "./IntegratedCamera";

interface RecipeQRScannerProps {
  onRecipeScanned?: (recipeData: any) => void;
}

export default function RecipeQRScanner({
  onRecipeScanned,
}: RecipeQRScannerProps) {
  const [showScanner, setShowScanner] = useState(false);
  const { colors } = useTheme();
  const router = useRouter();

  const handleQRScanned = (data: string) => {
    setShowScanner(false);

    try {
      // Try to parse as JSON for recipe data
      const recipeData = JSON.parse(data);

      if (recipeData.type === "recipe" && recipeData.meal) {
        // Handle recipe QR code
        Alert.alert(
          "Recipe Found!",
          `Would you like to add "${recipeData.meal.title}" to your meals?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Add Recipe",
              onPress: () => {
                if (onRecipeScanned) {
                  onRecipeScanned(recipeData.meal);
                } else {
                  // Default: navigate to meal form with pre-filled data
                  router.push({
                    pathname: "/(dashboard)/meals/new",
                    params: {
                      prefilledData: JSON.stringify(recipeData.meal),
                    },
                  } as any);
                }
              },
            },
          ]
        );
      } else {
        // Not a recipe QR code, handle as regular QR
        Alert.alert("QR Code Scanned", `Data: ${data}`, [
          { text: "OK", style: "cancel" },
          ...(data.startsWith("http")
            ? [
                {
                  text: "Open Link",
                  onPress: () => {
                    // Handle URL
                    console.log("Opening URL:", data);
                  },
                },
              ]
            : []),
        ]);
      }
    } catch (error) {
      // Not JSON, handle as plain text/URL
      if (data.startsWith("http://") || data.startsWith("https://")) {
        Alert.alert("Website Link", `Open this link? ${data}`, [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open",
            onPress: () => {
              // Handle URL opening
              console.log("Opening URL:", data);
            },
          },
        ]);
      } else {
        Alert.alert("QR Code", `Scanned: ${data}`);
      }
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowScanner(true)}
        style={{
          backgroundColor: colors.card,
          borderRadius: 12,
          padding: 16,
          marginVertical: 8,
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View
          style={{
            backgroundColor: colors.primary + "20",
            borderRadius: 8,
            padding: 8,
            marginRight: 12,
          }}
        >
          <MaterialIcons
            name="qr-code-scanner"
            size={24}
            color={colors.primary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.text,
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            Scan Recipe QR
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              marginTop: 2,
            }}
          >
            Import recipes from QR codes
          </Text>
        </View>

        <MaterialIcons name="qr-code" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <IntegratedCamera
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onQRScanned={handleQRScanned}
        mode="qr"
        title="Scan Recipe QR Code"
      />
    </View>
  );
}
