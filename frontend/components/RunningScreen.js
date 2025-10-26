import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

export default function RunningScreen({ navigation, route }) {
  const { runData } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [routeGenerated, setRouteGenerated] = useState(false);

  const locationSubscription = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    generateRoute();
    startLocationTracking();
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  const generateRoute = async () => {
    try {
      // Call backend API to generate route
      const response = await fetch('http://localhost:3000/api/generate-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runData),
      });
      
      if (response.ok) {
        const routeData = await response.json();
        setRouteCoordinates(routeData.coordinates);
        setRouteGenerated(true);
      } else {
        throw new Error('Failed to generate route');
      }
    } catch (error) {
      console.log('Using fallback route generation');
      // Fallback: generate a simple test route
      const testRoute = generateTestRoute();
      setRouteCoordinates(testRoute);
      setRouteGenerated(true);
    }
  };

  const generateTestRoute = () => {
    // Generate a simple heart shape for testing
    const center = runData.startLocation;
    const points = [];
    
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * 2 * Math.PI;
      const radius = 0.01; // ~1km radius
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      points.push({
        latitude: center.latitude + x,
        longitude: center.longitude + y,
      });
    }
    
    return points;
  };

  const startLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required');
      return;
    }

    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        setCurrentLocation(location.coords);
        if (isRunning) {
          updateProgress(location.coords);
        }
      }
    );
  };

  const updateProgress = (coords) => {
    if (routeCoordinates.length === 0) return;

    // Calculate distance to next waypoint
    const nextWaypoint = routeCoordinates[currentStep];
    const distanceToNext = calculateDistance(coords, nextWaypoint);

    if (distanceToNext < 50) { // Within 50 meters
      setCurrentStep(prev => Math.min(prev + 1, routeCoordinates.length - 1));
    }

    // Update total distance
    setDistance(prev => prev + 0.01); // Simplified distance calculation
  };

  const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Distance in meters
  };

  const startRun = () => {
    setIsRunning(true);
    timer.current = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
  };

  const pauseRun = () => {
    setIsRunning(false);
    if (timer.current) {
      clearInterval(timer.current);
    }
  };

  const finishRun = () => {
    pauseRun();
    navigation.navigate('Completion', {
      runData: {
        ...runData,
        distance,
        time,
        routeCoordinates,
      }
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!routeGenerated || !currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Generating your route...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#4A90E2"
            strokeWidth={4}
            lineDashPattern={[5, 5]}
          />
        )}
        
        {routeCoordinates[currentStep] && (
          <Marker
            coordinate={routeCoordinates[currentStep]}
            title="Next Waypoint"
            pinColor="red"
          />
        )}
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{distance.toFixed(2)} km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatTime(time)}</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{currentStep + 1}/{routeCoordinates.length}</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>

        <View style={styles.controls}>
          {!isRunning ? (
            <TouchableOpacity style={styles.startButton} onPress={startRun}>
              <Text style={styles.buttonText}>▶️ Start</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.runningControls}>
              <TouchableOpacity style={styles.pauseButton} onPress={pauseRun}>
                <Text style={styles.buttonText}>⏸️ Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.finishButton} onPress={finishRun}>
                <Text style={styles.buttonText}>🏁 Finish</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  controls: {
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  runningControls: {
    flexDirection: 'row',
    gap: 15,
  },
  pauseButton: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
  },
  finishButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
