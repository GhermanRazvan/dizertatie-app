import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '../context/AuthContext';

// Asigură-te că IP-ul este cel corect
const API_BASE_URL = 'http://192.168.1.13:5000/api/tasks';
// !!! ÎNLOCUIEȘTE CU CHEIA TA API VALIDĂ DE LA GOOGLE !!!
const GOOGLE_MAPS_API_KEY = 'AIzaSyAw8gl_82U2v05RGq8Xn8VzppoGimAuCd4';

const TaskDetailScreen = ({ route }) => {
  const { taskId } = route.params;
  const { userToken, logout } = useAuth();
  const [task, setTask] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCoordinatesFromAddress = async (address) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: { address, key: GOOGLE_MAPS_API_KEY, components: 'locality:Cluj-Napoca|country:RO', bounds: '46.73,23.54|46.81,23.67' },
      });
      return response.data.results.length > 0 ? response.data.results[0].geometry.location : null;
    } catch (error) {
      return null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchTaskDetails = async () => {
        if (!userToken) return;
        setLoading(true);
        try {
          const config = { headers: { Authorization: `Bearer ${userToken}` } };
          const response = await axios.get(`${API_BASE_URL}/${taskId}`, config);
          const fetchedTask = response.data;
          setTask(fetchedTask);
          if (fetchedTask.location?.address) {
            await getCoordinatesFromAddress(fetchedTask.location.address);
          }
        } catch (error) {
          if (error.response?.status === 401) { logout(); }
        } finally {
          setLoading(false);
        }
      };
      fetchTaskDetails();
    }, [taskId, userToken])
  );

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  if (!task) {
    return <View style={styles.centered}><Text>Nu s-au putut încărca detaliile.</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      {coordinates && (
        <View style={styles.mapContainer}>
          <MapView style={styles.map} initialRegion={{ ...coordinates, latitudeDelta: 0.01, longitudeDelta: 0.01 }}>
            <Marker coordinate={coordinates} title={task.title} />
          </MapView>
        </View>
      )}
      <View style={styles.detailBox}><Text style={styles.label}>Stare:</Text><Text>{task.isCompleted ? '✅ Finalizat' : '◻️ De făcut'}</Text></View>
      <View style={styles.detailBox}><Text style={styles.label}>Descriere:</Text><Text>{task.description || 'Nicio descriere.'}</Text></View>
      <View style={styles.detailBox}><Text style={styles.label}>Adresă:</Text><Text>{task.location?.address || 'Nicio locație.'}</Text></View>
      <View style={styles.detailBox}><Text style={styles.label}>Adăugat la:</Text><Text>{new Date(task.createdAt).toLocaleString('ro-RO')}</Text></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  detailBox: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#555' },
  mapContainer: { height: 250, borderRadius: 8, overflow: 'hidden', marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  map: { ...StyleSheet.absoluteFillObject },
});

export default TaskDetailScreen;