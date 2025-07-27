import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
//import { useAuth } from '../context/AuthContext';

// Asigură-te că IP-ul și cheia API sunt corecte
const API_BASE_URL = 'http://192.168.1.13:5000/api/tasks';
const GOOGLE_MAPS_API_KEY = 'AIzaSyAw8gl_82U2v05RGq8Xn8VzppoGimAuCd4';

const RouteMapScreen = () => {
  // Am eliminat userToken
  const [origin, setOrigin] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [orderedTasks, setOrderedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

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
      const fetchAndProcessData = async () => {
        setLoading(true);
        try {
          // Cerere simplă, fără token
          const tasksResponse = await axios.get(API_BASE_URL);
          
          let { status } = await requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permisiunea pentru locație a fost refuzată.');
            setLoading(false); return;
          }
          let location = await getCurrentPositionAsync({});
          setOrigin({ latitude: location.coords.latitude, longitude: location.coords.longitude });
          
          const tasksWithLocation = tasksResponse.data.filter(task => !task.isCompleted && task.location?.address);
          const geocodingPromises = tasksWithLocation.map(async task => {
            const loc = await getCoordinatesFromAddress(task.location.address);
            return loc ? { ...task, coordinate: { latitude: loc.lat, longitude: loc.lng } } : null;
          });
          const resolvedMarkers = (await Promise.all(geocodingPromises)).filter(Boolean);
          setMarkers(resolvedMarkers);
        } catch (error) {
          setErrorMsg("A apărut o eroare.");
        } finally {
          setLoading(false);
        }
      };
      fetchAndProcessData();
    }, [])
  );

  const waypoints = markers.map(m => m.coordinate);
  const destination = waypoints.pop();

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /><Text>Se calculează ruta...</Text></View>;
  }
  
  if (errorMsg) {
     return <View style={styles.centered}><Text>{errorMsg}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={origin ? { ...origin, latitudeDelta: 0.0922, longitudeDelta: 0.0421 } : null}>
        {origin && <Marker coordinate={origin} title="Locația ta" pinColor="blue" />}
        {markers.map((marker) => <Marker key={marker._id} coordinate={marker.coordinate} title={marker.title} />)}
        {origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            waypoints={waypoints.length > 0 ? waypoints : undefined}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={5}
            strokeColor="#1a73e8"
            optimizeWaypoints={true}
            onReady={result => {
              let finalOrderedTasks = [];
              const destinationTask = markers[markers.length - 1];
              if (result.waypoint_order && Array.isArray(result.waypoint_order)) {
                const waypointTasks = markers.slice(0, -1);
                const orderedWpTasks = result.waypoint_order.map(index => waypointTasks[index]);
                finalOrderedTasks = [...orderedWpTasks, destinationTask];
              } else if (destinationTask) {
                finalOrderedTasks = [destinationTask];
              }
              setOrderedTasks(finalOrderedTasks);
              if (mapRef.current && result.coordinates) {
                  mapRef.current.fitToCoordinates(result.coordinates, { edgePadding: { top: 50, right: 50, bottom: 150, left: 50 } });
              }
            }}
          />
        )}
      </MapView>
      {orderedTasks.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Ordine Traseu Optimizat:</Text>
          <FlatList
            data={orderedTasks}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => (
              <View style={styles.listItem}><Text style={styles.listNumber}>{index + 1}.</Text><Text style={styles.listText}>{item.title}</Text></View>
            )}
          />
        </View>
      )}
      {markers.length === 0 && !loading && (
         <View style={styles.overlay}><Text style={styles.overlayText}>Niciun obiectiv cu locație.</Text></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { position: 'absolute', top: 20, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 10 },
  overlayText: { color: 'white', fontSize: 16 },
  listContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 15, maxHeight: '40%', shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 5 },
  listTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  listNumber: { fontSize: 16, fontWeight: 'bold', marginRight: 10, color: '#1a73e8' },
  listText: { fontSize: 16 },
});

export default RouteMapScreen;