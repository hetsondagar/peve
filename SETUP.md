# Peve - Complete Setup Guide

A comprehensive professional networking platform built with React, Node.js, and MongoDB.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**
- **MongoDB** (v5.0 or higher)
- **Git**
- **Docker** (optional, for containerized deployment)

### Installation Links:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Docker](https://www.docker.com/get-started)

## 📁 Project Structure

```
peve/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utility functions
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
├── backend/                 # Node.js backend API
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── scripts/            # Database scripts
│   ├── uploads/            # File uploads
│   ├── package.json        # Backend dependencies
│   └── server.js           # Main server file
├── README.md               # Project overview
└── SETUP.md               # This setup guide
```

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd peve
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Frontend Dependencies
The frontend uses the following key technologies:
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Lucide React** - Icon library

### 4. Frontend Configuration
The frontend is already configured with:
- TypeScript support
- TailwindCSS with custom design system
- ESLint for code quality
- Vite for fast development and building

## 🚀 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Backend Dependencies
The backend uses the following key technologies:
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Socket.IO** - Real-time communication
- **Multer** - File uploads
- **Bcrypt** - Password hashing

## 🗄️ Database Setup

### Option 1: Local MongoDB Installation

1. **Install MongoDB Community Edition**
   - Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB Service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS (using Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Verify Installation**
   ```bash
   mongosh
   ```

### Option 2: Docker MongoDB

1. **Run MongoDB Container**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **Verify Container**
   ```bash
   docker ps
   ```

### Option 3: MongoDB Atlas (Cloud)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account

2. **Create Cluster**
   - Create a new cluster
   - Choose your preferred region
   - Get connection string

## ⚙️ Environment Configuration

### 1. Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/peve
MONGODB_TEST_URI=mongodb://localhost:27017/peve_test

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_here_change_in_production
JWT_REFRESH_EXPIRE=30d

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@peve.com

# Frontend URL
FRONTEND_URL=http://localhost:3002

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# AI Configuration (optional)
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Frontend Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000

# App Configuration
VITE_APP_NAME=Peve
VITE_APP_VERSION=1.0.0
```

## 🏃‍♂️ Running the Application

### 1. Start the Backend Server

```bash
cd backend

# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend will start on `http://localhost:5000`

### 2. Start the Frontend Development Server

```bash
# From the root directory
npm run dev
```

The frontend will start on `http://localhost:3002`

### 3. Seed the Database (Optional)

```bash
cd backend
npm run seed
```

This will create sample data including:
- 3 sample users
- 2 sample projects
- 4 achievements
- 2 events

**Sample Login Credentials:**
- Email: `john.doe@example.com`, Password: `password123`
- Email: `jane.smith@example.com`, Password: `password123`
- Email: `mike.johnson@example.com`, Password: `password123`

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
# From root directory
npm test
```

## 🚀 Deployment

### Option 1: Docker Deployment

1. **Build and Run with Docker Compose**
   ```bash
   cd backend
   docker-compose up -d
   ```

2. **Build Frontend for Production**
   ```bash
   npm run build
   ```

### Option 2: Manual Deployment

1. **Build Frontend**
   ```bash
   npm run build
   ```

2. **Start Backend in Production**
   ```bash
   cd backend
   NODE_ENV=production npm start
   ```

### Option 3: Cloud Deployment

#### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

#### Backend (Railway/Heroku/DigitalOcean)
1. Connect your GitHub repository
2. Set environment variables
3. Set start command: `npm start`
4. Deploy

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Ensure MongoDB is running
- Check if port 27017 is available
- Verify connection string in `.env`

#### 2. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env file
PORT=5001
```

#### 3. Frontend Build Errors
```
Error: Cannot resolve module
```

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. CORS Issues
```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3002' has been blocked by CORS policy
```

**Solution:**
- Check `FRONTEND_URL` in backend `.env`
- Ensure backend CORS is configured correctly

#### 5. File Upload Issues
```
Error: File too large
```

**Solution:**
- Check `MAX_FILE_SIZE` in backend `.env`
- Ensure uploads directory exists and is writable

### Debug Mode

#### Backend Debug
```bash
cd backend
DEBUG=* npm run dev
```

#### Frontend Debug
```bash
# Add to .env
VITE_DEBUG=true
```

### Logs

#### Backend Logs
```bash
cd backend
tail -f logs/app.log
```

#### MongoDB Logs
```bash
# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/)

### API Documentation
Once the backend is running, visit:
- `http://localhost:5000/health` - Health check
- `http://localhost:5000/api` - API endpoints

### Support
- Check the [GitHub Issues](https://github.com/your-repo/issues)
- Review the [README.md](README.md) for project overview

## 🎯 Next Steps

1. **Customize the Application**
   - Update branding and colors
   - Modify user interface components
   - Add new features

2. **Configure Production Environment**
   - Set up production database
   - Configure email service
   - Set up file storage (Cloudinary/AWS S3)

3. **Add Advanced Features**
   - Real-time notifications
   - Advanced search
   - Analytics dashboard
   - Mobile app

4. **Deploy to Production**
   - Choose hosting platform
   - Set up CI/CD pipeline
   - Configure monitoring

---

## 🎉 Congratulations!

You now have a fully functional professional networking platform running locally. The application includes:

- ✅ User authentication and profiles
- ✅ Project management and collaboration
- ✅ Real-time messaging
- ✅ Event management
- ✅ Learning hub
- ✅ AI-powered insights
- ✅ Achievement system
- ✅ File uploads
- ✅ Responsive design

Happy coding! 🚀
