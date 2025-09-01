import { View, Text } from 'react-native'
import React from 'react'
import { Stack,Slot } from 'expo-router'
import "./../global.css"
import { AuthProvider } from '@/context/AuthContext'
import { LoaderProvider } from '@/context/LoaderContext'

const RootLayout = () => {
  return (
    <LoaderProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </LoaderProvider>
  );
}

export default RootLayout