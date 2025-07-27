import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://192.168.1.13:5000/api/tasks';


const TaskListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userToken, logout } = useAuth();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button onPress={() => navigation.navigate('RouteMap')} title="Hartă" />
          <View style={{ width: 10 }} />
          <Button onPress={() => navigation.navigate('AddTask')} title="Adaugă" />
        </View>
      ),
      headerLeft: () => (
          <Button onPress={logout} title="Logout" color="#dc3545" />
      )
    });
  }, [navigation, logout]);

  // MODIFICARE: Am rescris acest bloc pentru a corecta eroarea
  useFocusEffect(
    useCallback(() => {
      const loadTasks = async () => {
        if (!userToken) return;
        setLoading(true);
        try {
          const config = { headers: { Authorization: `Bearer ${userToken}` } };
          const response = await axios.get(API_URL, config);
          setTasks(response.data);
        } catch (error) {
          if (error.response?.status === 401) {
            Alert.alert("Sesiune Expirată", "Te rugăm să te autentifici din nou.");
            logout();
          }
        } finally {
          setLoading(false);
        }
      };

      loadTasks(); // Apelăm funcția async din interior
    }, [userToken])
  );

  const handleToggleComplete = async (task) => {
    try {
        const config = { headers: { Authorization: `Bearer ${userToken}` } };
        await axios.put(`${API_URL}/${task._id}`, { isCompleted: !task.isCompleted }, config);
        // Reîncărcăm datele manual după modificare
        const response = await axios.get(API_URL, config);
        setTasks(response.data);
    } catch (error) {
        Alert.alert("Eroare", "Nu s-a putut actualiza starea obiectivului.");
    }
  };

  const handleDeleteTask = (task) => {
    Alert.alert("Confirmare Ștergere", `Ești sigur că vrei să ștergi obiectivul "${task.title}"?`,
      [
        { text: "Anulează", style: "cancel" },
        { text: "Șterge", onPress: async () => {
            try {
              const config = { headers: { Authorization: `Bearer ${userToken}` } };
              await axios.delete(`${API_URL}/${task._id}`, config);
              // Reîncărcăm datele manual după modificare
              const response = await axios.get(API_URL, config);
              setTasks(response.data);
            } catch (error) {
              Alert.alert("Eroare", "Nu s-a putut șterge obiectivul.");
            }
          }, style: 'destructive' }
      ]
    );
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
            <TouchableOpacity
                style={[styles.taskItem, item.isCompleted && styles.taskItemCompleted]}
                onPress={() => navigation.navigate('TaskDetail', { taskId: item._id })}
                disabled={item.isCompleted}
            >
                <View style={styles.taskTextContainer}>
                    <Text style={[styles.taskTitle, item.isCompleted && styles.taskTitleCompleted]}>{item.title}</Text>
                    <Text style={styles.taskAddress}>{item.location?.address || 'Fără locație specificată'}</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={[styles.actionButton, item.isCompleted ? styles.undoButton : styles.doneButton]} onPress={() => handleToggleComplete(item)}>
                        <Text style={styles.actionButtonText}>{item.isCompleted ? '↩️' : '✔️'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDeleteTask(item)}>
                        <Text style={styles.actionButtonText}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )}
        ListEmptyComponent={<View style={styles.centered}><Text>Nu ai niciun obiectiv. Adaugă unul!</Text></View>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  taskItem: { backgroundColor: '#ffffff', padding: 15, marginVertical: 6, marginHorizontal: 10, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2 },
  taskItemCompleted: { backgroundColor: '#e0e0e0' },
  taskTextContainer: { flex: 1, marginRight: 10 },
  taskTitle: { fontSize: 18, fontWeight: '500' },
  taskTitleCompleted: { textDecorationLine: 'line-through', color: '#888' },
  taskAddress: { fontSize: 14, color: '#666', marginTop: 4 },
  buttonsContainer: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { padding: 8, borderRadius: 20, marginLeft: 8, justifyContent: 'center', alignItems: 'center', minWidth: 40, minHeight: 40 },
  doneButton: { backgroundColor: '#28a745' },
  undoButton: { backgroundColor: '#ffc107' },
  deleteButton: { backgroundColor: '#dc3545' },
  actionButtonText: { color: 'white', fontSize: 16 }
});

export default TaskListScreen;