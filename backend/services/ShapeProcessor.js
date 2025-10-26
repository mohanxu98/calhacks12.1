class ShapeProcessor {
  constructor() {
    this.shapes = {
      heart: this.generateHeart(),
      star: this.generateStar(),
      circle: this.generateCircle(),
      triangle: this.generateTriangle(),
      square: this.generateSquare(),
      infinity: this.generateInfinity(),
      spiral: this.generateSpiral(),
    };
  }

  getRandomShape() {
    const shapeNames = Object.keys(this.shapes);
    const randomName = shapeNames[Math.floor(Math.random() * shapeNames.length)];
    return {
      type: randomName,
      points: this.shapes[randomName]
    };
  }

  getAvailableShapes() {
    return Object.keys(this.shapes);
  }

  processCustomShape(shapeData) {
    // Normalize the drawn shape
    const { points, bounds } = shapeData;
    const normalizedPoints = points.map(point => ({
      x: (point.x - bounds.minX) / (bounds.maxX - bounds.minX) - 0.5,
      y: (point.y - bounds.minY) / (bounds.maxY - bounds.minY) - 0.5
    }));
    
    return {
      type: 'custom',
      points: normalizedPoints
    };
  }

  generateHeart() {
    const points = [];
    for (let t = 0; t <= 2 * Math.PI; t += 0.1) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
      points.push({ x: x / 20, y: y / 20 });
    }
    return points;
  }

  generateStar() {
    const points = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * 2 * Math.PI;
      const radius = i % 2 === 0 ? 1 : 0.5;
      points.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle)
      });
    }
    return points;
  }

  generateCircle() {
    const points = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * 2 * Math.PI;
      points.push({
        x: Math.cos(angle),
        y: Math.sin(angle)
      });
    }
    return points;
  }

  generateTriangle() {
    return [
      { x: 0, y: 1 },
      { x: -0.866, y: -0.5 },
      { x: 0.866, y: -0.5 },
      { x: 0, y: 1 }
    ];
  }

  generateSquare() {
    return [
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: -1 }
    ];
  }

  generateInfinity() {
    const points = [];
    for (let t = 0; t <= 2 * Math.PI; t += 0.1) {
      const x = Math.sin(t);
      const y = Math.sin(2 * t) / 2;
      points.push({ x, y });
    }
    return points;
  }

  generateSpiral() {
    const points = [];
    for (let t = 0; t <= 4 * Math.PI; t += 0.1) {
      const radius = t / (4 * Math.PI);
      const x = radius * Math.cos(t);
      const y = radius * Math.sin(t);
      points.push({ x, y });
    }
    return points;
  }

  // Utility methods for shape manipulation
  scaleShape(points, scale) {
    return points.map(point => ({
      x: point.x * scale,
      y: point.y * scale
    }));
  }

  rotateShape(points, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return points.map(point => ({
      x: point.x * cos - point.y * sin,
      y: point.x * sin + point.y * cos
    }));
  }

  translateShape(points, offsetX, offsetY) {
    return points.map(point => ({
      x: point.x + offsetX,
      y: point.y + offsetY
    }));
  }
}

module.exports = new ShapeProcessor();
