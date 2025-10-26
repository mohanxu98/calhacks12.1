# 🚀 ShapeRun Deployment Guide

This guide covers deploying ShapeRun to various platforms for production use.

## 📱 Mobile App Deployment

### Expo Application Services (EAS)

#### 1. Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

#### 2. Configure EAS
```bash
cd frontend
eas login
eas build:configure
```

#### 3. Build for Production
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Both platforms
eas build --platform all
```

#### 4. Submit to App Stores
```bash
# iOS App Store
eas submit --platform ios

# Google Play Store
eas submit --platform android
```

### Manual Build (Advanced)

#### iOS (Xcode)
1. Open `frontend/ios/ShapeRun.xcworkspace` in Xcode
2. Configure signing and certificates
3. Build and archive
4. Upload to App Store Connect

#### Android (Android Studio)
1. Open `frontend/android` in Android Studio
2. Generate signed APK/AAB
3. Upload to Google Play Console

## 🌐 Backend Deployment

### Heroku Deployment

#### 1. Prepare for Heroku
```bash
cd backend
# Create Procfile
echo "web: node server.js" > Procfile

# Add start script to package.json
npm pkg set scripts.start="node server.js"
```

#### 2. Deploy to Heroku
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login and create app
heroku login
heroku create shaperun-api

# Set environment variables
heroku config:set GOOGLE_MAPS_API_KEY=your_api_key
heroku config:set NODE_ENV=production

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Railway Deployment

#### 1. Connect Repository
1. Go to [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Select the `backend` folder

#### 2. Configure Environment
```env
GOOGLE_MAPS_API_KEY=your_api_key
NODE_ENV=production
PORT=3000
```

### DigitalOcean App Platform

#### 1. Create App
1. Go to DigitalOcean App Platform
2. Create new app from GitHub
3. Select `backend` folder

#### 2. Configure Environment
- Add environment variables in the dashboard
- Set build command: `npm install`
- Set run command: `npm start`

### AWS Deployment

#### Using AWS Elastic Beanstalk

#### 1. Prepare Application
```bash
cd backend
# Create .ebextensions directory
mkdir .ebextensions

# Create environment configuration
cat > .ebextensions/environment.config << EOF
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    GOOGLE_MAPS_API_KEY: your_api_key
EOF
```

#### 2. Deploy
```bash
# Install EB CLI
pip install awsebcli

# Initialize and deploy
eb init
eb create production
eb deploy
```

#### Using AWS Lambda (Serverless)

#### 1. Install Serverless Framework
```bash
npm install -g serverless
npm install serverless-http
```

#### 2. Create serverless.yml
```yaml
service: shaperun-api

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    GOOGLE_MAPS_API_KEY: ${env:GOOGLE_MAPS_API_KEY}

functions:
  api:
    handler: server.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
```

#### 3. Deploy
```bash
serverless deploy
```

## 🗄️ Database Setup

### SQLite (Development)
```bash
# Already configured in backend
# No additional setup required
```

### PostgreSQL (Production)

#### 1. Install Dependencies
```bash
cd backend
npm install pg
```

#### 2. Configure Database
```javascript
// Add to server.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

#### 3. Environment Variables
```env
DATABASE_URL=postgresql://username:password@host:port/database
```

### MongoDB (Alternative)

#### 1. Install Dependencies
```bash
npm install mongoose
```

#### 2. Configure Connection
```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

## 🔒 Security Configuration

### Environment Variables
```env
# Production environment
NODE_ENV=production
GOOGLE_MAPS_API_KEY=your_production_api_key
JWT_SECRET=your_jwt_secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### HTTPS Configuration

#### Using Let's Encrypt (Nginx)
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### CORS Configuration
```javascript
// In server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-app.com',
  credentials: true
}));
```

## 📊 Monitoring and Logging

### Application Monitoring

#### Using PM2
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name shaperun-api

# Monitor
pm2 monit

# Logs
pm2 logs shaperun-api
```

#### Using Winston (Logging)
```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Checks
```javascript
// Add to server.js
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions

#### 1. Create .github/workflows/deploy.yml
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy Backend
      run: |
        cd backend
        npm install
        npm run build
        # Deploy to your platform
    
    - name: Deploy Frontend
      run: |
        cd frontend
        npm install
        npm run build
        # Deploy to your platform
```

### Docker Deployment

#### 1. Create Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 3000

CMD ["node", "server.js"]
```

#### 2. Create docker-compose.yml
```yaml
version: '3.8'
services:
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
      - NODE_ENV=production
```

#### 3. Deploy with Docker
```bash
docker-compose up -d
```

## 📈 Performance Optimization

### Caching
```javascript
// Add Redis caching
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache route generation
app.use('/api/generate-route', async (req, res, next) => {
  const cacheKey = `route:${JSON.stringify(req.body)}`;
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  next();
});
```

### CDN Configuration
```javascript
// Serve static files through CDN
app.use('/static', express.static('public', {
  maxAge: '1y',
  etag: true
}));
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors

#### Environment Variables
- Ensure all required variables are set
- Check variable names and values
- Verify API keys are valid

#### Database Connection
- Check connection strings
- Verify database is accessible
- Check firewall settings

#### API Rate Limits
- Monitor Google Maps API usage
- Implement request caching
- Set up usage alerts

### Debug Commands
```bash
# Check application status
pm2 status

# View logs
pm2 logs shaperun-api

# Restart application
pm2 restart shaperun-api

# Check environment variables
printenv | grep GOOGLE_MAPS
```

## 📞 Support

For deployment issues:
1. Check the logs for specific error messages
2. Verify all environment variables are set correctly
3. Test API endpoints manually
4. Check platform-specific documentation
5. Create an issue in the repository

---

**Happy Deploying! 🚀**
