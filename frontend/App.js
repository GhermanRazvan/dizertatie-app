import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// Importăm TOATE ecranele
import TaskListScreen from './src/screens/TaskListScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import RouteMapScreen from './src/screens/RouteMapScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

// Grup de ecrane pentru utilizatorii autentificați
const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Obiectivele Mele' }} />
    <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Detalii Obiectiv' }} />
    <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Adaugă Obiectiv Nou' }} />
    <Stack.Screen name="RouteMap" component={RouteMapScreen} options={{ title: 'Hartă Traseu' }} />
  </Stack.Navigator>
);

// Grup de ecrane pentru procesul de autentificare
const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

// Navigatorul principal care decide ce se afișează
const RootNavigator = () => {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
