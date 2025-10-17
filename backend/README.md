# Peve Backend

A comprehensive Node.js backend for the Peve developer collaboration platform, built with TypeScript, Express, MongoDB, and Socket.io.

## Features

- **Authentication**: JWT-based auth with refresh tokens, GitHub OAuth support
- **Real-time**: Socket.io for live updates on join requests and responses
- **File Uploads**: Cloudinary integration for image handling
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful endpoints with comprehensive validation
- **Testing**: Jest test suite with coverage
- **Security**: Helmet, CORS, rate limiting, input validation

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Real-time**: Socket.io
- **Authentication**: JWT + bcrypt
- **File Storage**: Cloudinary
- **Validation**: Joi
- **Testing**: Jest + Supertest
- **Containerization**: Docker

## Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

3. **Required environment variables:**
   ```env
   NODE_ENV=development
   PORT=4000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/peve
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   FRONTEND_URL=http://localhost:5173
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Seed sample data (optional):**
   ```bash
   npm run seed
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/check-username/:username` - Check username availability

### Ideas
- `GET /api/ideas` - List ideas (with pagination, filters)
- `POST /api/ideas` - Create idea
- `GET /api/ideas/:id` - Get idea details
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `POST /api/ideas/:id/join` - Request to join idea
- `POST /api/ideas/:id/respond` - Respond to join request

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/fork` - Fork project

### Comments
- `GET /api/comments/:parentType/:parentId` - Get comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read

### Uploads
- `POST /api/uploads/image` - Upload image to Cloudinary

### Search
- `GET /api/search` - Search users, ideas, projects

## Database Models

### User
- Profile information, skills, interests
- Authentication data, reputation system
- Settings and preferences

### Idea
- Title, description, tags, status
- Author, collaborators, join requests
- Engagement metrics (likes, views, comments)

### Project
- Project details, tech stack, URLs
- Health score, metrics, documentation
- Forking and collaboration features

### Comment
- Threaded comments for ideas and projects
- Rich text support, attachments

### Badge
- Achievement system with criteria
- Visual badges for user profiles

### Notification
- Real-time notifications for various events
- Read/unread status tracking

## Real-time Features

Socket.io events:
- `joinIdea` - Join idea discussion room
- `leaveIdea` - Leave idea discussion room
- Real-time notifications for join requests/responses

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- compatibility.test.ts
```

## Docker Deployment

### Build and run locally:
```bash
docker build -t peve-backend .
docker run -p 4000:4000 --env-file .env peve-backend
```

### Deploy to production:
1. Set up MongoDB Atlas cluster
2. Configure Cloudinary account
3. Set environment variables
4. Deploy to your preferred platform (Render, Railway, etc.)

## Development

### Project Structure
```
backend/
├── src/
│   ├── config/          # Environment configuration
│   ├── controllers/     # Route handlers
│   ├── middlewares/     # Custom middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── services/        # Business logic
│   ├── sockets/         # Socket.io handlers
│   └── utils/           # Utility functions
├── tests/               # Test files
├── scripts/             # Utility scripts
└── Dockerfile          # Container configuration
```

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run seed` - Seed database with sample data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.
