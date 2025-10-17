import { Request, Response } from 'express';
import { User } from '../models/User';

export async function completeProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const { avatarStyle, profileComplete } = req.body;
    
    // Validate avatar style
    const validStyles = ['botttsNeutral', 'pixelArtNeutral', 'identicon', 'avataaars', 'personas'];
    if (avatarStyle && !validStyles.includes(avatarStyle)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid avatar style' 
      });
    }

    // Update user with profile completion data
    const updateData: any = {};
    if (avatarStyle) updateData.avatarStyle = avatarStyle;
    if (profileComplete !== undefined) updateData.profileComplete = profileComplete;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-passwordHash' }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    return res.json({
      success: true,
      data: {
        user: updatedUser,
        message: 'Profile completed successfully'
      }
    });

  } catch (error: any) {
    console.error('Profile completion error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
