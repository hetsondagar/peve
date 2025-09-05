import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Award, 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  Target, 
  Users, 
  Briefcase, 
  Calendar,
  MessageCircle,
  TrendingUp,
  Rocket,
  Shield,
  Heart,
  Brain,
  Code,
  Palette,
  Database,
  Cloud,
  Lock,
  Unlock,
  CheckCircle,
  Sparkles,
  Gift,
  Medal,
  Gem,
  Flame,
  Eye,
  EyeOff,
  Filter,
  Search,
  Download,
  Share2,
  RefreshCw,
  Info,
  Clock,
  ArrowRight,
  Plus,
  Minus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Achievements() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<number[]>([]);

  const achievements = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first project on Peve",
      icon: Rocket,
      rarity: "common",
      unlocked: true,
      unlockedDate: "2024-01-15",
      category: "projects",
      xp: 100,
      progress: 100,
      requirement: "Complete 1 project"
    },
    {
      id: 2,
      name: "Social Butterfly",
      description: "Connect with 50+ professionals",
      icon: Users,
      rarity: "rare",
      unlocked: true,
      unlockedDate: "2024-02-20",
      category: "social",
      xp: 500,
      progress: 100,
      requirement: "Connect with 50 people"
    },
    {
      id: 3,
      name: "Code Master",
      description: "Achieve 90%+ skill rating in 3 programming languages",
      icon: Code,
      rarity: "epic",
      unlocked: true,
      unlockedDate: "2024-03-10",
      category: "skills",
      xp: 1000,
      progress: 100,
      requirement: "Master 3 programming languages"
    },
    {
      id: 4,
      name: "Innovation Leader",
      description: "Lead 5 breakthrough projects",
      icon: Crown,
      rarity: "legendary",
      unlocked: true,
      unlockedDate: "2024-03-25",
      category: "leadership",
      xp: 2000,
      progress: 100,
      requirement: "Lead 5 innovative projects"
    },
    {
      id: 5,
      name: "Mentor",
      description: "Help 10+ people improve their skills",
      icon: Heart,
      rarity: "rare",
      unlocked: false,
      unlockedDate: null,
      category: "social",
      xp: 750,
      progress: 70,
      requirement: "Mentor 10 people"
    },
    {
      id: 6,
      name: "Design Virtuoso",
      description: "Create 20+ UI/UX designs",
      icon: Palette,
      rarity: "epic",
      unlocked: false,
      unlockedDate: null,
      category: "skills",
      xp: 1200,
      progress: 45,
      requirement: "Create 20 designs"
    },
    {
      id: 7,
      name: "Cloud Architect",
      description: "Deploy 15+ applications to the cloud",
      icon: Cloud,
      rarity: "rare",
      unlocked: false,
      unlockedDate: null,
      category: "skills",
      xp: 800,
      progress: 20,
      requirement: "Deploy 15 cloud apps"
    },
    {
      id: 8,
      name: "Team Player",
      description: "Collaborate on 25+ projects",
      icon: Briefcase,
      rarity: "common",
      unlocked: false,
      unlockedDate: null,
      category: "collaboration",
      xp: 300,
      progress: 60,
      requirement: "Collaborate on 25 projects"
    },
    {
      id: 9,
      name: "Data Wizard",
      description: "Analyze 100+ datasets",
      icon: Database,
      rarity: "epic",
      unlocked: false,
      unlockedDate: null,
      category: "skills",
      xp: 1500,
      progress: 15,
      requirement: "Analyze 100 datasets"
    },
    {
      id: 10,
      name: "AI Pioneer",
      description: "Build 5+ AI-powered applications",
      icon: Brain,
      rarity: "legendary",
      unlocked: false,
      unlockedDate: null,
      category: "innovation",
      xp: 2500,
      progress: 40,
      requirement: "Build 5 AI applications"
    },
    {
      id: 11,
      name: "Speed Demon",
      description: "Complete projects 50% faster than average",
      icon: Zap,
      rarity: "rare",
      unlocked: false,
      unlockedDate: null,
      category: "productivity",
      xp: 600,
      progress: 80,
      requirement: "Maintain 50% faster pace"
    },
    {
      id: 12,
      name: "Perfectionist",
      description: "Achieve 95%+ quality rating on all projects",
      icon: Gem,
      rarity: "epic",
      unlocked: false,
      unlockedDate: null,
      category: "quality",
      xp: 1800,
      progress: 25,
      requirement: "Maintain 95% quality"
    }
  ];

  const categories = [
    { value: "all", label: "All", icon: Trophy, count: achievements.length },
    { value: "projects", label: "Projects", icon: Rocket, count: achievements.filter(a => a.category === "projects").length },
    { value: "social", label: "Social", icon: Users, count: achievements.filter(a => a.category === "social").length },
    { value: "skills", label: "Skills", icon: Code, count: achievements.filter(a => a.category === "skills").length },
    { value: "leadership", label: "Leadership", icon: Crown, count: achievements.filter(a => a.category === "leadership").length },
    { value: "collaboration", label: "Collaboration", icon: Briefcase, count: achievements.filter(a => a.category === "collaboration").length },
    { value: "innovation", label: "Innovation", icon: Brain, count: achievements.filter(a => a.category === "innovation").length },
    { value: "productivity", label: "Productivity", icon: TrendingUp, count: achievements.filter(a => a.category === "productivity").length },
    { value: "quality", label: "Quality", icon: Gem, count: achievements.filter(a => a.category === "quality").length }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gradient-to-br from-gray-500 to-gray-600';
      case 'rare': return 'bg-gradient-to-br from-blue-500 to-blue-600';
      case 'epic': return 'bg-gradient-to-br from-purple-500 to-purple-600';
      case 'legendary': return 'bg-gradient-to-br from-yellow-500 to-orange-500';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  const getFilteredAchievements = () => {
    let filtered = achievements;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }
    
    if (showUnlockedOnly) {
      filtered = filtered.filter(a => a.unlocked);
    }
    
    return filtered;
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);

  // Simulate new achievement unlock
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance every 10 seconds
        const lockedAchievements = achievements.filter(a => !a.unlocked);
        if (lockedAchievements.length > 0) {
          const randomAchievement = lockedAchievements[Math.floor(Math.random() * lockedAchievements.length)];
          setNewlyUnlocked(prev => [...prev, randomAchievement.id]);
          setTimeout(() => {
            setNewlyUnlocked(prev => prev.filter(id => id !== randomAchievement.id));
          }, 5000);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-2">Achievements</h1>
                <p className="text-foreground-secondary">
                  Track your progress and unlock badges as you grow your skills and network
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="glow-primary">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <Trophy className="w-8 h-8 text-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{unlockedCount}</div>
                  <div className="text-sm text-foreground-secondary">Achievements Unlocked</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="glow-secondary">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-secondary rounded-lg">
                  <Zap className="w-8 h-8 text-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{totalXP.toLocaleString()}</div>
                  <div className="text-sm text-foreground-secondary">Total XP Earned</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="glow-accent">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-accent rounded-lg">
                  <Crown className="w-8 h-8 text-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {achievements.filter(a => a.rarity === 'legendary' && a.unlocked).length}
                  </div>
                  <div className="text-sm text-foreground-secondary">Legendary Badges</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Categories</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant={showUnlockedOnly ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Unlocked Only
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {categories.map((category, index) => (
                  <motion.button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      selectedCategory === category.value
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-border/20 hover:border-border/40'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <category.icon className="w-5 h-5 mx-auto mb-2" />
                    <div className="text-sm font-medium">{category.label}</div>
                    <div className="text-xs text-foreground-secondary">{category.count}</div>
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Achievements Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <AnimatePresence>
              {getFilteredAchievements().map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  layout
                >
                  <GlassCard className={`relative overflow-hidden ${
                    achievement.unlocked 
                      ? 'hover:scale-105 transition-transform' 
                      : 'opacity-60'
                  } ${
                    newlyUnlocked.includes(achievement.id) ? 'ring-4 ring-yellow-400 animate-pulse' : ''
                  }`}>
                    {/* New Badge Indicator */}
                    {newlyUnlocked.includes(achievement.id) && (
                      <motion.div
                        className="absolute top-2 right-2 z-10"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-foreground" />
                        </div>
                      </motion.div>
                    )}

                    {/* Achievement Icon */}
                    <div className="text-center mb-4">
                      <motion.div
                        className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center relative ${
                          achievement.unlocked 
                            ? getRarityGradient(achievement.rarity)
                            : 'bg-muted/30'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        animate={newlyUnlocked.includes(achievement.id) ? { 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        } : {}}
                      >
                        {achievement.unlocked ? (
                          <achievement.icon className="w-10 h-10 text-foreground" />
                        ) : (
                          <Lock className="w-10 h-10 text-foreground-secondary" />
                        )}
                        
                        {/* Rarity Glow Effect */}
                        {achievement.unlocked && (
                          <motion.div
                            className={`absolute inset-0 rounded-full border-2 ${getRarityColor(achievement.rarity)}`}
                            animate={{ 
                              scale: [1, 1.1, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                    </div>

                    {/* Achievement Info */}
                    <div className="text-center mb-4">
                      <h3 className="font-semibold text-foreground mb-1">{achievement.name}</h3>
                      <p className="text-sm text-foreground-secondary mb-2">{achievement.description}</p>
                      
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          achievement.unlocked ? getRarityColor(achievement.rarity) : 'text-gray-500 border-gray-500'
                        }`}>
                          {achievement.rarity}
                        </span>
                        <span className="text-xs text-foreground-secondary">
                          {achievement.xp} XP
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground-secondary">Progress</span>
                        <span className="text-foreground">{achievement.progress}%</span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <motion.div 
                          className={`h-2 rounded-full ${
                            achievement.unlocked ? 'bg-gradient-primary' : 'bg-muted/50'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${achievement.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Requirement */}
                    <div className="text-center">
                      <p className="text-xs text-foreground-secondary mb-2">
                        {achievement.requirement}
                      </p>
                      
                      {achievement.unlocked && achievement.unlockedDate && (
                        <div className="flex items-center justify-center gap-1 text-xs text-green-400">
                          <CheckCircle className="w-3 h-3" />
                          Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Unlock Animation Overlay */}
                    {newlyUnlocked.includes(achievement.id) && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {getFilteredAchievements().length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="text-center py-12">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-foreground-secondary opacity-50" />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No achievements found</h3>
                <p className="text-foreground-secondary">
                  Try adjusting your filters or complete more activities to unlock achievements.
                </p>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
