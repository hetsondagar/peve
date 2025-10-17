import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

export async function signup(req: Request, res: Response) {
  const { username, name, email, password, college, role, skills } = req.body;
  if (!username || !name || !email || !password) return res.status(400).json({ success: false, error: 'Missing fields' });
  
  // Validate username format
  if (username.length < 3) return res.status(400).json({ success: false, error: 'Username must be at least 3 characters long' });
  if (username.length > 20) return res.status(400).json({ success: false, error: 'Username cannot exceed 20 characters' });
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return res.status(400).json({ success: false, error: 'Username can only contain letters, numbers, and underscores' });
  
  // Check for existing email
  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) return res.status(409).json({ success: false, error: 'Email already in use' });
  
  // Check for existing username
  const existingUsername = await User.findOne({ username: String(username).toLowerCase() });
  if (existingUsername) return res.status(409).json({ success: false, error: 'Username already taken' });
  
  try {
    const user = await User.create({ username: String(username).toLowerCase(), name, email: email.toLowerCase(), passwordHash: password, college, role, skills }) as IUser;
    const token = signAccessToken({ sub: String(user._id) });
    const refreshToken = signRefreshToken({ sub: String(user._id) });
    return res.json({ success: true, data: { token, refreshToken, user } });
  } catch (error: any) {
    // Handle MongoDB unique constraint errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'username') return res.status(409).json({ success: false, error: 'Username already taken' });
      if (field === 'email') return res.status(409).json({ success: false, error: 'Email already in use' });
    }
    return res.status(500).json({ success: false, error: 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  const { emailOrUsername, password } = req.body;
  
  if (!emailOrUsername || !password) {
    return res.status(400).json({ success: false, error: 'Email/username and password are required' });
  }
  
  // Check if input is email or username
  const isEmail = emailOrUsername.includes('@');
  const query = isEmail 
    ? { email: emailOrUsername.toLowerCase() }
    : { username: emailOrUsername.toLowerCase() };
  
  try {
    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash || '');
    if (!isValidPassword) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    
    const token = signAccessToken({ sub: String(user._id) });
    const refreshToken = signRefreshToken({ sub: String(user._id) });
    
    return res.json({ success: true, data: { token, refreshToken, user } });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Login failed' });
  }
}

export async function logout(req: Request, res: Response) {
  // In a stateless JWT system, logout is handled client-side by removing the token
  // You could implement a token blacklist here if needed
  return res.json({ success: true, message: 'Logged out successfully' });
}

export async function me(req: Request, res: Response) {
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

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ success: false, error: 'Refresh token required' });
  
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.sub);
    if (!user) return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    
    const newToken = signAccessToken({ sub: String(user._id) });
    const newRefreshToken = signRefreshToken({ sub: String(user._id) });
    
    return res.json({ success: true, data: { token: newToken, refreshToken: newRefreshToken } });
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid refresh token' });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const { username, name, currentPassword, newPassword, githubUsername, discordUsername, linkedinUrl, avatarStyle } = req.body;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const updates: any = {};

    // Handle username update
    if (username && username !== user.username) {
      // Validate username format
      if (username.length < 3) {
        return res.status(400).json({ success: false, error: 'Username must be at least 3 characters long' });
      }
      if (username.length > 20) {
        return res.status(400).json({ success: false, error: 'Username cannot exceed 20 characters' });
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ success: false, error: 'Username can only contain letters, numbers, and underscores' });
      }

      // Check for existing username
      const existingUsername = await User.findOne({ 
        username: username.toLowerCase(),
        _id: { $ne: userId }
      });
      if (existingUsername) {
        return res.status(409).json({ success: false, error: 'Username already taken' });
      }

      updates.username = username.toLowerCase();
    }

    // Handle name update
    if (name && name !== user.name) {
      // Validate name format
      if (name.length < 2) {
        return res.status(400).json({ success: false, error: 'Name must be at least 2 characters long' });
      }
      if (name.length > 50) {
        return res.status(400).json({ success: false, error: 'Name cannot exceed 50 characters' });
      }
      if (!/^[a-zA-Z\s]+$/.test(name)) {
        return res.status(400).json({ success: false, error: 'Name can only contain letters and spaces' });
      }

      updates.name = name;
    }

    // Handle password update
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, error: 'Current password is required to change password' });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash || '');
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ success: false, error: 'Current password is incorrect' });
      }

      // Validate new password
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long' });
      }

      // Hash new password
      const saltRounds = 12;
      updates.passwordHash = await bcrypt.hash(newPassword, saltRounds);
    }

    // Handle GitHub username update
    if (githubUsername !== undefined) {
      updates.githubUsername = githubUsername;
    }

    // Handle Discord username update
    if (discordUsername !== undefined) {
      // Basic Discord username validation
      if (discordUsername && !/^[a-zA-Z0-9_.]+$/.test(discordUsername)) {
        return res.status(400).json({ success: false, error: 'Invalid Discord username format' });
      }
      updates.discordUsername = discordUsername;
    }

    // Handle LinkedIn URL update
    if (linkedinUrl !== undefined) {
      // Basic LinkedIn URL validation
      if (linkedinUrl && !linkedinUrl.match(/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/)) {
        return res.status(400).json({ success: false, error: 'Invalid LinkedIn URL format' });
      }
      updates.linkedinUrl = linkedinUrl;
    }

    // Handle avatar style update
    if (avatarStyle !== undefined) {
      // Validate avatar style
      const validStyles = ['botttsNeutral', 'pixelArtNeutral', 'identicon', 'avataaars', 'personas'];
      if (avatarStyle && !validStyles.includes(avatarStyle)) {
        return res.status(400).json({ success: false, error: 'Invalid avatar style' });
      }
      updates.avatarStyle = avatarStyle;
    }

    // Update user if there are changes
    if (Object.keys(updates).length > 0) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updates,
        { new: true, select: '-passwordHash' }
      );

      return res.json({
        success: true,
        data: {
          user: updatedUser,
          message: 'Profile updated successfully'
        }
      });
    }

    return res.json({
      success: true,
      data: {
        user,
        message: 'No changes made'
      }
    });

  } catch (error: any) {
    console.error('Profile update error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

export async function completeOnboarding(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const { githubUsername, discordUsername, linkedinUrl } = req.body;
    
    // Validate required fields
    if (!githubUsername || !linkedinUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'GitHub username and LinkedIn URL are required' 
      });
    }

    // Validate Discord username format if provided
    if (discordUsername && !/^[a-zA-Z0-9_.]+$/.test(discordUsername)) {
      return res.status(400).json({ success: false, error: 'Invalid Discord username format' });
    }

    // Validate LinkedIn URL format
    if (!linkedinUrl.match(/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/)) {
      return res.status(400).json({ success: false, error: 'Invalid LinkedIn URL format' });
    }

    // Update user with onboarding data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        githubUsername,
        discordUsername,
        linkedinUrl,
        onboardingCompleted: true
      },
      { new: true, select: '-passwordHash' }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.json({
      success: true,
      data: {
        user: updatedUser,
        message: 'Onboarding completed successfully'
      }
    });

  } catch (error: any) {
    console.error('Onboarding completion error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
