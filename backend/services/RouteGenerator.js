const axios = require('axios');

class RouteGenerator {
  constructor() {
    this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
  }

  async generateFromShape(shape, targetDistance, startLocation) {
    try {
      console.log('Generating route for shape:', shape.type);
      
      // Convert shape to waypoints
      const waypoints = this.shapeToWaypoints(shape, targetDistance, startLocation);
      
      if (this.googleMapsApiKey) {
        // Use Google Directions API to get real roads
        const route = await this.getDirectionsRoute(waypoints);
        console.log('Generated route with Google Maps API');
        return route;
      } else {
        console.log('Google Maps API key not configured, using fallback');
        return this.generateFallbackRoute(targetDistance, startLocation);
      }
    } catch (error) {
      console.error('Route generation failed:', error);
      // Fallback to simple circular route
      return this.generateFallbackRoute(targetDistance, startLocation);
    }
  }

  shapeToWaypoints(shape, targetDistance, startLocation) {
    const { type, points } = shape;
    const scale = this.calculateScale(points, targetDistance);
    
    return points.map(point => ({
      lat: startLocation.latitude + (point.y * scale),
      lng: startLocation.longitude + (point.x * scale)
    }));
  }

  calculateScale(points, targetDistance) {
    // Calculate the scale factor to achieve target distance
    const bounds = this.getBounds(points);
    const shapeWidth = bounds.maxX - bounds.minX;
    const shapeHeight = bounds.maxY - bounds.minY;
    const shapeSize = Math.max(shapeWidth, shapeHeight);
    
    // Rough conversion: 1 degree ≈ 111km
    const scale = (targetDistance / 111) / shapeSize;
    return scale;
  }

  getBounds(points) {
    return {
      minX: Math.min(...points.map(p => p.x)),
      maxX: Math.max(...points.map(p => p.x)),
      minY: Math.min(...points.map(p => p.y)),
      maxY: Math.max(...points.map(p => p.y))
    };
  }

  async getDirectionsRoute(waypoints) {
    if (!this.googleMapsApiKey) {
      throw new Error('Google Maps API key not configured');
    }

    const origin = waypoints[0];
    const destination = waypoints[waypoints.length - 1];
    const waypointsStr = waypoints.slice(1, -1)
      .map(wp => `${wp.lat},${wp.lng}`)
      .join('|');

    const url = `${this.baseUrl}/directions/json`;
    const params = {
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      waypoints: waypointsStr,
      key: this.googleMapsApiKey,
      mode: 'walking', // Use walking mode for running routes
      avoid: 'highways|tolls|ferries', // Avoid unsafe routes
      optimize: false // Don't optimize waypoint order
    };

    console.log('Calling Google Directions API...');
    const response = await axios.get(url, { params });
    
    if (response.data.status !== 'OK') {
      throw new Error(`Google Directions API error: ${response.data.status}`);
    }

    const route = response.data.routes[0];
    const decodedRoute = this.decodePolyline(route.overview_polyline.points);
    
    console.log(`Generated route with ${decodedRoute.length} points`);
    return decodedRoute;
  }

  decodePolyline(encoded) {
    const points = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5
      });
    }

    return points;
  }

  generateFallbackRoute(targetDistance, startLocation) {
    console.log('Generating fallback route');
    // Generate a simple circular route as fallback
    const points = [];
    const radius = targetDistance / (2 * Math.PI * 111); // Convert km to degrees
    
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * 2 * Math.PI;
      points.push({
        latitude: startLocation.latitude + radius * Math.cos(angle),
        longitude: startLocation.longitude + radius * Math.sin(angle)
      });
    }
    
    return points;
  }

  calculateRouteStats(coordinates) {
    if (coordinates.length < 2) {
      return { distance: 0, estimatedTime: 0 };
    }

    let totalDistance = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const distance = this.calculateDistance(
        coordinates[i - 1],
        coordinates[i]
      );
      totalDistance += distance;
    }

    // Estimate time based on average running pace (5 min/km)
    const estimatedTime = totalDistance * 5; // minutes

    return {
      distance: totalDistance,
      estimatedTime: estimatedTime,
      pointCount: coordinates.length
    };
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
}

module.exports = new RouteGenerator();
