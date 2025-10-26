# 🏃‍♀️ ShapeRun

**ShapeRun** is an interactive running app that generates GPS routes shaped like hidden patterns (hearts, stars, letters, etc.). Runners select a distance goal and optionally draw or randomize a shape. The app then creates a real-world map route that approximates that shape, based on the runner's starting location.

As the runner follows the route in real time, the shape remains hidden — revealed only upon completion. The experience gamifies running through surprise, creativity, and exploration.

## 🎯 Features

### ✅ Core Features
- **Shape Generation**: Both custom drawing and random shapes
- **Real-time GPS Tracking**: Live location updates during runs
- **Route Generation**: Converts shapes to real-world GPS routes using Google Maps API
- **Progress Tracking**: Distance, time, and pace monitoring
- **Shape Reveal**: Post-run visualization of the completed shape
- **Modern UI**: Clean, intuitive interface with React Native

### 🎨 Available Shapes
- ❤️ Heart
- ⭐ Star
- ⭕ Circle
- 🔺 Triangle
- ⬜ Square
- ♾️ Infinity
- 🌀 Spiral
- ✏️ Custom (user-drawn)

## 🏗️ Architecture

### Frontend (React Native + Expo)
- **HomeScreen**: Landing page with distance input and shape selection
- **ShapeDrawer**: Custom shape drawing interface with SVG
- **RunningScreen**: Live running interface with Google Maps
- **CompletionScreen**: Post-run stats and shape reveal

### Backend (Node.js + Express)
- **Route Generation**: Google Maps Directions API integration
- **Shape Processing**: Mathematical shape generation and processing
- **API Endpoints**: RESTful API for route generation and shape management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Google Maps API key

### 1. Clone and Install
```bash
git clone <repository-url>
cd calhacks12.1
npm run install-all
```

### 2. Google Maps API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Directions API
   - Geocoding API
4. Create credentials (API Key)
5. Copy the API key

### 3. Configure Environment
```bash
# Copy the example environment file
cp backend/env.example backend/.env

# Edit backend/.env and add your Google Maps API key
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 4. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run start-backend  # Backend on port 3000
npm run start-frontend # Frontend on port 19006
```

### 5. Run on Device
```bash
# Install Expo Go app on your phone
# Scan the QR code from the terminal
# Or run on simulator:
npm run ios     # iOS Simulator
npm run android # Android Emulator
```

## 📱 Usage

### 1. Start a Run
- Open the app and select "Start a Run"
- Enter your desired distance (0.5-50 km)
- Choose "🎨 Draw My Shape" or "🎲 Surprise Me"

### 2. Draw Your Shape (Optional)
- Use your finger to sketch a shape on the canvas
- Tap "Clear" to start over
- Tap "🏃‍♀️ Start Run" when satisfied

### 3. Follow the Route
- The app shows your current location and the route
- Follow the path to complete your shape
- Track your progress with real-time stats

### 4. Complete and Reveal
- Tap "🏁 Finish" when you reach the end
- See the shape you created revealed on the map
- View your running statistics

## 🔧 API Endpoints

### Backend API (Port 3000)

#### `POST /api/generate-route`
Generate a route based on shape and distance.

**Request Body:**
```json
{
  "distance": 5.0,
  "shapeType": "heart",
  "startLocation": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "shapeData": { /* for custom shapes */ }
}
```

**Response:**
```json
{
  "success": true,
  "coordinates": [
    { "latitude": 37.7749, "longitude": -122.4194 },
    { "latitude": 37.7750, "longitude": -122.4195 }
  ],
  "distance": 5.0,
  "shapeType": "heart",
  "totalPoints": 20
}
```

#### `GET /api/shapes`
Get available shapes for surprise mode.

**Response:**
```json
{
  "success": true,
  "shapes": ["heart", "star", "circle", "triangle", "square"],
  "count": 5
}
```

#### `GET /health`
Health check endpoint.

## 🛠️ Development

### Project Structure
```
ShapeRun/
├── frontend/                 # React Native Expo app
│   ├── App.js               # Main app component
│   ├── components/          # React components
│   │   ├── HomeScreen.js
│   │   ├── ShapeDrawer.js
│   │   ├── RunningScreen.js
│   │   └── CompletionScreen.js
│   ├── services/            # API services
│   │   ├── LocationService.js
│   │   └── RouteService.js
│   └── utils/               # Utility functions
│       └── ShapeGenerator.js
├── backend/                 # Node.js API
│   ├── server.js            # Express server
│   ├── routes/              # API routes
│   │   └── routes.js
│   └── services/            # Business logic
│       ├── RouteGenerator.js
│       └── ShapeProcessor.js
└── README.md
```

### Key Technologies
- **Frontend**: React Native, Expo, Google Maps, SVG
- **Backend**: Node.js, Express, Google Maps API
- **Maps**: Google Maps JavaScript API, Directions API
- **Location**: Expo Location API, GPS tracking

## 🔮 Future Enhancements

### Planned Features
- **Social Features**: Share runs with friends, leaderboards
- **Wearable Integration**: Apple Watch, Garmin support
- **Route Safety**: Validate routes for safety (sidewalks, traffic)
- **Offline Support**: Cache routes for offline running
- **Advanced Shapes**: More complex geometric patterns
- **Achievement System**: Unlock shapes by completing runs
- **Route History**: Save and replay previous runs
- **Weather Integration**: Weather-aware route suggestions

### Technical Improvements
- **Database**: SQLite/PostgreSQL for user data
- **Authentication**: User accounts and profiles
- **Push Notifications**: Run reminders and achievements
- **Analytics**: Running statistics and insights
- **Performance**: Route optimization and caching

## 🐛 Troubleshooting

### Common Issues

#### Google Maps Not Loading
- Ensure your API key is correctly set in `backend/.env`
- Check that the required APIs are enabled in Google Cloud Console
- Verify the API key has proper restrictions

#### Location Permission Denied
- Grant location permissions in your device settings
- Ensure the app has "When In Use" location access
- Try restarting the app after granting permissions

#### Route Generation Fails
- Check your internet connection
- Verify the backend server is running on port 3000
- Check the console for error messages

#### Expo App Won't Load
- Ensure you have the latest Expo CLI
- Try clearing the Expo cache: `expo r -c`
- Check that your phone and computer are on the same network

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@shaperun.app or create an issue in the repository.

---

**Built with ❤️ for CalHacks 12.1**
