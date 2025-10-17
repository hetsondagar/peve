# Peve - Developer Collaboration Platform

**Your peers, your hive** 🐝

Peve is a modern developer collaboration platform that connects developers, facilitates idea sharing, and enables project collaboration in a vibrant community environment.

## 🚀 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with email/username login
- **Idea Board**: Share and discover innovative project ideas
- **Project Showcase**: Display your completed projects with detailed 
information
- **Collaboration System**: Join projects, request collaborations, and work together
- **Real-time Chat**: Socket.io powered collaboration rooms
- **Leaderboard**: Track top contributors and achievements
- **DevCards**: Generate beautiful portfolio cards
- **Search & Discovery**: Find projects, ideas, and developers

### Technical Features
- **Modern Stack**: React + TypeScript + Node.js + MongoDB
- **Real-time Updates**: Socket.io for live collaboration
- **Image Uploads**: Cloudinary integration for media handling
- **Responsive Design**: Mobile-first approach with dark mode
- **API-First**: RESTful APIs with comprehensive documentation

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Query** for data fetching
- **Radix UI** for accessible components

### Backend
- **Node.js** with TypeScript
- **Express.js** for REST API
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time features
- **JWT** for authentication
- **Cloudinary** for image uploads
- **Jest** for testing

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd peve
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `backend` directory:
```env
# Environment Configuration
NODE_ENV=development
PORT=4000

# Database
MONGO_URI=mongodb://localhost:27017/peve
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/peve

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-here-make-this-very-long-and-secure
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-make-this-very-long-and-secure
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=30d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup
```bash
# Start MongoDB (if using local)
mongod

# Seed the database with sample data
npm run seed
```

### 5. Start Backend Server
```bash
npm run dev
```

The backend will be available at `http://localhost:4000`

### 6. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🗄️ Database Models

### User
- Profile information (username, email, bio, skills)
- Authentication data
- Statistics and achievements
- Social features (followers, following)

### Idea
- Project ideas with descriptions
- Collaboration requests
- Tags and categorization
- Status tracking

### Project
- Completed projects showcase
- Technology stack
- Collaboration history
- Metrics and analytics

### Collaboration
- Project collaboration requests
- Role assignments
- Status tracking

### Chat & Real-time Features
- Collaboration room messages
- Real-time notifications
- Live updates

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Ideas
- `GET /api/ideas` - List all ideas
- `POST /api/ideas` - Create new idea
- `GET /api/ideas/:id` - Get idea details
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `POST /api/ideas/:id/join` - Request to join idea
- `POST /api/ideas/:id/respond` - Respond to join request

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Users
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/projects` - Get user's projects
- `GET /api/users/:id/ideas` - Get user's ideas

### Search
- `GET /api/search` - Global search across ideas, projects, and users

### Uploads
- `POST /api/uploads/image` - Upload images to Cloudinary

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🐳 Docker Deployment

### Backend Docker
```bash
cd backend
docker build -t peve-backend .
docker run -p 4000:4000 --env-file .env peve-backend
```

### Frontend Docker
```bash
cd frontend
docker build -t peve-frontend .
docker run -p 5173:5173 peve-frontend
```

## 🚀 Production Deployment

### Backend (Railway/Heroku/Vercel)
1. Set environment variables in your hosting platform
2. Connect your MongoDB Atlas database
3. Deploy the backend
4. Update `FRONTEND_URL` in environment variables

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables for API URL

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/peve
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://your-frontend-domain.com
```

## 📱 Sample Data

The seed script creates sample data including:
- 3 test users with different roles and skills
- 4 innovative project ideas
- 3 completed projects
- 4 achievement badges

### Test User Credentials
- **Email**: alex@example.com, **Password**: password123
- **Email**: sarah@example.com, **Password**: password123
- **Email**: mike@example.com, **Password**: password123

## 🔧 Development

### Project Structure
```
peve/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # Express routes
│   │   ├── services/       # Business logic
│   │   ├── sockets/        # Socket.io handlers
│   │   └── utils/          # Utility functions
│   ├── scripts/            # Database seeding
│   └── tests/              # Test files
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and API
│   │   └── hooks/          # Custom React hooks
│   └── public/             # Static assets
└── README.md
```

### Adding New Features
1. Create models in `backend/src/models/`
2. Add controllers in `backend/src/controllers/`
3. Define routes in `backend/src/routes/`
4. Create frontend components in `frontend/src/components/`
5. Add API integration in `frontend/src/lib/api.ts`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🎯 Roadmap

- [ ] Advanced search filters
- [ ] Project templates
- [ ] Integration with GitHub
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Team management features
- [ ] Code review tools
- [ ] Project deployment automation

---

**Built with ❤️ by the Peve team**