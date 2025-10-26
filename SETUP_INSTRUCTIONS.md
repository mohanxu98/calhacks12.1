# 🚀 ShapeRun Quick Setup Instructions

Follow these steps to get ShapeRun running on your machine in under 10 minutes!

## ⚡ Quick Start (5 minutes)

### 1. Install Dependencies
```bash
# Install all dependencies for both frontend and backend
npm run install-all
```

### 2. Set Up Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - Maps JavaScript API
   - Directions API
   - Geocoding API
4. Create an API key
5. Copy the API key

### 3. Configure Environment
```bash
# Copy the example environment file
cp backend/env.example backend/.env

# Edit backend/.env and add your Google Maps API key
# Replace 'your_google_maps_api_key_here' with your actual API key
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 4. Start the App
```bash
# Start both frontend and backend servers
npm run dev
```

### 5. Run on Your Phone
1. Install **Expo Go** app from App Store/Google Play
2. Scan the QR code from the terminal
3. Start running! 🏃‍♀️

## 📱 What You'll See

1. **Home Screen**: Enter distance and choose "Draw My Shape" or "Surprise Me"
2. **Shape Drawer** (if drawing): Sketch your custom shape
3. **Running Screen**: Follow the GPS route while the shape stays hidden
4. **Completion Screen**: See the shape you created revealed!

## 🎯 Test the App

### Quick Test Route
- Set distance to **2 km** for a quick test
- Choose "🎲 Surprise Me" for a random shape
- Follow the route and see your shape revealed!

### Custom Shape Test
- Choose "🎨 Draw My Shape"
- Draw a simple heart or star
- Start your run and follow your custom route

## 🐛 Troubleshooting

### If the app won't start:
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm run install-all
```

### If Google Maps isn't working:
1. Check your API key in `backend/.env`
2. Verify the APIs are enabled in Google Cloud Console
3. Check the backend logs for error messages

### If location isn't working:
1. Grant location permissions in your phone settings
2. Make sure you're outside (GPS works better outdoors)
3. Try restarting the app

## 🎉 You're Ready!

Your ShapeRun app is now ready to use! Try creating different shapes and see how they look when you run them.

### Next Steps:
- Read the full [README.md](README.md) for detailed documentation
- Check [GOOGLE_MAPS_SETUP.md](GOOGLE_MAPS_SETUP.md) for advanced Google Maps configuration
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

---

**Happy Running! 🏃‍♀️✨**
