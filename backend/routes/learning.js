const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Mock learning content data (in a real app, this would come from a database)
const learningContent = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React including components, state, and props',
    category: 'Web Development',
    difficulty: 'Beginner',
    duration: '4 hours',
    rating: 4.8,
    students: 1250,
    image: '/images/react-fundamentals.jpg',
    instructor: 'John Doe',
    price: 0,
    tags: ['React', 'JavaScript', 'Frontend'],
    lessons: [
      { id: '1', title: 'Introduction to React', duration: '30 min', completed: false },
      { id: '2', title: 'Components and JSX', duration: '45 min', completed: false },
      { id: '3', title: 'State and Props', duration: '60 min', completed: false },
      { id: '4', title: 'Event Handling', duration: '40 min', completed: false }
    ]
  },
  {
    id: '2',
    title: 'Node.js Backend Development',
    description: 'Build robust backend applications with Node.js and Express',
    category: 'Backend Development',
    difficulty: 'Intermediate',
    duration: '8 hours',
    rating: 4.6,
    students: 890,
    image: '/images/nodejs-backend.jpg',
    instructor: 'Jane Smith',
    price: 49.99,
    tags: ['Node.js', 'Express', 'Backend', 'API'],
    lessons: [
      { id: '1', title: 'Setting up Node.js', duration: '25 min', completed: false },
      { id: '2', title: 'Express Framework', duration: '50 min', completed: false },
      { id: '3', title: 'Database Integration', duration: '70 min', completed: false },
      { id: '4', title: 'Authentication', duration: '60 min', completed: false }
    ]
  },
  {
    id: '3',
    title: 'UI/UX Design Principles',
    description: 'Master the fundamentals of user interface and user experience design',
    category: 'Design',
    difficulty: 'Beginner',
    duration: '6 hours',
    rating: 4.7,
    students: 2100,
    image: '/images/ui-ux-design.jpg',
    instructor: 'Alex Johnson',
    price: 0,
    tags: ['Design', 'UI', 'UX', 'Figma'],
    lessons: [
      { id: '1', title: 'Design Thinking', duration: '40 min', completed: false },
      { id: '2', title: 'Color Theory', duration: '35 min', completed: false },
      { id: '3', title: 'Typography', duration: '45 min', completed: false },
      { id: '4', title: 'Prototyping', duration: '55 min', completed: false }
    ]
  }
];

// @route   GET /api/learning/courses
// @desc    Get all learning courses
// @access  Public
router.get('/courses', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      category,
      difficulty,
      price,
      page = 1,
      limit = 20,
      sort = 'rating',
      order = 'desc'
    } = req.query;

    let filteredCourses = [...learningContent];

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (category) {
      filteredCourses = filteredCourses.filter(course => course.category === category);
    }

    // Filter by difficulty
    if (difficulty) {
      filteredCourses = filteredCourses.filter(course => course.difficulty === difficulty);
    }

    // Filter by price
    if (price === 'free') {
      filteredCourses = filteredCourses.filter(course => course.price === 0);
    } else if (price === 'paid') {
      filteredCourses = filteredCourses.filter(course => course.price > 0);
    }

    // Sort courses
    filteredCourses.sort((a, b) => {
      const aValue = a[sort];
      const bValue = b[sort];
      
      if (order === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    // Pagination
    const skip = (page - 1) * limit;
    const paginatedCourses = filteredCourses.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: {
        courses: paginatedCourses,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(filteredCourses.length / limit),
          total: filteredCourses.length,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses'
    });
  }
});

// @route   GET /api/learning/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/courses/:id', optionalAuth, async (req, res) => {
  try {
    const course = learningContent.find(c => c.id === req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: { course }
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course'
    });
  }
});

// @route   GET /api/learning/categories
// @desc    Get learning categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { name: 'Web Development', count: 45, icon: '🌐' },
      { name: 'Mobile Development', count: 32, icon: '📱' },
      { name: 'Backend Development', count: 28, icon: '⚙️' },
      { name: 'Design', count: 38, icon: '🎨' },
      { name: 'Data Science', count: 25, icon: '📊' },
      { name: 'AI/ML', count: 18, icon: '🤖' },
      { name: 'DevOps', count: 22, icon: '🔧' },
      { name: 'Cybersecurity', count: 15, icon: '🔒' }
    ];

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// @route   GET /api/learning/my/progress
// @desc    Get user's learning progress
// @access  Private
router.get('/my/progress', authenticateToken, async (req, res) => {
  try {
    // Mock progress data (in a real app, this would come from database)
    const progress = {
      totalCourses: 3,
      completedCourses: 1,
      inProgressCourses: 2,
      totalHours: 12,
      completedHours: 4,
      certificates: 1,
      streak: 7,
      courses: [
        {
          courseId: '1',
          title: 'React Fundamentals',
          progress: 75,
          completedLessons: 3,
          totalLessons: 4,
          lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          courseId: '2',
          title: 'Node.js Backend Development',
          progress: 25,
          completedLessons: 1,
          totalLessons: 4,
          lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ]
    };

    res.json({
      success: true,
      data: { progress }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch learning progress'
    });
  }
});

// @route   POST /api/learning/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/courses/:id/enroll', authenticateToken, async (req, res) => {
  try {
    const course = learningContent.find(c => c.id === req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // In a real app, you would:
    // 1. Check if user is already enrolled
    // 2. Handle payment if course is paid
    // 3. Create enrollment record in database
    // 4. Send confirmation email

    res.json({
      success: true,
      message: 'Successfully enrolled in course',
      data: { courseId: course.id }
    });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course'
    });
  }
});

// @route   PUT /api/learning/courses/:id/lessons/:lessonId/complete
// @desc    Mark lesson as completed
// @access  Private
router.put('/courses/:id/lessons/:lessonId/complete', authenticateToken, async (req, res) => {
  try {
    const course = learningContent.find(c => c.id === req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const lesson = course.lessons.find(l => l.id === req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // In a real app, you would update the user's progress in the database
    lesson.completed = true;

    res.json({
      success: true,
      message: 'Lesson marked as completed',
      data: { lesson }
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark lesson as completed'
    });
  }
});

// @route   GET /api/learning/recommendations
// @desc    Get personalized learning recommendations
// @access  Private
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    // Mock AI-powered recommendations based on user's skills and interests
    const recommendations = [
      {
        id: '4',
        title: 'Advanced React Patterns',
        description: 'Learn advanced React patterns and best practices',
        reason: 'Based on your React skills',
        difficulty: 'Intermediate',
        duration: '6 hours',
        rating: 4.9,
        price: 0
      },
      {
        id: '5',
        title: 'TypeScript for React Developers',
        description: 'Add type safety to your React applications',
        reason: 'Complements your React knowledge',
        difficulty: 'Intermediate',
        duration: '5 hours',
        rating: 4.7,
        price: 29.99
      }
    ];

    res.json({
      success: true,
      data: { recommendations }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations'
    });
  }
});

// @route   GET /api/learning/trending
// @desc    Get trending learning content
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const trending = learningContent
      .sort((a, b) => b.students - a.students)
      .slice(0, 6);

    res.json({
      success: true,
      data: { courses: trending }
    });
  } catch (error) {
    console.error('Get trending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending content'
    });
  }
});

module.exports = router;
