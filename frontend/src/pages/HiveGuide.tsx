import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { NetworkBackground } from '@/components/NetworkBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GlowButton } from '@/components/ui/glow-button';
import { 
  ArrowLeft, 
  Users, 
  Lightbulb, 
  Rocket, 
  MessageCircle, 
  Trophy, 
  Search, 
  Heart, 
  Zap, 
  Target, 
  Clock, 
  Star,
  Crown,
  Shield,
  Sparkles,
  GitBranch,
  FileText,
  Camera,
  BarChart3,
  Award,
  UserCheck,
  Globe,
  Smartphone,
  Database,
  Cpu,
  Palette,
  Code
} from 'lucide-react';

const features = [
  {
    id: 'collaboration',
    title: 'Smart Collaboration System',
    icon: Users,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    description: 'Connect with developers who match your skills, interests, and work style',
    details: [
      'Compatibility algorithm matching based on skills, interests, and work style',
      'Project-based team formation with role assignments',
      'Collaboration request system with compatibility scoring',
      'Join ideas and projects you want to help build',
      'Track collaboration history and contributions'
    ],
    innovation: 'Our proprietary compatibility algorithm analyzes 5+ factors to find your perfect coding partners'
  },
  {
    id: 'ideas',
    title: 'Idea Hive Board',
    icon: Lightbulb,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    description: 'Share, discover, and collaborate on innovative project ideas',
    details: [
      'Post ideas with detailed descriptions and tech stack requirements',
      'Browse trending and featured ideas from the community',
      'Join ideas you want to help build',
      'Vote and comment on ideas to show interest',
      'Convert ideas into full projects when ready'
    ],
    innovation: 'The only platform where ideas evolve from concept to collaboration to completion'
  },
  {
    id: 'projects',
    title: 'Project Showcase',
    icon: Rocket,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    description: 'Showcase your completed projects with rich media and detailed information',
    details: [
      'Upload project screenshots and cover images',
      'Detailed project descriptions with tech stack',
      'Live demo links and GitHub repositories',
      'Project timeline and development stages',
      'Contributor recognition and collaboration history'
    ],
    innovation: 'Comprehensive project portfolios that tell the complete development story'
  },
  {
    id: 'compatibility',
    title: 'Compatibility Algorithm',
    icon: Target,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    description: 'Advanced matching system that finds your perfect coding partners',
    details: [
      'Skills overlap analysis (30% weight)',
      'Preferred roles compatibility (20% weight)',
      'Interests alignment (20% weight)',
      'Time availability matching (15% weight)',
      'Work style compatibility (15% weight)',
      'Past collaboration bonus scoring'
    ],
    innovation: 'The most advanced developer matching system, analyzing compatibility across multiple dimensions'
  },
  {
    id: 'notifications',
    title: 'Notification System',
    icon: MessageCircle,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    description: 'Stay updated with collaboration requests and project activities',
    details: [
      'Real-time notifications for collaboration requests',
      'Project activity updates and mentions',
      'Idea join request notifications',
      'Achievement and badge notifications',
      'System alerts and updates'
    ],
    innovation: 'Comprehensive notification system that keeps you informed of all platform activities'
  },
  {
    id: 'gamification',
    title: 'Achievement & Leaderboard',
    icon: Trophy,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    description: 'Gamified experience with badges, points, and competitive rankings',
    details: [
      '50+ unique badges across 5 categories',
      'Dynamic leaderboard with multiple ranking types',
      'Points system for all activities',
      'Achievement tracking and progress monitoring',
      'Special recognition for top contributors',
      'Streak tracking and milestone rewards'
    ],
    innovation: 'Comprehensive gamification that motivates continuous learning and collaboration'
  },
  {
    id: 'search',
    title: 'Search & Discovery',
    icon: Search,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    description: 'Powerful search across projects, ideas, and developers',
    details: [
      'Global search across projects, ideas, and users',
      'Username search with autocomplete functionality',
      'Filter by skills, technologies, and categories',
      'Real-time search suggestions and results',
      'Debounced search for optimal performance',
      'Search history and recent searches'
    ],
    innovation: 'Fast and accurate search that helps you find exactly what you need'
  },
];

const techStack = [
  { name: 'React 18', icon: Code, description: 'Modern UI framework' },
  { name: 'TypeScript', icon: FileText, description: 'Type-safe development' },
  { name: 'Node.js', icon: Cpu, description: 'Server-side runtime' },
  { name: 'MongoDB', icon: Database, description: 'NoSQL database' },
  { name: 'Socket.io', icon: Globe, description: 'Real-time communication' },
  { name: 'Tailwind CSS', icon: Palette, description: 'Utility-first styling' },
  { name: 'Framer Motion', icon: Sparkles, description: 'Smooth animations' },
  { name: 'Cloudinary', icon: Camera, description: 'Image management' }
];

