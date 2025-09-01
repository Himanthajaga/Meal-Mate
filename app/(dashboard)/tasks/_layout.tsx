import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const TasksLayout = () => {
  return (
    <Stack screenOptions={{animation: "fade_from_bottom"}}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: "Task Form" }} />
      <Stack.Screen name="edit" options={{ headerShown: false }} />
    </Stack>
  );

}

export default TasksLayout