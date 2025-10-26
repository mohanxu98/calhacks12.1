import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Web-compatible map component with interactive features
export default function WebMapView({ 
  children, 
  style, 
  initialRegion,
  showsUserLocation = false,
  followsUserLocation = false,
  onRegionChange,
  ...props 
}) {
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);

  useEffect(() => {
    if (showsUserLocation && Platform.OS === 'web') {
      // Request location permission for web
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
            setIsLocationEnabled(true);
          },
          (error) => {
            console.log('Location access denied:', error);
            setIsLocationEnabled(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      }
    }
  }, [showsUserLocation]);

  const handleMapClick = (event) => {
    if (onRegionChange) {
      // Simulate region change for web
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Convert click to approximate coordinates
      const lat = initialRegion.latitude + (0.5 - y / rect.height) * 0.01;
      const lng = initialRegion.longitude + (x / rect.width - 0.5) * 0.01;
      
      onRegionChange({
        latitude: lat,
        longitude: lng,
        latitudeDelta: initialRegion.latitudeDelta,
        longitudeDelta: initialRegion.longitudeDelta
      });
    }
  };

  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.mapHeader}>
        <Text style={styles.mapTitle}>🗺️ ShapeRun Map</Text>
        <Text style={styles.mapSubtitle}>
          {isLocationEnabled ? '📍 Location enabled' : '📍 Click to enable location'}
        </Text>
      </View>
      
      <View style={styles.mapContent} onTouchEnd={handleMapClick}>
        {children}
        
        {userLocation && (
          <View style={styles.userLocationMarker}>
            <Text style={styles.markerText}>📍</Text>
          </View>
        )}
        
        <View style={styles.mapControls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    setUserLocation({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                    });
                    setIsLocationEnabled(true);
                  },
                  (error) => console.log('Location error:', error)
                );
              }
            }}
          >
            <Text style={styles.controlText}>📍 My Location</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.mapFooter}>
        <Text style={styles.footerText}>
          Web Version - For full GPS tracking, use the mobile app
        </Text>
      </View>
    </View>
  );
}

// Web-compatible Marker component
export function Marker({ coordinate, title, pinColor = 'red', children }) {
  return (
    <View style={[styles.marker, { backgroundColor: pinColor }]}>
      <Text style={styles.markerText}>📍</Text>
      {title && <Text style={styles.markerTitle}>{title}</Text>}
      {children}
    </View>
  );
}

// Web-compatible Polyline component
export function Polyline({ coordinates, strokeColor = '#4A90E2', strokeWidth = 4, ...props }) {
  return (
    <View style={styles.polylineContainer}>
      {coordinates.map((coord, index) => (
        <View
          key={index}
          style={[
            styles.polylinePoint,
            {
              backgroundColor: strokeColor,
              width: strokeWidth,
              height: strokeWidth,
              left: (coord.longitude - coordinates[0].longitude) * 10000,
              top: (coordinates[0].latitude - coord.latitude) * 10000,
            }
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e1e8ed',
  },
  mapHeader: {
    backgroundColor: '#4A90E2',
    padding: 15,
    alignItems: 'center',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  mapSubtitle: {
    fontSize: 14,
    color: '#e8f4fd',
  },
  mapContent: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  userLocationMarker: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  marker: {
    position: 'absolute',
    backgroundColor: '#e74c3c',
    borderRadius: 15,
    padding: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerText: {
    fontSize: 16,
  },
  markerTitle: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 2,
  },
  polylineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  polylinePoint: {
    position: 'absolute',
    borderRadius: 2,
  },
  mapControls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mapFooter: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  footerText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});
