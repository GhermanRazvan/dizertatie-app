import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const API_URL = 'http://192.168.1.13:5000/api/tasks';

const TaskListScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Adăugăm butoane în header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={() => navigation.navigate('RouteMap')} title="Hartă" />
          <View style={{ width: 10 }} />
          <Button onPress={() => navigation.navigate('AddTask')} title="Adaugă" />
        </View>
      ),
    });
  }, [navigation]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Eroare la preluarea task-urilor:", error);
      Alert.alert("Eroare", "Nu s-au putut încărca obiectivele.");
    } finally {
      setLoading(false);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchTasks();
    }, [])
  );

  // Funcția pentru a marca un task ca fiind complet/incomplet
  const handleToggleComplete = async (task) => {
    try {
        await axios.put(`${API_URL}/${task._id}`, {
            isCompleted: !task.isCompleted
        });
        await fetchTasks();
    } catch (error) {
        console.error("Eroare la actualizarea task-ului:", error);
        Alert.alert("Eroare", "Nu s-a putut actualiza starea obiectivului.");
    }
  };

  // Funcția pentru a șterge un task, cu confirmare
  const handleDeleteTask = (task) => {
    Alert.alert(
      "Confirmare Ștergere",
      `Ești sigur că vrei să ștergi obiectivul "${task.title}"?`,
      [
        {
          text: "Anulează",
          style: "cancel"
        },
        { 
          text: "Șterge", 
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/${task._id}`);
              await fetchTasks();
            } catch (error) {
              console.error("Eroare la ștergerea task-ului:", error);
              Alert.alert("Eroare", "Nu s-a putut șterge obiectivul.");
            }
          },
          style: 'destructive' 
        }
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
                    <TouchableOpacity 
                        style={[styles.actionButton, item.isCompleted ? styles.undoButton : styles.doneButton]}
                        onPress={() => handleToggleComplete(item)}
                    >
                        <Text style={styles.actionButtonText}>{item.isCompleted ? '↩️' : '✔️'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDeleteTask(item)}
                    >
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  taskItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  taskItemCompleted: {
    backgroundColor: '#e0e0e0',
  },
  taskTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  doneButton: {
    backgroundColor: '#28a745',
  },
  undoButton: {
    backgroundColor: '#ffc107',
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Roșu pentru ștergere
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
  }
});

export default TaskListScreen;