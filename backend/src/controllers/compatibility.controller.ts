import { Request, Response } from 'express';
import { User } from '../models/User';
import { computeCompatibility } from '../services/compatibility';

// Skill taxonomy with synonyms
const SKILL_TAXONOMY = {
  'javascript': ['js', 'ecmascript'],
  'typescript': ['ts'],
  'python': ['py'],
  'java': ['jvm'],
  'react': ['reactjs', 'react.js'],
  'node.js': ['nodejs', 'node'],
  'express': ['expressjs', 'express.js'],
  'mongodb': ['mongo'],
  'postgresql': ['postgres', 'pg'],
  'mysql': ['sql'],
  'docker': ['containerization'],
  'kubernetes': ['k8s'],
  'aws': ['amazon web services'],
  'azure': ['microsoft azure'],
  'gcp': ['google cloud', 'google cloud platform'],
  'git': ['version control'],
  'github': ['git hub'],
  'gitlab': ['git lab'],
  'html': ['html5'],
  'css': ['css3'],
  'sass': ['scss'],
  'tailwind': ['tailwindcss', 'tailwind css'],
  'bootstrap': ['bs'],
  'vue': ['vuejs', 'vue.js'],
  'angular': ['angularjs', 'angular.js'],
  'next.js': ['nextjs', 'next'],
  'nuxt': ['nuxtjs', 'nuxt.js'],
  'graphql': ['gql'],
  'rest': ['rest api', 'restful'],
  'redux': ['reduxjs'],
  'mobx': ['mobxjs'],
  'jest': ['testing'],
  'cypress': ['e2e testing'],
  'webpack': ['bundler'],
  'vite': ['build tool'],
  'eslint': ['linting'],
  'prettier': ['code formatting'],
  'figma': ['design'],
  'sketch': ['ui design'],
  'photoshop': ['ps'],
  'illustrator': ['ai'],
  'machine learning': ['ml', 'ai'],
  'artificial intelligence': ['ai'],
  'data science': ['analytics'],
  'blockchain': ['web3', 'crypto'],
  'solidity': ['smart contracts'],
  'rust': ['rustlang'],
  'go': ['golang'],
  'c++': ['cpp'],
  'c#': ['csharp', 'dotnet'],
  'php': ['php7', 'php8'],
  'ruby': ['ruby on rails', 'rails'],
  'swift': ['ios'],
  'kotlin': ['android'],
  'flutter': ['dart'],
  'react native': ['rn'],
  'ionic': ['hybrid'],
  'electron': ['desktop'],
  'unity': ['game development'],
  'unreal': ['unreal engine'],
  'blender': ['3d modeling'],
  'maya': ['3d animation'],
  'after effects': ['ae'],
  'premiere': ['video editing'],
  'final cut': ['fcp'],
  'linux': ['ubuntu', 'centos', 'debian'],
  'windows': ['win'],
  'macos': ['mac', 'osx'],
  'nginx': ['web server'],
  'apache': ['httpd'],
  'redis': ['cache'],
  'elasticsearch': ['elastic', 'es'],
  'kafka': ['streaming'],
  'rabbitmq': ['message queue'],
  'terraform': ['iac'],
  'ansible': ['automation'],
  'jenkins': ['ci/cd'],
  'github actions': ['gh actions'],
  'gitlab ci': ['gitlab pipeline'],
  'circleci': ['ci'],
  'travis': ['travis ci'],
  'firebase': ['google firebase'],
  'supabase': ['open source firebase'],
  'vercel': ['deployment'],
  'netlify': ['static hosting'],
  'heroku': ['paas'],
  'digital ocean': ['do', 'droplet'],
  'linode': ['vps'],
  'vultr': ['cloud hosting']
};

