import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { AddTodoScreen, MainScreen } from '../screens';
import { Provider } from 'react-redux';
import store from '../redux/store/store';

const Stack = createNativeStackNavigator();


export default function Routes() {
  return (
      <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name={"MainScreen"} component={MainScreen} />
          <Stack.Screen name={"AddTodoScreen"} component={AddTodoScreen} />
        </Stack.Navigator>
        </Provider>
      </NavigationContainer>
  );
}
