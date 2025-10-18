# 🚀 Quick Start Production Deployment

## 📋 Prerequisites Checklist
- [ ] GitHub repository with your code
- [ ] MongoDB Atlas account
- [ ] Cloudinary account  
- [ ] Render account
- [ ] Vercel account

## ⚡ Quick Deployment Steps

### 1. Database Setup (5 minutes)
1. Create MongoDB Atlas cluster
2. Get connection string
3. Create database user

### 2. Backend Deployment (10 minutes)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Set these settings:
   ```
   Name: peve-backend
   Environment: Node
   Root Directory: backend
   Build Command: npm run build:prod
   Start Command: npm run start:prod
   ```
5. Add environment variables (see DEPLOYMENT_GUIDE.md)
6. Deploy

### 3. Frontend Deployment (5 minutes)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import GitHub repo
3. Set these settings:
   ```
   Framework: Vite
   Root Directory: frontend
   Build Command: npm run build:prod
   ```
4. Add environment variables (see DEPLOYMENT_GUIDE.md)
5. Deploy

### 4. Update URLs (2 minutes)
1. Update backend CORS with Vercel URL
2. Update frontend API URL with Render URL
3. Redeploy both services

## 🔧 Environment Variables

### Backend (Render)
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/peve_prod
JWT_SECRET=your_32_char_secret_here
JWT_REFRESH_SECRET=your_32_char_refresh_secret_here
FRONTEND_URL=https://your-app.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_SOCKET_URL=https://your-backend.onrender.com
```

## 🎯 Success URLs
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Health Check**: `https://your-backend.onrender.com/health`

## 🆘 Need Help?
See the complete [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions, troubleshooting, and security configurations.