// Normalize skill names
function normalizeSkill(skill: string): string {
  const lowerSkill = skill.toLowerCase().trim();
  
  // Check if it's already a canonical skill
  if ((SKILL_TAXONOMY as any)[lowerSkill]) {
    return lowerSkill;
  }
  
  // Check synonyms
  for (const [canonical, synonyms] of Object.entries(SKILL_TAXONOMY)) {
    if (synonyms.includes(lowerSkill)) {
      return canonical;
    }
  }
  
  // Return as-is if no mapping found
  return lowerSkill;
}

// Normalize skills array
function normalizeSkills(skills: string[]): string[] {
  return skills.map(normalizeSkill).filter((skill, index, arr) => arr.indexOf(skill) === index);
}

// Get user compatibility profile
export async function getCompatibilityProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const user = await User.findById(userId).select('compatibilitySetupComplete compatibilityProfile');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    return res.json({
      success: true,
      data: {
        compatibilitySetupComplete: user.compatibilitySetupComplete,
        compatibilityProfile: user.compatibilityProfile
      }
    });
  } catch (error) {
    console.error('Get compatibility profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch compatibility profile' });
  }
}

// Create or update compatibility profile
export async function setupCompatibilityProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const {
      skills,
      preferredRoles,
      availabilityHours,
      timeZone,
      preferredWorkHours,
      interests,
      goals,
      workStyle
    } = req.body;

    // Validate required fields
    if (!skills || skills.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one skill is required' });
    }
    if (!preferredRoles || preferredRoles.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one preferred role is required' });
    }
    if (!timeZone) {
      return res.status(400).json({ success: false, error: 'Time zone is required' });
    }

    // Normalize skills
    const normalizedSkills = normalizeSkills(skills);

    // Prepare compatibility profile
    const compatibilityProfile = {
      skills: normalizedSkills,
      preferredRoles,
      availabilityHours: availabilityHours || 0,
      timeZone,
      preferredWorkHours: preferredWorkHours || 'flexible',
      interests: interests || [],
      goals: goals || [],
      workStyle: {
        teamPreference: workStyle?.teamPreference || 'collaborative',
        pace: workStyle?.pace || 'structured',
        communication: workStyle?.communication || 'asynchronous',
        decisionStyle: workStyle?.decisionStyle || 'consensus'
      },
      lastUpdatedAt: new Date()
    };

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      {
        compatibilityProfile,
        compatibilitySetupComplete: true
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    return res.json({
      success: true,
      data: {
        compatibilitySetupComplete: user.compatibilitySetupComplete,
        compatibilityProfile: user.compatibilityProfile
      }
    });
  } catch (error) {
    console.error('Setup compatibility profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to setup compatibility profile' });
  }
}

// Update compatibility profile (partial update)
export async function updateCompatibilityProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const updateData = req.body;

    // Normalize skills if provided
    if (updateData.skills) {
      updateData.skills = normalizeSkills(updateData.skills);
    }

    // Add lastUpdatedAt
    updateData.lastUpdatedAt = new Date();

    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          'compatibilityProfile': updateData 
        } 
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    return res.json({
      success: true,
      data: {
        compatibilitySetupComplete: user.compatibilitySetupComplete,
        compatibilityProfile: user.compatibilityProfile
      }
    });
  } catch (error) {
    console.error('Update compatibility profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to update compatibility profile' });
  }
}

// Check compatibility between two users
export async function checkCompatibility(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { targetUserId, ideaId } = req.body;

    if (!userId || !targetUserId) {
      return res.status(400).json({ success: false, error: 'User IDs are required' });
    }

    // Get both users' compatibility profiles
    const [userA, userB] = await Promise.all([
      User.findById(userId).select('compatibilityProfile'),
      User.findById(targetUserId).select('compatibilityProfile')
    ]);

    if (!userA || !userB) {
      return res.status(404).json({ success: false, error: 'One or both users not found' });
    }

    if (!userA.compatibilityProfile || !userB.compatibilityProfile) {
      return res.status(400).json({ success: false, error: 'One or both users have incomplete compatibility profiles' });
    }

    // Calculate compatibility score
    const compatibility = computeCompatibility(
      userA.compatibilityProfile,
      userB.compatibilityProfile
    );

    // Log compatibility check (optional analytics)
    // TODO: Implement compatibilityLogs collection if needed

    return res.json({
      success: true,
      data: {
        compatibility,
        ideaId: ideaId || null
      }
    });
  } catch (error) {
    console.error('Check compatibility error:', error);
    res.status(500).json({ success: false, error: 'Failed to check compatibility' });
  }
}

