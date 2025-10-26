class RouteService {
  constructor() {
    this.baseUrl = 'http://localhost:3000/api';
  }

  async generateRoute(runData) {
    try {
      const response = await fetch(`${this.baseUrl}/generate-route`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Route generation failed:', error);
      throw error;
    }
  }

  async getAvailableShapes() {
    try {
      const response = await fetch(`${this.baseUrl}/shapes`);
      const data = await response.json();
      return data.shapes;
    } catch (error) {
      console.error('Failed to get shapes:', error);
      return ['heart', 'star', 'circle', 'triangle', 'square'];
    }
  }

  // Fallback route generation for offline/development
  generateFallbackRoute(shapeType, distance, startLocation) {
    const center = startLocation;
    const points = [];

    switch (shapeType) {
      case 'heart':
        return this.generateHeartRoute(distance, center);
      case 'star':
        return this.generateStarRoute(distance, center);
      case 'circle':
        return this.generateCircleRoute(distance, center);
      case 'triangle':
        return this.generateTriangleRoute(distance, center);
      case 'square':
        return this.generateSquareRoute(distance, center);
      default:
        return this.generateCircleRoute(distance, center);
    }
  }

  generateHeartRoute(distance, center) {
    const points = [];
    const radius = distance / (2 * Math.PI * 111); // Convert km to degrees
    
    for (let t = 0; t <= 2 * Math.PI; t += 0.1) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
      
      points.push({
        latitude: center.latitude + (x / 20) * radius,
        longitude: center.longitude + (y / 20) * radius,
      });
    }
    
    return points;
  }

  generateStarRoute(distance, center) {
    const points = [];
    const radius = distance / (2 * Math.PI * 111);
    
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * 2 * Math.PI;
      const r = i % 2 === 0 ? radius : radius * 0.5;
      
      points.push({
        latitude: center.latitude + r * Math.cos(angle),
        longitude: center.longitude + r * Math.sin(angle),
      });
    }
    
    return points;
  }

  generateCircleRoute(distance, center) {
    const points = [];
    const radius = distance / (2 * Math.PI * 111);
    
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * 2 * Math.PI;
      
      points.push({
        latitude: center.latitude + radius * Math.cos(angle),
        longitude: center.longitude + radius * Math.sin(angle),
      });
    }
    
    return points;
  }

  generateTriangleRoute(distance, center) {
    const points = [];
    const radius = distance / (2 * Math.PI * 111);
    
    const vertices = [
      { x: 0, y: radius },
      { x: -radius * 0.866, y: -radius * 0.5 },
      { x: radius * 0.866, y: -radius * 0.5 },
    ];
    
    vertices.forEach(vertex => {
      points.push({
        latitude: center.latitude + vertex.y,
        longitude: center.longitude + vertex.x,
      });
    });
    
    // Close the triangle
    points.push(points[0]);
    
    return points;
  }

  generateSquareRoute(distance, center) {
    const points = [];
    const radius = distance / (4 * 111); // Square perimeter = 4 * side
    
    const vertices = [
      { x: -radius, y: -radius },
      { x: radius, y: -radius },
      { x: radius, y: radius },
      { x: -radius, y: radius },
    ];
    
    vertices.forEach(vertex => {
      points.push({
        latitude: center.latitude + vertex.y,
        longitude: center.longitude + vertex.x,
      });
    });
    
    // Close the square
    points.push(points[0]);
    
    return points;
  }
}

export default new RouteService();
