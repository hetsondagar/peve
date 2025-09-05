const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
const Project = require('../models/Project');
const Event = require('../models/Event');
const router = express.Router();

// @route   GET /api/ai/insights
// @desc    Get AI insights for user
// @access  Private
router.get('/insights', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Mock AI insights (in a real app, this would use actual AI/ML models)
    const insights = {
      skillsGrowth: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Technical Skills',
            data: [65, 70, 75, 80, 85, 88],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)'
          },
          {
            label: 'Soft Skills',
            data: [60, 65, 70, 72, 75, 78],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)'
          }
        ]
      },
      engagementTrends: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Profile Views',
            data: [12, 19, 15, 25],
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)'
          },
          {
            label: 'Messages Sent',
            data: [8, 12, 10, 18],
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245, 158, 11, 0.1)'
          }
        ]
      },
      recommendations: [
        {
          type: 'skill_boost',
          title: 'Boost Your React Skills',
          description: 'Based on your profile, consider learning React Hooks and Context API',
          priority: 'high',
          estimatedTime: '2 weeks',
          resources: [
            { title: 'React Hooks Tutorial', url: '#', type: 'tutorial' },
            { title: 'Context API Guide', url: '#', type: 'guide' }
          ]
        },
        {
          type: 'project_join',
          title: 'Join "E-commerce Platform" Project',
          description: 'This project matches your skills and could help you grow',
          priority: 'medium',
          projectId: '507f1f77bcf86cd799439011',
          matchScore: 85
        },
        {
          type: 'connection',
          title: 'Connect with Sarah Chen',
          description: 'Similar interests and complementary skills',
          priority: 'low',
          userId: '507f1f77bcf86cd799439012',
          matchScore: 78
        }
      ],
      skillAnalysis: {
        strengths: ['JavaScript', 'React', 'Node.js'],
        improvements: ['TypeScript', 'Docker', 'Testing'],
        marketDemand: {
          'JavaScript': 95,
          'React': 88,
          'Node.js': 82,
          'TypeScript': 75,
          'Docker': 70
        }
      }
    };

    res.json({
      success: true,
      data: { insights }
    });
  } catch (error) {
    console.error('Get AI insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch AI insights'
    });
  }
});

// @route   GET /api/ai/recommendations/users
// @desc    Get AI-powered user recommendations
// @access  Private
router.get('/recommendations/users', authenticateToken, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const user = await User.findById(req.user._id);

    // Mock AI recommendations (in a real app, this would use ML algorithms)
    const recommendations = await User.find({
      _id: { $ne: user._id },
      isActive: true
    })
    .select('firstName lastName avatar title company skills bio stats')
    .limit(parseInt(limit));

    // Add match scores and reasons (mock data)
    const recommendationsWithScores = recommendations.map(rec => ({
      ...rec.toObject(),
      matchScore: Math.floor(Math.random() * 30) + 70, // 70-100
      reason: [
        'Similar skills',
        'Same industry',
        'Complementary expertise',
        'Active in same projects'
      ][Math.floor(Math.random() * 4)]
    }));

    res.json({
      success: true,
      data: { recommendations: recommendationsWithScores }
    });
  } catch (error) {
    console.error('Get user recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user recommendations'
    });
  }
});

// @route   GET /api/ai/recommendations/projects
// @desc    Get AI-powered project recommendations
// @access  Private
router.get('/recommendations/projects', authenticateToken, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const user = await User.findById(req.user._id);

    // Get projects that match user's skills
    const userSkills = user.skills.map(skill => skill.name);
    
    const recommendations = await Project.find({
      isPublic: true,
      status: { $in: ['Planning', 'In Progress'] },
      'requiredSkills.name': { $in: userSkills },
      'members.user': { $ne: user._id } // Not already a member
    })
    .populate('owner', 'firstName lastName avatar title company')
    .populate('members.user', 'firstName lastName avatar')
    .limit(parseInt(limit));

    // Add match scores (mock data)
    const recommendationsWithScores = recommendations.map(project => ({
      ...project.toObject(),
      matchScore: Math.floor(Math.random() * 25) + 75, // 75-100
      reason: [
        'Matches your skills',
        'Similar to your interests',
        'Good learning opportunity',
        'Active community'
      ][Math.floor(Math.random() * 4)]
    }));

    res.json({
      success: true,
      data: { recommendations: recommendationsWithScores }
    });
  } catch (error) {
    console.error('Get project recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project recommendations'
    });
  }
});

