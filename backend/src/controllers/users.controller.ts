import { Request, Response } from 'express';
import { User, IUser } from '../models/User';

export async function getCurrentUser(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
  
  try {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
}

export async function updateProfile(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
  
  const { skills, bio, college, role, interests, githubUsername, linkedinUrl, portfolioUrl } = req.body;
  
  try {
    const updateData: any = {};
    if (skills !== undefined) updateData.skills = skills;
    if (bio !== undefined) updateData.bio = bio;
    if (college !== undefined) updateData.college = college;
    if (role !== undefined) updateData.role = role;
    if (interests !== undefined) updateData.interests = interests;
    if (githubUsername !== undefined) updateData.githubUsername = githubUsername;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
    if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl;
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    
    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
}

export async function getUserById(req: Request, res: Response) {
  const { userId } = req.params;
  
  try {
    // Try to find by ObjectId first, then by username
    let user = await User.findById(userId).select('-passwordHash -email');
    
    if (!user) {
      // If not found by ObjectId, try to find by username
      user = await User.findOne({ username: userId }).select('-passwordHash -email');
    }
    
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    
    return res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
}

export async function searchUsers(req: Request, res: Response) {
  const { q, skills, page = 1, limit = 20 } = req.query;
  
  try {
    const query: any = {};
    
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : [skills];
      query.skills = { $in: skillArray };
    }
    
    const users = await User.find(query)
      .select('-passwordHash -email')
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    return res.json({
      success: true,
      data: {
        items: users,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to search users' });
  }
}

export async function validateUsernames(req: Request, res: Response) {
  try {
    const { usernames } = req.body;
    
    if (!Array.isArray(usernames)) {
      return res.status(400).json({ success: false, error: 'Usernames must be an array' });
    }
    
    // Check which usernames exist
    const existingUsers = await User.find({
      username: { $in: usernames.map((u: string) => u.toLowerCase()) }
    }).select('username');
    
    const existingUsernames = existingUsers.map(user => user.username);
    const validUsernames = usernames.filter((username: string) => 
      existingUsernames.includes(username.toLowerCase())
    );
    const invalidUsernames = usernames.filter((username: string) => 
      !existingUsernames.includes(username.toLowerCase())
    );
    
    return res.json({
      success: true,
      data: {
        validUsernames: validUsernames,
        invalidUsernames: invalidUsernames,
        existing: existingUsernames
      }
    });
  } catch (error) {
    console.error('Username validation error:', error);
    return res.status(500).json({ success: false, error: 'Failed to validate usernames' });
  }
}

export async function testUserModel(req: Request, res: Response) {
  try {
    console.log('Testing User model...');
    const userCount = await User.countDocuments();
    console.log('User count:', userCount);
    
    return res.json({
      success: true,
      data: {
        userCount,
        modelAvailable: !!User,
        message: 'User model is working'
      }
    });
  } catch (error: any) {
    console.error('User model test error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'User model test failed',
      details: error.message
    });
  }
}

export async function searchUsernames(req: Request, res: Response) {
  try {
    console.log('=== SEARCH USERNAMES CALLED ===');
    console.log('Request method:', req.method);
    console.log('Request query:', req.query);
    console.log('Request params:', req.params);
    
    const { q, limit = 10 } = req.query;
    const query = q as string;
    
    console.log('Extracted query:', query, 'limit:', limit);
    
    if (!query || query.length < 2) {
      console.log('Query too short, returning empty array');
      return res.json({
        success: true,
        data: {
          usernames: [],
          total: 0
        }
      });
    }
    
    // Check if User model is available
    if (!User) {
      console.error('User model is not available');
      return res.status(500).json({ success: false, error: 'User model not available' });
    }
    console.log('User model is available');
    
    // Check database connection
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState;
    console.log('Database ready state:', dbState);
    if (dbState !== 1) {
      console.error('Database not connected. Ready state:', dbState);
      return res.status(500).json({ success: false, error: 'Database not connected' });
    }
    console.log('Database is connected');
    
    // Search for usernames that start with the query
    console.log('Searching for usernames matching:', query);
    const users = await User.find({
      username: { $regex: `^${query}`, $options: 'i' }
    })
    .select('username name')
    .limit(Number(limit))
    .sort({ username: 1 })
    .lean(); // Use lean() for better performance
    
    console.log('Found users:', users.length);
    console.log('Users:', users);
    
    const usernames = users.map(user => ({
      username: user.username,
      name: user.name,
      displayName: user.name ? `${user.name} (@${user.username})` : `@${user.username}`
    }));
    
    const response = {
      success: true,
      data: {
        usernames,
        total: usernames.length,
        query: query
      }
    };
    
    console.log('Returning response:', JSON.stringify(response));
    return res.json(response);
  } catch (error: any) {
    console.error('=== USERNAME SEARCH ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to search usernames',
      details: error.message || 'Unknown error'
    });
  }
}
