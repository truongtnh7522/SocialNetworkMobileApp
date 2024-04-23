import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { EditInforScreen } from '../Infor/InforNavigator'

const Stack = createStackNavigator()

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="EditInfor"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="EditInfor" component={EditInforScreen} />
      
    </Stack.Navigator>
  )
}
