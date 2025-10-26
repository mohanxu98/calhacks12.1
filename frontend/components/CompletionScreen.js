import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

export default function CompletionScreen({ navigation, route }) {
  const { runData } = route.params;
  const { distance, time, routeCoordinates } = runData;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculatePace = () => {
    if (distance === 0) return '0:00';
    const paceSeconds = time / distance;
    const paceMins = Math.floor(paceSeconds / 60);
    const paceSecs = Math.floor(paceSeconds % 60);
    return `${paceMins}:${paceSecs.toString().padStart(2, '0')}`;
  };

  const calculateCalories = () => {
    // Rough estimate: 60 calories per km for average runner
    return Math.round(distance * 60);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎉 Amazing Run!</Text>
        <Text style={styles.subtitle}>Here's the shape you created:</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: routeCoordinates[0]?.latitude || 0,
            longitude: routeCoordinates[0]?.longitude || 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#e74c3c"
            strokeWidth={6}
          />
        </MapView>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Run Statistics</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{distance.toFixed(2)} km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatTime(time)}</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{calculatePace()}/km</Text>
            <Text style={styles.statLabel}>Pace</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{calculateCalories()}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={() => {
            // Implement sharing functionality
            console.log('Share run');
          }}
        >
          <Text style={styles.shareButtonText}>📤 Share Your Shape</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.newRunButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.newRunButtonText}>🏃‍♀️ Start New Run</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  mapContainer: {
    height: 250,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  map: {
    flex: 1,
  },
  statsContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  actionsContainer: {
    padding: 20,
    gap: 15,
  },
  shareButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newRunButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  newRunButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
