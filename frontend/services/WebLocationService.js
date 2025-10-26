import { Platform } from 'react-native';

class WebLocationService {
  constructor() {
    this.watchId = null;
    this.callbacks = [];
    this.isSupported = Platform.OS === 'web' && navigator.geolocation;
  }

  async requestPermissions() {
    if (!this.isSupported) {
      throw new Error('Geolocation not supported on this platform');
    }
    
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            reject(new Error('Location permission denied'));
          } else {
            reject(new Error('Location access failed'));
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  async getCurrentLocation() {
    if (!this.isSupported) {
      throw new Error('Geolocation not supported on this platform');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            speed: position.coords.speed || 0,
            heading: position.coords.heading || 0,
          });
        },
        (error) => {
          reject(new Error(`Location error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  startWatchingLocation(callback) {
    if (!this.isSupported) {
      throw new Error('Geolocation not supported on this platform');
    }

    this.callbacks.push(callback);

    if (this.watchId) {
      return this.watchId;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          speed: position.coords.speed || 0,
          heading: position.coords.heading || 0,
        };
        
        this.callbacks.forEach(cb => cb(locationData));
      },
      (error) => {
        console.error('Location watch error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        distanceFilter: 1, // Update every 1 meter
      }
    );

    return this.watchId;
  }

  stopWatchingLocation() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.callbacks = [];
  }

  calculateDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  }

  calculateBearing(coord1, coord2) {
    const lat1 = coord1.latitude * Math.PI / 180;
    const lat2 = coord2.latitude * Math.PI / 180;
    const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  }

  // Web-specific: Get approximate location from IP (fallback)
  async getApproximateLocation() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: 10000, // Low accuracy for IP-based location
        timestamp: Date.now(),
        speed: 0,
        heading: 0,
        source: 'ip'
      };
    } catch (error) {
      // Fallback to a default location (San Francisco)
      return {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10000,
        timestamp: Date.now(),
        speed: 0,
        heading: 0,
        source: 'default'
      };
    }
  }

  // Web-specific: Check if location services are available
  isLocationAvailable() {
    return this.isSupported && navigator.geolocation;
  }

  // Web-specific: Get location permission status
  async getPermissionStatus() {
    if (!this.isSupported) {
      return 'denied';
    }

    try {
      await this.getCurrentLocation();
      return 'granted';
    } catch (error) {
      return 'denied';
    }
  }
}

export default new WebLocationService();
