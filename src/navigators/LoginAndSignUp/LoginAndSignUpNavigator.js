import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { EditInforScreen } from '../../containers/Infor'
import { StartScreen, LoginScreen, RegisterScreen, ResetPasswordScreen, Dashboard,VertifyPinScreen } from '../../containers/LoginAndSignUp'

const Stack = createStackNavigator()

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="StartScreen"
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen name="EditInforScreen" component={EditInforScreen} />
      <Stack.Screen name="StartScreen" component={StartScreen} />
      <Stack.Screen name="VertifyPinScreen" component={VertifyPinScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      

    </Stack.Navigator>
  )
}