// @route   GET /api/ai/recommendations/events
// @desc    Get AI-powered event recommendations
// @access  Private
router.get('/recommendations/events', authenticateToken, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const user = await User.findById(req.user._id);

    // Get upcoming events that match user's interests
    const recommendations = await Event.find({
      isPublic: true,
      status: 'Published',
      startDate: { $gte: new Date() },
      'attendees.user': { $ne: user._id } // Not already registered
    })
    .populate('organizer', 'name logo')
    .sort({ startDate: 1 })
    .limit(parseInt(limit));

    // Add match scores (mock data)
    const recommendationsWithScores = recommendations.map(event => ({
      ...event.toObject(),
      matchScore: Math.floor(Math.random() * 20) + 80, // 80-100
      reason: [
        'Matches your skills',
        'Networking opportunity',
        'Learning focus',
        'Industry relevant'
      ][Math.floor(Math.random() * 4)]
    }));

    res.json({
      success: true,
      data: { recommendations: recommendationsWithScores }
    });
  } catch (error) {
    console.error('Get event recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event recommendations'
    });
  }
});

// @route   POST /api/ai/chat
// @desc    Chat with AI assistant
// @access  Private
router.post('/chat', authenticateToken, [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message is required and must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { message } = req.body;
    const user = await User.findById(req.user._id);

    // Mock AI response (in a real app, this would use OpenAI API or similar)
    const responses = [
      "Based on your profile, I'd recommend focusing on TypeScript to enhance your JavaScript skills.",
      "I notice you're interested in React. Have you considered learning Next.js for full-stack development?",
      "Your project portfolio looks great! Consider adding more backend projects to showcase your full-stack abilities.",
      "I can help you find projects that match your skills. What type of project are you looking for?",
      "Based on your learning progress, you're doing well with frontend development. Ready to explore backend technologies?"
    ];

    const aiResponse = {
      message: responses[Math.floor(Math.random() * responses.length)],
      suggestions: [
        { text: "Show me React projects", action: "search_projects", params: { technology: "React" } },
        { text: "Find learning resources", action: "learning", params: {} },
        { text: "Connect with developers", action: "explore_users", params: {} }
      ],
      timestamp: new Date()
    };

    res.json({
      success: true,
      data: { response: aiResponse }
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process AI chat request'
    });
  }
});

// @route   GET /api/ai/skill-analysis
// @desc    Get AI-powered skill analysis
// @access  Private
router.get('/skill-analysis', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Mock skill analysis (in a real app, this would analyze user's skills against market data)
    const analysis = {
      currentSkills: user.skills,
      marketAnalysis: {
        'JavaScript': { demand: 95, salary: 85000, growth: 12 },
        'React': { demand: 88, salary: 90000, growth: 15 },
        'Node.js': { demand: 82, salary: 88000, growth: 10 },
        'TypeScript': { demand: 75, salary: 95000, growth: 20 },
        'Python': { demand: 90, salary: 92000, growth: 18 }
      },
      recommendations: [
        {
          skill: 'TypeScript',
          reason: 'High demand and salary potential',
          difficulty: 'Medium',
          timeToLearn: '2-3 months'
        },
        {
          skill: 'Docker',
          reason: 'Essential for modern development',
          difficulty: 'Medium',
          timeToLearn: '1-2 months'
        }
      ],
      careerPaths: [
        {
          title: 'Full-Stack Developer',
          match: 85,
          requiredSkills: ['JavaScript', 'React', 'Node.js', 'Database'],
          missingSkills: ['TypeScript', 'Docker']
        },
        {
          title: 'Frontend Specialist',
          match: 92,
          requiredSkills: ['JavaScript', 'React', 'CSS', 'HTML'],
          missingSkills: ['TypeScript', 'Testing']
        }
      ]
    };

    res.json({
      success: true,
      data: { analysis }
    });
  } catch (error) {
    console.error('Get skill analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skill analysis'
    });
  }
});

// @route   GET /api/ai/trends
// @desc    Get AI-powered industry trends
// @access  Public
router.get('/trends', async (req, res) => {
  try {
    // Mock industry trends (in a real app, this would analyze real market data)
    const trends = {
      technologies: [
        { name: 'AI/ML', growth: 25, demand: 90, salary: 120000 },
        { name: 'Blockchain', growth: 20, demand: 75, salary: 110000 },
        { name: 'Cloud Computing', growth: 18, demand: 85, salary: 95000 },
        { name: 'Cybersecurity', growth: 15, demand: 80, salary: 100000 }
      ],
      skills: [
        { name: 'Python', trend: 'up', change: 15 },
        { name: 'TypeScript', trend: 'up', change: 20 },
        { name: 'Docker', trend: 'up', change: 12 },
        { name: 'Kubernetes', trend: 'up', change: 18 }
      ],
      insights: [
        'AI and Machine Learning skills are in high demand',
        'Full-stack developers with cloud experience earn 20% more',
        'Remote work is increasing demand for collaboration tools',
        'Cybersecurity skills are becoming essential for all developers'
      ]
    };

    res.json({
      success: true,
      data: { trends }
    });
  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch industry trends'
    });
  }
});

module.exports = router;