// Get skill suggestions
export async function getSkillSuggestions(req: Request, res: Response) {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.json({
        success: true,
        data: { suggestions: Object.keys(SKILL_TAXONOMY).slice(0, 20) }
      });
    }

    const searchTerm = query.toLowerCase();
    const suggestions = Object.keys(SKILL_TAXONOMY)
      .filter(skill => skill.includes(searchTerm))
      .slice(0, 10);

    return res.json({
      success: true,
      data: { suggestions }
    });
  } catch (error) {
    console.error('Get skill suggestions error:', error);
    res.status(500).json({ success: false, error: 'Failed to get skill suggestions' });
  }
}

// Get available options for form fields
export async function getCompatibilityOptions(req: Request, res: Response) {
  try {
    const options = {
      preferredRoles: [
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'UI/UX Designer',
        'Mobile Developer',
        'DevOps Engineer',
        'Data Scientist',
        'ML Engineer',
        'Product Manager',
        'QA Tester',
        'Technical Writer',
        'System Administrator',
        'Database Administrator',
        'Security Engineer',
        'Cloud Architect'
      ],
      preferredWorkHours: [
        { value: 'morning', label: 'Morning (6 AM - 12 PM)' },
        { value: 'afternoon', label: 'Afternoon (12 PM - 6 PM)' },
        { value: 'evening', label: 'Evening (6 PM - 12 AM)' },
        { value: 'flexible', label: 'Flexible' }
      ],
      interests: [
        'Open Source',
        'Hackathons',
        'Portfolio Building',
        'Startup',
        'Research',
        'Learning',
        'Mentorship',
        'Teaching',
        'Freelancing',
        'Remote Work',
        'Game Development',
        'Mobile Apps',
        'Web Development',
        'Data Science',
        'Machine Learning',
        'Blockchain',
        'IoT',
        'AR/VR',
        'Cybersecurity',
        'DevOps'
      ],
      goals: [
        'Build Portfolio',
        'Find Collaborators',
        'Learn New Stack',
        'Get Internship',
        'Start Business',
        'Contribute to Open Source',
        'Improve Skills',
        'Network',
        'Mentor Others',
        'Get Job'
      ],
      workStyle: {
        teamPreference: [
          { value: 'collaborative', label: 'Collaborative', description: 'Love working closely with team members' },
          { value: 'independent', label: 'Independent', description: 'Prefer working on my own tasks' },
          { value: 'mixed', label: 'Mixed', description: 'Balance of both approaches' }
        ],
        pace: [
          { value: 'fast', label: 'Fast', description: 'Quick iterations and rapid development' },
          { value: 'structured', label: 'Structured', description: 'Planned approach with clear milestones' },
          { value: 'slow-steady', label: 'Slow & Steady', description: 'Careful, methodical development' }
        ],
        communication: [
          { value: 'frequent-checkins', label: 'Frequent Check-ins', description: 'Regular updates and meetings' },
          { value: 'asynchronous', label: 'Asynchronous', description: 'Communication via messages and docs' },
          { value: 'minimal', label: 'Minimal', description: 'Only when necessary' }
        ],
        decisionStyle: [
          { value: 'consensus', label: 'Consensus', description: 'Group decisions through discussion' },
          { value: 'owner-driven', label: 'Owner-driven', description: 'Clear ownership and decision makers' },
          { value: 'data-driven', label: 'Data-driven', description: 'Decisions based on metrics and analysis' }
        ]
      }
    };

    return res.json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('Get compatibility options error:', error);
    res.status(500).json({ success: false, error: 'Failed to get compatibility options' });
  }
}
