import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import navStrings from '../utils.js/navStrings'
import { AddTodoScreen, MainScreen } from '../screens'

const Stack = createNativeStackNavigator()
export default function Routes() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name={navStrings.MAIN} component={MainScreen} />
            <Stack.Screen name={navStrings.ADDTODO} component={AddTodoScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}