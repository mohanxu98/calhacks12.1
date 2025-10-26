#!/bin/bash

echo "🔧 Fixing ShapeRun web errors..."

cd frontend

echo "📦 Installing missing dependencies..."
npm install react-native-reanimated@~3.3.0

echo "🧹 Clearing caches..."
rm -rf node_modules/.cache
npx expo r -c

echo "✅ Errors fixed!"
echo ""
echo "🚀 Now try running:"
echo "   npm run web"
echo ""
echo "📱 Or for mobile:"
echo "   npm start"
