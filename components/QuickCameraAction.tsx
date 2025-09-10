import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import IntegratedCamera from "./IntegratedCamera";

interface QuickCameraActionProps {
  onImageCaptured?: (imageUri: string) => void;
  onQRScanned?: (data: string) => void;
}

export default function QuickCameraAction({
  onImageCaptured,
  onQRScanned,
}: QuickCameraActionProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<"photo" | "qr" | "both">("both");
  const { colors } = useTheme();
  const router = useRouter();

  const handleCameraAction = () => {
    Alert.alert("Camera Options", "What would you like to do?", [
      {
        text: "Take Photo for Meal",
        onPress: () => {
          setCameraMode("photo");
          setShowCamera(true);
        },
      },
      {
        text: "Scan QR Code",
        onPress: () => {
          setCameraMode("qr");
          setShowCamera(true);
        },
      },
      {
        text: "Camera & Scanner",
        onPress: () => {
          setCameraMode("both");
          setShowCamera(true);
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handleImageCaptured = (imageUri: string) => {
    setShowCamera(false);
    if (onImageCaptured) {
      onImageCaptured(imageUri);
    } else {
      // Default behavior: navigate to meal creation with image
      router.push({
        pathname: "/(dashboard)/meals/new",
        params: { imageUri },
      } as any);
    }
  };

  const handleQRScanned = (data: string) => {
    setShowCamera(false);
    if (onQRScanned) {
      onQRScanned(data);
    } else {
      // Default behavior: show QR data
      Alert.alert("QR Code Scanned", data);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handleCameraAction}
        style={{
          backgroundColor: colors.primary,
          borderRadius: 12,
          padding: 16,
          marginVertical: 8,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: 8,
            padding: 8,
            marginRight: 12,
          }}
        >
          <MaterialIcons name="camera-alt" size={24} color="white" />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            Quick Camera
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 14,
              marginTop: 2,
            }}
          >
            Take photos or scan QR codes
          </Text>
        </View>

        <MaterialIcons
          name="chevron-right"
          size={20}
          color="rgba(255,255,255,0.8)"
        />
      </TouchableOpacity>

      <IntegratedCamera
        visible={showCamera}
        onClose={() => setShowCamera(false)}
        onImageCaptured={handleImageCaptured}
        onImageSelected={handleImageCaptured}
        onQRScanned={handleQRScanned}
        mode={cameraMode}
        title={
          cameraMode === "photo"
            ? "Capture Meal Photo"
            : cameraMode === "qr"
              ? "Scan QR Code"
              : "Camera & Scanner"
        }
      />
    </View>
  );
}
