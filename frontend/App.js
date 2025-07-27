import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importăm doar ecranele necesare pentru fluxul principal
import TaskListScreen from './src/screens/TaskListScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import RouteMapScreen from './src/screens/RouteMapScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TaskList">
        <Stack.Screen
          name="TaskList"
          component={TaskListScreen}
          options={{ title: 'Obiectivele Mele' }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{ title: 'Detalii Obiectiv' }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{ title: 'Adaugă Obiectiv Nou' }}
        />
        <Stack.Screen
          name="RouteMap"
          component={RouteMapScreen}
          options={{ title: 'Hartă Traseu' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