const problemSolutions = [
  {
    problem: 'Finding the Right Collaborators',
    solution: 'Advanced compatibility algorithm analyzes skills, interests, work style, and availability to connect you with perfect coding partners.',
    icon: UserCheck
  },
  {
    problem: 'Ideas Getting Lost',
    solution: 'Centralized Idea Hive Board where ideas are shared, discovered, voted on, and evolved into full projects with community support.',
    icon: Lightbulb
  },
  {
    problem: 'Poor Project Visibility',
    solution: 'Rich project showcase with media, detailed descriptions, tech stacks, and contributor recognition to highlight your work.',
    icon: Rocket
  },
  {
    problem: 'Fragmented Communication',
    solution: 'Integrated notification system with collaboration requests, project updates, and seamless communication tools.',
    icon: MessageCircle
  },
  {
    problem: 'Lack of Recognition',
    solution: 'Comprehensive gamification system with badges, leaderboards, points, and achievements to recognize contributions.',
    icon: Trophy
  },
  {
    problem: 'Difficulty Finding Content',
    solution: 'Advanced search and discovery system with real-time suggestions and intelligent filtering across all content.',
    icon: Search
  }
];

export default function HiveGuide() {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState('collaboration');

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NetworkBackground />
      
      {/* Header */}
      <div className="relative z-10">
        <nav className="flex items-center justify-between p-6">
          <motion.button
            onClick={handleBackToLogin}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3"
          >
            <img src="/final.png" alt="Peve Logo" className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold brand-peve">peve</h1>
              <p className="text-sm text-muted-foreground">your peers, your hive</p>
            </div>
          </motion.div>
        </nav>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">
            <span className="gradient-text">Hive Guide</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover how Peve revolutionizes developer collaboration through advanced compatibility matching, 
            seamless communication, and innovative project management tools.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Smart Collaboration
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              Compatibility
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <MessageCircle className="w-4 h-4 mr-2" />
              Notifications
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              Gamification
            </Badge>
          </div>
        </motion.div>

        {/* Problem & Solution Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="gradient-text">Problems We Solve</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problemSolutions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="glass border-border h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">
                          {item.problem}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.solution}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="gradient-text">Core Features</span>
          </h2>
          
          {/* Feature Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeFeature === feature.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card-secondary hover:bg-primary/10 text-muted-foreground hover:text-foreground'
                }`}
              >
                <feature.icon className="w-4 h-4" />
                {feature.title}
              </button>
            ))}
          </div>

          {/* Active Feature Details */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {features.map((feature) => (
              activeFeature === feature.id && (
                <Card key={feature.id} className="glass border-border">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-xl ${feature.bgColor}`}>
                        <feature.icon className={`w-8 h-8 ${feature.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{feature.title}</CardTitle>
                        <p className="text-muted-foreground mt-2">{feature.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-primary">Innovation Highlight</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.innovation}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Key Capabilities:</h4>
                      <ul className="space-y-2">
                        {feature.details.map((detail, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            ))}
          </motion.div>
        </motion.section>

        {/* Tech Stack Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="gradient-text">Built with Modern Technology</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center"
              >
                <Card className="glass border-border p-4 hover:border-primary/50 transition-colors">
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <tech.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{tech.name}</h4>
                        <p className="text-xs text-muted-foreground">{tech.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How It Works Flow */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="gradient-text">How It Works</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
                <p className="text-muted-foreground">
                  Set up your developer profile with skills, interests, and work preferences. 
                  Our AI will use this to find perfect matches.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Discover & Connect</h3>
                <p className="text-muted-foreground">
                  Browse ideas, explore projects, and get matched with compatible developers. 
                  Join collaboration requests and start building together.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Collaborate & Grow</h3>
                <p className="text-muted-foreground">
                  Work together in real-time, track progress, earn achievements, 
                  and showcase your completed projects to the community.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <Card className="glass border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Crown className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold">Ready to Join the Hive?</h2>
              </div>
              <p className="text-muted-foreground mb-8 text-lg">
                Start collaborating with developers who share your passion and skills. 
                Your perfect coding partners are waiting.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GlowButton onClick={handleBackToLogin} size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  Join the Hive
                </GlowButton>
                <GlowButton variant="outline" onClick={handleBackToLogin} size="lg">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Explore Ideas
                </GlowButton>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
