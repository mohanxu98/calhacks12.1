#!/bin/bash

echo "🔧 Fixing ShapeRun web setup..."

cd frontend

echo "📦 Installing web dependencies..."
npm install react-native-web@~0.19.6 react-dom@18.2.0 expo-web-browser@~12.3.0

echo "🔧 Fixing Expo dependencies..."
npx expo install --fix

echo "🧹 Clearing caches..."
npx expo r -c

echo "✅ Web setup fixed!"
echo ""
echo "🚀 Now try running:"
echo "   npm run web"
echo ""
echo "📱 Or for mobile:"
echo "   npm start"
