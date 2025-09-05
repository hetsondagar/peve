# Peve Backend API

A comprehensive Node.js backend API for the Peve professional networking platform, built with Express.js, MongoDB, and Socket.IO.

## Features

- **Authentication & Authorization**: JWT-based authentication with refresh tokens
- **User Management**: Complete user profiles with skills, preferences, and stats
- **Project Management**: Create, join, and collaborate on projects
- **Real-time Messaging**: WebSocket-based chat with typing indicators and reactions
- **Achievement System**: Gamified achievements with automatic and manual earning
- **Event Management**: Create and manage professional events and workshops
- **Learning Hub**: Course management and progress tracking
- **AI Insights**: Personalized recommendations and analytics
- **File Upload**: Avatar, project images, and message attachments
- **Notifications**: Real-time notifications with email and push support
- **Feedback System**: User feedback and FAQ management

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Environment**: dotenv

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/peve
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=your_refresh_token_secret_here
   JWT_REFRESH_EXPIRE=30d
   FRONTEND_URL=http://localhost:3002
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users` - Get all users (with search/filters)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/skills` - Update user skills
- `PUT /api/users/:id/preferences` - Update user preferences
- `GET /api/users/:id/projects` - Get user's projects
- `POST /api/users/:id/connect` - Send connection request

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `POST /api/projects/:id/apply` - Apply to join project
- `POST /api/projects/:id/like` - Like/unlike project
- `POST /api/projects/:id/members/:userId` - Add member
- `DELETE /api/projects/:id/members/:userId` - Remove member

### Messages
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/:userId` - Get messages with user
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark message as read
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message
- `POST /api/messages/:id/reaction` - Add reaction
- `DELETE /api/messages/:id/reaction` - Remove reaction

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/:id` - Get achievement by ID
- `GET /api/achievements/user/:userId` - Get user's achievements
- `GET /api/achievements/my/earned` - Get current user's achievements
- `GET /api/achievements/my/available` - Get available achievements
- `POST /api/achievements/:id/earn` - Manually earn achievement

### Events
- `GET /api/events` - Get all events
- `GET /api/events/featured` - Get featured events
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/register` - Cancel registration

### Learning
- `GET /api/learning/courses` - Get all courses
- `GET /api/learning/courses/:id` - Get course by ID
- `GET /api/learning/categories` - Get course categories
- `GET /api/learning/my/progress` - Get learning progress
- `POST /api/learning/courses/:id/enroll` - Enroll in course
- `PUT /api/learning/courses/:id/lessons/:lessonId/complete` - Complete lesson
- `GET /api/learning/recommendations` - Get personalized recommendations

### AI
- `GET /api/ai/insights` - Get AI insights
- `GET /api/ai/recommendations/users` - Get user recommendations
- `GET /api/ai/recommendations/projects` - Get project recommendations
- `GET /api/ai/recommendations/events` - Get event recommendations
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/skill-analysis` - Get skill analysis
- `GET /api/ai/trends` - Get industry trends

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread/count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `PUT /api/notifications/:id/archive` - Archive notification
- `GET /api/notifications/settings` - Get notification settings
- `PUT /api/notifications/settings` - Update notification settings

### File Upload
- `POST /api/upload/avatar` - Upload user avatar
- `POST /api/upload/project-images` - Upload project images
- `POST /api/upload/message-attachments` - Upload message attachments
- `DELETE /api/upload/:type/:filename` - Delete uploaded file
- `GET /api/upload/:type/:filename` - Serve uploaded files

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/faq` - Get FAQ
- `GET /api/feedback/faq/categories` - Get FAQ categories
- `GET /api/feedback/my` - Get user's feedback
- `GET /api/feedback/:id` - Get feedback by ID
- `PUT /api/feedback/:id` - Update feedback
- `POST /api/feedback/search` - Search help content

## Database Models

### User
- Personal information (name, email, bio, location)
- Professional details (title, company, experience)
- Skills array with levels and categories
- Preferences and privacy settings
- Statistics (connections, projects, achievements)
- AI profile for personalization

### Project
- Basic info (title, description, category)
- Team management (owner, members, applications)
- Collaboration settings and requirements
- Media (images, demo URL, GitHub)
- Engagement (likes, views, applications)
- AI insights and recommendations

### Message
- Sender and recipient references
- Content and type (text, image, file)
- Status (read, edited, deleted)
- Reactions and replies
- Project context for project-related messages

### Achievement
- Name, description, and icon
- Category and rarity levels
- Requirements (automatic/manual)
- Points and visual properties
- Statistics (total earned, last earned)

### Event
- Event details (title, description, type)
- Schedule and location information
- Organizer information
- Registration and capacity management
- Attendee management and feedback
- AI insights and recommendations

### Notification
- User and notification type
- Title, message, and priority
- Related entities (user, project, event)
- Delivery settings (email, push, in-app)
- Status (read, archived) and metadata

## Real-time Features

The API includes WebSocket support for:
- Real-time messaging with typing indicators
- Live notifications
- Project updates
- User presence

## Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Helmet for security headers
- Input validation and sanitization
- File upload restrictions

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run seed` - Seed database with sample data

### Environment Variables
See `env.example` for all required environment variables.

### Database Seeding
Run `npm run seed` to populate the database with sample data for development.

## Deployment

### Docker
```bash
# Build image
docker build -t peve-backend .

# Run container
docker run -p 5000:5000 --env-file .env peve-backend
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secrets
4. Configure email service
5. Set up file storage (Cloudinary or local)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
