# 🗺️ Google Maps API Setup Guide

This guide will help you set up Google Maps API for ShapeRun to enable route generation and mapping features.

## 📋 Prerequisites

- Google account
- Google Cloud Console access
- Credit card (for billing, though free tier is available)

## 🚀 Step-by-Step Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `ShapeRun` (or any name you prefer)
4. Click "Create"

### 2. Enable Required APIs

Navigate to "APIs & Services" → "Library" and enable these APIs:

#### Essential APIs:
- **Maps JavaScript API** - For displaying maps in the app
- **Directions API** - For generating running routes
- **Geocoding API** - For address/coordinate conversion

#### Optional APIs (for future features):
- **Places API** - For finding nearby landmarks
- **Elevation API** - For elevation data
- **Roads API** - For road information

### 3. Create API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. **Important**: Click "Restrict Key" to secure it

### 4. Configure API Key Restrictions

#### Application Restrictions:
- **Android apps**: Add your app's package name and SHA-1 fingerprint
- **iOS apps**: Add your app's bundle identifier
- **HTTP referrers**: For web development

#### API Restrictions:
- Select "Restrict key"
- Choose "Maps JavaScript API", "Directions API", and "Geocoding API"

### 5. Set Up Billing

1. Go to "Billing" in the Google Cloud Console
2. Link a payment method (required even for free tier)
3. **Don't worry**: Google provides $200 free credit monthly

## 💰 Pricing Information

### Free Tier Limits (Monthly):
- **Maps JavaScript API**: 28,000 map loads
- **Directions API**: 2,500 requests
- **Geocoding API**: 40,000 requests

### Beyond Free Tier:
- Maps JavaScript API: $7 per 1,000 loads
- Directions API: $5 per 1,000 requests
- Geocoding API: $5 per 1,000 requests

*For ShapeRun usage, you'll likely stay within free limits for development and testing.*

## 🔧 Configuration

### 1. Add API Key to Backend

Create `backend/.env` file:
```bash
cp backend/env.example backend/.env
```

Edit `backend/.env`:
```env
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
PORT=3000
NODE_ENV=development
```

### 2. Test API Key

Test your API key by visiting:
```
http://localhost:3000/health
```

You should see:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### 3. Test Route Generation

Make a test request to your backend:
```bash
curl -X POST http://localhost:3000/api/generate-route \
  -H "Content-Type: application/json" \
  -d '{
    "distance": 5.0,
    "shapeType": "heart",
    "startLocation": {
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  }'
```

## 🛡️ Security Best Practices

### 1. API Key Restrictions
- Always restrict your API key to specific APIs
- Use application restrictions (Android/iOS bundle IDs)
- Set up HTTP referrer restrictions for web

### 2. Environment Variables
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Use different keys for development/production

### 3. Monitoring
- Set up billing alerts in Google Cloud Console
- Monitor API usage regularly
- Set up usage quotas to prevent unexpected charges

## 🐛 Troubleshooting

### Common Issues:

#### "This API project is not authorized"
- Ensure the required APIs are enabled
- Check that your API key has the correct restrictions

#### "API key not valid"
- Verify the API key is correctly set in your `.env` file
- Check that the key is not restricted to wrong applications

#### "Quota exceeded"
- Check your usage in Google Cloud Console
- Consider upgrading your billing plan
- Implement request caching to reduce API calls

#### "Request denied"
- Verify your API key restrictions
- Check that the required APIs are enabled
- Ensure your billing account is active

### Debug Steps:

1. **Check API Status**: Visit Google Cloud Console → APIs & Services → Dashboard
2. **Verify Quotas**: Check your current usage and limits
3. **Test API Key**: Use Google's API testing tools
4. **Check Logs**: Review your application logs for specific error messages

## 📊 Monitoring Usage

### Google Cloud Console:
1. Go to "APIs & Services" → "Dashboard"
2. View API usage charts
3. Set up alerts for quota usage

### Useful Metrics:
- **Maps JavaScript API**: Map loads per day
- **Directions API**: Route requests per day
- **Geocoding API**: Address lookups per day

## 🔄 Production Considerations

### For Production Deployment:

1. **Separate API Keys**: Use different keys for development/production
2. **Enhanced Security**: Implement server-side API key management
3. **Caching**: Cache frequently requested routes
4. **Rate Limiting**: Implement client-side rate limiting
5. **Monitoring**: Set up comprehensive usage monitoring

### Cost Optimization:

1. **Route Caching**: Cache generated routes for similar requests
2. **Batch Requests**: Combine multiple API calls when possible
3. **Smart Caching**: Implement intelligent caching strategies
4. **Usage Analytics**: Monitor and optimize API usage patterns

## 📞 Support

### Google Cloud Support:
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Maps API Documentation](https://developers.google.com/maps/documentation)
- [Google Cloud Support](https://cloud.google.com/support)

### ShapeRun Support:
- Check the main README.md for troubleshooting
- Create an issue in the repository
- Contact the development team

---

**Need Help?** If you encounter any issues with Google Maps API setup, please refer to the [Google Maps API Documentation](https://developers.google.com/maps/documentation) or create an issue in the ShapeRun repository.
