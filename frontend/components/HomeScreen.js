import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [distance, setDistance] = useState('5');
  const [isLoading, setIsLoading] = useState(false);

  const requestLocationPermission = async () => {
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required for ShapeRun');
      return false;
    }
    return true;
  };

  const startRun = async (shapeType) => {
    setIsLoading(true);
    
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setIsLoading(false);
      return;
    }

    try {
      const location = await getCurrentPositionAsync({});
      const runData = {
        distance: parseFloat(distance),
        shapeType,
        startLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      };

      if (shapeType === 'draw') {
        navigation.navigate('ShapeDrawer', { runData });
      } else {
        navigation.navigate('Running', { runData });
      }
    } catch (error) {
      Alert.alert('Error', 'Could not get your location');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏃‍♀️ ShapeRun</Text>
        <Text style={styles.subtitle}>Discover hidden shapes as you run!</Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.label}>Distance (km)</Text>
        <TextInput
          style={styles.input}
          value={distance}
          onChangeText={setDistance}
          keyboardType="numeric"
          placeholder="Enter distance"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.drawButton]}
          onPress={() => startRun('draw')}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>🎨 Draw My Shape</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.surpriseButton]}
          onPress={() => startRun('surprise')}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>🎲 Surprise Me</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <Text style={styles.loadingText}>Getting your location...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 40,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    gap: 20,
  },
  button: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  drawButton: {
    backgroundColor: '#e74c3c',
  },
  surpriseButton: {
    backgroundColor: '#9b59b6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#7f8c8d',
    fontSize: 16,
  },
});
