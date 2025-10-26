import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const CANVAS_SIZE = Math.min(width - 40, 300);

export default function ShapeDrawer({ navigation, route }) {
  const { runData } = route.params;
  const [path, setPath] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);

  const startDrawing = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const newPath = `M${locationX},${locationY}`;
    setPath(newPath);
    setPoints([{ x: locationX, y: locationY }]);
    setIsDrawing(true);
  };

  const continueDrawing = (event) => {
    if (!isDrawing) return;
    
    const { locationX, locationY } = event.nativeEvent;
    const newPath = `${path} L${locationX},${locationY}`;
    setPath(newPath);
    setPoints(prev => [...prev, { x: locationX, y: locationY }]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearDrawing = () => {
    setPath('');
    setPoints([]);
  };

  const processShape = () => {
    if (points.length < 3) {
      Alert.alert('Invalid Shape', 'Please draw a shape with at least 3 points');
      return;
    }

    // Convert drawing to shape data
    const shapeData = {
      type: 'custom',
      points: points,
      bounds: {
        minX: Math.min(...points.map(p => p.x)),
        maxX: Math.max(...points.map(p => p.x)),
        minY: Math.min(...points.map(p => p.y)),
        maxY: Math.max(...points.map(p => p.y)),
      }
    };

    const updatedRunData = { ...runData, shapeData };
    navigation.navigate('Running', { runData: updatedRunData });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Draw Your Shape</Text>
      <Text style={styles.subtitle}>Sketch the shape you want to run!</Text>

      <View style={styles.canvasContainer}>
        <View
          style={styles.canvas}
          onTouchStart={startDrawing}
          onTouchMove={continueDrawing}
          onTouchEnd={stopDrawing}
        >
          <Svg width={CANVAS_SIZE} height={CANVAS_SIZE} style={styles.svg}>
            <Path
              d={path}
              stroke="#4A90E2"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearDrawing}>
          <Text style={styles.clearButtonText}>🗑️ Clear</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.startButton} onPress={processShape}>
          <Text style={styles.startButtonText}>🏃‍♀️ Start Run</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  canvasContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e1e8ed',
    borderStyle: 'dashed',
  },
  svg: {
    position: 'absolute',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#95a5a6',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    flex: 2,
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
