import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Folosim aceeași adresă IP pe care ai configurat-o deja
// Asigură-te că este cea corectă: 192.168.1.11
const API_URL = 'http://192.168.1.13:5000/api/tasks';

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const { userToken } = useAuth();

  const handleAddTask = async () => {
    if (!title) {
      Alert.alert('Eroare', 'Titlul este obligatoriu.');
      return;
    }

    try {
      // Configurăm header-ul de autorizare
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };

      const newTask = {
        title,
        description,
        location: {
          address,
        },
      };
      await axios.post(API_URL, newTask, config);
      navigation.goBack();
    } catch (error) {
      console.error('Eroare la adăugarea task-ului:', error);
      Alert.alert('Eroare', 'Nu s-a putut salva task-ul.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Titlu Task</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Ex: Mergi la poștă"
      />

      <Text style={styles.label}>Descriere (Opțional)</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Ex: Ridică pachetul cu AWB..."
      />
      
      <Text style={styles.label}>Adresă (Opțional)</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Ex: Strada Memorandumului 2"
      />

      <Button title="Salvează Task" onPress={handleAddTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default AddTaskScreen;