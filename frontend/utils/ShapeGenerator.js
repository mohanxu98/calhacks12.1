class ShapeGenerator {
  constructor() {
    this.shapes = {
      heart: this.generateHeart,
      star: this.generateStar,
      circle: this.generateCircle,
      triangle: this.generateTriangle,
      square: this.generateSquare,
    };
  }

  getRandomShape() {
    const shapeNames = Object.keys(this.shapes);
    const randomName = shapeNames[Math.floor(Math.random() * shapeNames.length)];
    return {
      type: randomName,
      generator: this.shapes[randomName]
    };
  }

  getAvailableShapes() {
    return Object.keys(this.shapes);
  }

  generateHeart(center, scale = 1) {
    const points = [];
    for (let t = 0; t <= 2 * Math.PI; t += 0.1) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
      points.push({
        x: (x / 20) * scale,
        y: (y / 20) * scale
      });
    }
    return points;
  }

  generateStar(center, scale = 1) {
    const points = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * 2 * Math.PI;
      const radius = i % 2 === 0 ? scale : scale * 0.5;
      points.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle)
      });
    }
    return points;
  }

  generateCircle(center, scale = 1) {
    const points = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * 2 * Math.PI;
      points.push({
        x: scale * Math.cos(angle),
        y: scale * Math.sin(angle)
      });
    }
    return points;
  }

  generateTriangle(center, scale = 1) {
    return [
      { x: 0, y: scale },
      { x: -scale * 0.866, y: -scale * 0.5 },
      { x: scale * 0.866, y: -scale * 0.5 },
      { x: 0, y: scale }
    ];
  }

  generateSquare(center, scale = 1) {
    return [
      { x: -scale, y: -scale },
      { x: scale, y: -scale },
      { x: scale, y: scale },
      { x: -scale, y: scale },
      { x: -scale, y: -scale }
    ];
  }

  processCustomShape(shapeData) {
    const { points, bounds } = shapeData;
    
    // Normalize points to center around origin
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    const maxSize = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
    
    const normalizedPoints = points.map(point => ({
      x: (point.x - centerX) / maxSize,
      y: (point.y - centerY) / maxSize
    }));
    
    return {
      type: 'custom',
      points: normalizedPoints
    };
  }

  calculateScaleForDistance(shapePoints, targetDistance) {
    // Calculate the current size of the shape
    const bounds = this.getBounds(shapePoints);
    const currentSize = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
    
    // Convert target distance to coordinate scale
    // Rough conversion: 1 degree ≈ 111km
    const targetScale = (targetDistance / 111) / currentSize;
    
    return targetScale;
  }

  getBounds(points) {
    return {
      minX: Math.min(...points.map(p => p.x)),
      maxX: Math.max(...points.map(p => p.x)),
      minY: Math.min(...points.map(p => p.y)),
      maxY: Math.max(...points.map(p => p.y))
    };
  }

  scaleShape(shapePoints, scale) {
    return shapePoints.map(point => ({
      x: point.x * scale,
      y: point.y * scale
    }));
  }

  translateShape(shapePoints, center) {
    return shapePoints.map(point => ({
      latitude: center.latitude + point.y,
      longitude: center.longitude + point.x
    }));
  }
}

export default new ShapeGenerator();
