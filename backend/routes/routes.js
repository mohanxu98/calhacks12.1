const express = require('express');
const router = express.Router();
const RouteGenerator = require('../services/RouteGenerator');
const ShapeProcessor = require('../services/ShapeProcessor');

// Generate route based on shape and distance
router.post('/generate-route', async (req, res) => {
  try {
    const { distance, shapeType, startLocation, shapeData } = req.body;
    
    // Validate required fields
    if (!distance || !shapeType || !startLocation) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['distance', 'shapeType', 'startLocation']
      });
    }

    // Validate distance
    if (distance < 0.5 || distance > 50) {
      return res.status(400).json({ 
        error: 'Invalid distance',
        message: 'Distance must be between 0.5 and 50 km'
      });
    }

    let routeCoordinates;
    
    if (shapeType === 'surprise') {
      // Generate random shape
      const randomShape = ShapeProcessor.getRandomShape();
      routeCoordinates = await RouteGenerator.generateFromShape(
        randomShape, 
        distance, 
        startLocation
      );
    } else if (shapeType === 'draw' && shapeData) {
      // Process custom drawn shape
      const processedShape = ShapeProcessor.processCustomShape(shapeData);
      routeCoordinates = await RouteGenerator.generateFromShape(
        processedShape, 
        distance, 
        startLocation
      );
    } else {
      return res.status(400).json({ 
        error: 'Invalid shape data',
        message: 'For draw mode, shapeData is required'
      });
    }

    res.json({
      success: true,
      coordinates: routeCoordinates,
      distance: distance,
      shapeType: shapeType,
      totalPoints: routeCoordinates.length
    });
  } catch (error) {
    console.error('Route generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate route',
      message: error.message
    });
  }
});

// Get available shapes for surprise mode
router.get('/shapes', (req, res) => {
  try {
    const shapes = ShapeProcessor.getAvailableShapes();
    res.json({ 
      success: true,
      shapes: shapes,
      count: shapes.length
    });
  } catch (error) {
    console.error('Error getting shapes:', error);
    res.status(500).json({ 
      error: 'Failed to get shapes',
      message: error.message
    });
  }
});

// Get route statistics
router.post('/route-stats', async (req, res) => {
  try {
    const { coordinates } = req.body;
    
    if (!coordinates || !Array.isArray(coordinates)) {
      return res.status(400).json({ 
        error: 'Invalid coordinates',
        message: 'Coordinates array is required'
      });
    }

    const stats = RouteGenerator.calculateRouteStats(coordinates);
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Route stats error:', error);
    res.status(500).json({ 
      error: 'Failed to calculate route stats',
      message: error.message
    });
  }
});

module.exports = router;
