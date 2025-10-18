# 🚀 Peve Production Deployment Guide

This guide will help you deploy the Peve application to production using Render (Backend) and Vercel (Frontend).

## 📋 Prerequisites

- GitHub repository with your code
- MongoDB Atlas account (for production database)
- Cloudinary account (for image uploads)
- Render account (for backend hosting)
- Vercel account (for frontend hosting)

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (M0 Sandbox is free)
3. Create a database user with read/write permissions
4. Whitelist all IP addresses (0.0.0.0/0) for production
5. Get your connection string

### 2. Database Connection String Format
```
mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

## ☁️ Backend Deployment (Render)

### 1. Prepare Backend for Production

1. **Set up environment variables** (copy from `backend/production.env.template`):
   ```bash
   # Copy the template
   cp backend/production.env.template backend/.env.production
   
   # Edit with your production values
   nano backend/.env.production
   ```

2. **Required Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=4000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/peve_prod
   JWT_SECRET=your_super_strong_jwt_secret_here_minimum_32_characters
   JWT_REFRESH_SECRET=your_super_strong_refresh_secret_here_minimum_32_characters
   JWT_EXPIRES_IN=15m
   REFRESH_TOKEN_EXPIRES_IN=7d
   FRONTEND_URL=https://your-app-name.vercel.app
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CORS_ORIGINS=https://your-app-name.vercel.app
   ```

### 2. Deploy to Render


1. **Connect GitHub Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Web Service**:
   ```
   Name: peve-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Build Command: npm run build:prod
   Start Command: npm run start:prod
   Health Check Path: /health
   ```

3. **Set Environment Variables**:
   - Add all environment variables from your `.env.production` file
   - Make sure to use strong, unique secrets for JWT

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://peve-backend.onrender.com`)

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Frontend for Production

1. **Set up environment variables** (copy from `frontend/production.env.template`):
   ```bash
   # Copy the template
   cp frontend/production.env.template frontend/.env.production
   
   # Edit with your production values
   nano frontend/.env.production
   ```

2. **Required Environment Variables**:
   ```env
   VITE_API_URL=https://your-backend-app.onrender.com
   VITE_APP_NAME=peve
   VITE_APP_VERSION=1.0.0
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_SOCKET_URL=https://your-backend-app.onrender.com
   ```

### 2. Deploy to Vercel

1. **Connect GitHub Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build:prod
   Output Directory: dist
   Install Command: npm ci
   ```

3. **Set Environment Variables**:
   - Add all environment variables from your `.env.production` file
   - Make sure `VITE_API_URL` points to your Render backend URL

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your frontend URL (e.g., `https://peve-app.vercel.app`)

## 🔧 Post-Deployment Configuration

### 1. Update Backend CORS Settings
After getting your Vercel frontend URL, update your Render backend environment variables:
```
FRONTEND_URL=https://your-actual-vercel-url.vercel.app
CORS_ORIGINS=https://your-actual-vercel-url.vercel.app
```

### 2. Update Frontend API URL
Update your Vercel environment variables:
```
VITE_API_URL=https://your-actual-render-url.onrender.com
VITE_SOCKET_URL=https://your-actual-render-url.onrender.com
```

### 3. Redeploy Both Services
- Trigger a new deployment on Render (restart the service)
- Trigger a new deployment on Vercel (push a commit or redeploy)

## 🔐 Security Checklist

### Backend Security
- [ ] Strong JWT secrets (32+ characters)
- [ ] Environment variables properly set
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled
- [ ] Helmet security headers enabled
- [ ] MongoDB connection secured

### Frontend Security
- [ ] Environment variables properly set
- [ ] No sensitive data in client-side code
- [ ] HTTPS enabled
- [ ] Security headers configured

## 📊 Monitoring & Maintenance

### 1. Health Checks
- Backend health endpoint: `https://your-backend.onrender.com/health`
- Monitor uptime and performance

### 2. Logs
- **Render**: Check logs in the Render dashboard
- **Vercel**: Check function logs in Vercel dashboard

### 3. Database Monitoring
- Monitor MongoDB Atlas for performance and usage
- Set up alerts for high usage or errors

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `FRONTEND_URL` and `CORS_ORIGINS` are correctly set
   - Check that URLs match exactly (including https/http)

2. **Database Connection Issues**:
   - Verify MongoDB connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

3. **Environment Variable Issues**:
   - Double-check all environment variables are set
   - Ensure no typos in variable names
   - Restart services after changing environment variables

4. **Build Failures**:
   - Check build logs for specific errors
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

5. **Memory Issues (JavaScript heap out of memory)**:
   - The application is optimized for Render's free tier
   - Memory usage is monitored and logged every 30 seconds
   - Routes are lazy-loaded to reduce startup memory
   - If issues persist, consider upgrading to a paid Render plan

### Debug Commands

```bash
# Test backend health
curl https://your-backend.onrender.com/health

# Test API endpoint
curl https://your-backend.onrender.com/api/auth/me

# Check frontend build locally
cd frontend
npm run build:prod
npm run preview:prod
```

## 📈 Performance Optimization

### Backend (Render)
- Use Render's paid plans for better performance
- Enable auto-scaling if needed
- Monitor memory and CPU usage

### Frontend (Vercel)
- Enable Vercel Analytics
- Use Vercel's Edge Network
- Optimize images and assets

### Database (MongoDB Atlas)
- Use appropriate cluster size
- Enable connection pooling
- Monitor query performance

## 🔄 CI/CD Pipeline

### Automatic Deployments
- **Render**: Automatically deploys on git push to main branch
- **Vercel**: Automatically deploys on git push to main branch

### Manual Deployments
```bash
# Backend
# Push to main branch triggers Render deployment

# Frontend
# Push to main branch triggers Vercel deployment
```

## 📞 Support

If you encounter issues:
1. Check the logs in Render/Vercel dashboards
2. Verify environment variables
3. Test endpoints manually
4. Check MongoDB Atlas connection
5. Review this guide for missed steps

## 🎉 Success!

Once deployed, your Peve application will be available at:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend API**: `https://your-backend-app.onrender.com`
- **Health Check**: `https://your-backend-app.onrender.com/health`

Remember to update your domain settings if you're using a custom domain!
