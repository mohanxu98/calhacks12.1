#!/bin/bash

echo "🌐 Installing web dependencies for ShapeRun..."

cd frontend

echo "📦 Installing new web dependencies..."
npm install react-native-web@~0.19.6 react-dom@18.2.0 expo-web-browser@~12.3.0

echo "🔧 Updating Expo dependencies..."
npx expo install --fix

echo "✅ Web dependencies installed successfully!"
echo ""
echo "🚀 Now you can run ShapeRun on web:"
echo "   npm run web"
echo ""
echo "📱 Or continue with mobile:"
echo "   npm start"
echo ""
echo "🌐 Web features:"
echo "   - Interactive map view"
echo "   - Location services (browser-based)"
echo "   - Touch drawing for custom shapes"
echo "   - Full UI/UX experience"
echo ""
echo "📱 Mobile features (recommended for full GPS):"
echo "   - Real GPS tracking"
echo "   - Google Maps integration"
echo "   - Background location tracking"
