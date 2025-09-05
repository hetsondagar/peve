import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Star, 
  Users, 
  Award, 
  Target, 
  TrendingUp, 
  Brain, 
  Zap, 
  Crown, 
  Sparkles, 
  Rocket, 
  Lightbulb, 
  Code, 
  Palette, 
  Database, 
  Cloud, 
  Smartphone, 
  Globe, 
  Search, 
  Filter, 
  Grid, 
  List, 
  ArrowRight, 
  Download, 
  Share2, 
  Bookmark, 
  Heart, 
  MessageCircle, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Plus, 
  Minus, 
  Lock, 
  Unlock, 
  Calendar, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Activity, 
  Trophy, 
  Medal, 
  Gem, 
  Flame, 
  Lightning, 
  Info, 
  AlertCircle, 
  Check, 
  X, 
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LearningHub() {
  const [activeTab, setActiveTab] = useState("paths");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCompleted, setShowCompleted] = useState(false);

  const learningPaths = [
    {
      id: 1,
      title: "Full Stack Web Development",
      description: "Master modern web development with React, Node.js, and cloud deployment",
      category: "web-development",
      difficulty: "intermediate",
      duration: "12 weeks",
      progress: 75,
      totalLessons: 48,
      completedLessons: 36,
      rating: 4.8,
      students: 1250,
      instructor: "Alex Johnson",
      instructorAvatar: "AJ",
      price: "Free",
      isFree: true,
      isEnrolled: true,
      isRecommended: true,
      skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
      badges: [
        { name: "React Master", icon: Code, earned: true },
        { name: "Backend Pro", icon: Database, earned: true },
        { name: "Cloud Architect", icon: Cloud, earned: false }
      ],
      nextLesson: "Advanced React Patterns",
      estimatedTime: "2 hours"
    },
    {
      id: 2,
      title: "AI & Machine Learning Fundamentals",
      description: "Learn the fundamentals of AI, machine learning, and deep learning",
      category: "ai-ml",
      difficulty: "beginner",
      duration: "8 weeks",
      progress: 45,
      totalLessons: 32,
      completedLessons: 14,
      rating: 4.9,
      students: 890,
      instructor: "Dr. Sarah Chen",
      instructorAvatar: "SC",
      price: "$199",
      isFree: false,
      isEnrolled: true,
      isRecommended: true,
      skills: ["Python", "TensorFlow", "Scikit-learn", "Pandas", "NumPy"],
      badges: [
        { name: "Python Basics", icon: Code, earned: true },
        { name: "ML Beginner", icon: Brain, earned: false },
        { name: "Data Scientist", icon: BarChart3, earned: false }
      ],
      nextLesson: "Introduction to Neural Networks",
      estimatedTime: "1.5 hours"
    },
    {
      id: 3,
      title: "UI/UX Design Mastery",
      description: "Create beautiful and user-friendly interfaces with modern design principles",
      category: "design",
      difficulty: "intermediate",
      duration: "10 weeks",
      progress: 0,
      totalLessons: 40,
      completedLessons: 0,
      rating: 4.7,
      students: 650,
      instructor: "Maria Garcia",
      instructorAvatar: "MG",
      price: "$149",
      isFree: false,
      isEnrolled: false,
      isRecommended: false,
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
      badges: [
        { name: "Design Thinking", icon: Lightbulb, earned: false },
        { name: "Prototyping Pro", icon: Palette, earned: false },
        { name: "UX Researcher", icon: Users, earned: false }
      ],
      nextLesson: "Design Principles",
      estimatedTime: "2 hours"
    }
  ];

  const tutorials = [
    {
      id: 1,
      title: "Building a React Dashboard with Charts",
      description: "Learn how to create an interactive dashboard using React and Chart.js",
      category: "web-development",
      type: "tutorial",
      duration: "45 min",
      difficulty: "intermediate",
      rating: 4.8,
      views: 1250,
      instructor: "Alex Johnson",
      instructorAvatar: "AJ",
      thumbnail: "/api/placeholder/300/200",
      isCompleted: true,
      isBookmarked: true,
      tags: ["React", "Charts", "Dashboard", "JavaScript"],
      publishedDate: "2024-03-15"
    },
    {
      id: 2,
      title: "Python Data Analysis with Pandas",
      description: "Master data manipulation and analysis using Python's Pandas library",
      category: "data-science",
      type: "tutorial",
      duration: "60 min",
      difficulty: "beginner",
      rating: 4.9,
      views: 890,
      instructor: "Dr. Sarah Chen",
      instructorAvatar: "SC",
      thumbnail: "/api/placeholder/300/200",
      isCompleted: false,
      isBookmarked: false,
      tags: ["Python", "Pandas", "Data Analysis", "Statistics"],
      publishedDate: "2024-03-10"
    },
    {
      id: 3,
      title: "Figma Design System Creation",
      description: "Build a comprehensive design system from scratch in Figma",
      category: "design",
      type: "tutorial",
      duration: "90 min",
      difficulty: "advanced",
      rating: 4.7,
      views: 650,
      instructor: "Maria Garcia",
      instructorAvatar: "MG",
      thumbnail: "/api/placeholder/300/200",
      isCompleted: false,
      isBookmarked: true,
      tags: ["Figma", "Design System", "UI", "Components"],
      publishedDate: "2024-03-05"
    }
  ];

  const aiRecommendations = [
    {
      id: 1,
      title: "Complete TypeScript Course",
      reason: "Based on your React skills, learning TypeScript will boost your development efficiency by 40%",
      priority: "high",
      estimatedBenefit: "+40% efficiency",
      timeToComplete: "3 weeks",
      category: "web-development",
      icon: Code
    },
    {
      id: 2,
      title: "Learn Docker & Kubernetes",
      reason: "Your backend skills would benefit from containerization knowledge for better deployment",
      priority: "medium",
      estimatedBenefit: "+25% deployment speed",
      timeToComplete: "2 weeks",
      category: "devops",
      icon: Cloud
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      reason: "Adding design skills to your full-stack expertise will make you a more complete developer",
      priority: "low",
      estimatedBenefit: "+30% project value",
      timeToComplete: "4 weeks",
      category: "design",
      icon: Palette
    }
  ];

  const progressStats = {
    totalHoursLearned: 156,
    coursesCompleted: 8,
    certificatesEarned: 5,
    currentStreak: 12,
    longestStreak: 28,
    weeklyGoal: 10,
    weeklyProgress: 7,
    level: 8,
    xp: 2450,
    nextLevelXp: 3000
  };

  const categories = [
    { value: "all", label: "All", icon: BookOpen, count: learningPaths.length },
    { value: "web-development", label: "Web Dev", icon: Code, count: learningPaths.filter(p => p.category === "web-development").length },
    { value: "ai-ml", label: "AI & ML", icon: Brain, count: learningPaths.filter(p => p.category === "ai-ml").length },
    { value: "design", label: "Design", icon: Palette, count: learningPaths.filter(p => p.category === "design").length },
    { value: "data-science", label: "Data Science", icon: BarChart3, count: learningPaths.filter(p => p.category === "data-science").length },
    { value: "devops", label: "DevOps", icon: Cloud, count: learningPaths.filter(p => p.category === "devops").length }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getFilteredPaths = () => {
    let filtered = learningPaths;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (!showCompleted) {
      filtered = filtered.filter(p => p.progress < 100);
    }
    
    return filtered;
  };

  const handleEnrollPath = (pathId: number) => {
    // In a real app, this would handle enrollment
    console.log(`Enrolled in path ${pathId}`);
  };

  const handleStartLesson = (pathId: number) => {
    // In a real app, this would start the lesson
    console.log(`Started lesson for path ${pathId}`);
  };

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
                <h1 className="text-4xl font-bold gradient-text mb-2">Learning Hub</h1>
                <p className="text-foreground-secondary">
                  Master new skills with AI-powered learning paths and curated tutorials
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="hero">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Path
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="glow-primary">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <Clock className="w-8 h-8 text-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{progressStats.totalHoursLearned}h</div>
                  <div className="text-sm text-foreground-secondary">Hours Learned</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="glow-secondary">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-secondary rounded-lg">
                  <CheckCircle className="w-8 h-8 text-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{progressStats.coursesCompleted}</div>
                  <div className="text-sm text-foreground-secondary">Courses Completed</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="glow-accent">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-accent rounded-lg">
                  <Award className="w-8 h-8 text-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{progressStats.certificatesEarned}</div>
                  <div className="text-sm text-foreground-secondary">Certificates</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="glow-purple">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-purple rounded-lg">
                  <Flame className="w-8 h-8 text-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{progressStats.currentStreak}</div>
                  <div className="text-sm text-foreground-secondary">Day Streak</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard className="glow-primary border-primary/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Brain className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">AI Learning Recommendations</h3>
                  <p className="text-sm text-foreground-secondary">Personalized suggestions based on your skills and goals</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiRecommendations.map((recommendation, index) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  >
                    <GlassCard className="hover:scale-105 transition-transform">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-muted/20 rounded-lg">
                          <recommendation.icon className="w-5 h-5 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{recommendation.title}</h4>
                          <p className="text-sm text-foreground-secondary">{recommendation.reason}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          recommendation.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          recommendation.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {recommendation.priority} priority
                        </span>
                        <span className="text-sm font-medium text-foreground">{recommendation.estimatedBenefit}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-foreground-secondary">Time to complete</span>
                        <span className="text-xs text-foreground">{recommendation.timeToComplete}</span>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Start Learning
                      </Button>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass mb-8">
              {[
                { value: "paths", label: "Learning Paths", icon: Target },
                { value: "tutorials", label: "Tutorials", icon: Play },
                { value: "progress", label: "Progress", icon: TrendingUp },
                { value: "certificates", label: "Certificates", icon: Award }
              ].map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Learning Paths Tab */}
            <TabsContent value="paths" className="space-y-8">
              {/* Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <GlassCard>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2 bg-muted/20 p-1 rounded-lg">
                        {categories.map((category) => (
                          <Button
                            key={category.value}
                            variant={selectedCategory === category.value ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setSelectedCategory(category.value)}
                            className="px-3"
                          >
                            <category.icon className="w-4 h-4 mr-2" />
                            {category.label} ({category.count})
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2 bg-muted/20 p-1 rounded-lg">
                        <Button
                          variant={viewMode === 'grid' ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                        >
                          <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode('list')}
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Learning Paths Grid */}
              <motion.div
                className={viewMode === 'grid' 
                  ? "grid grid-cols-1 lg:grid-cols-2 gap-6" 
                  : "space-y-6"
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <AnimatePresence>
                  {getFilteredPaths().map((path, index) => (
                    <motion.div
                      key={path.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      layout
                    >
                      <GlassCard className={`hover:scale-105 transition-all duration-300 ${
                        path.isRecommended ? 'border-l-4 border-l-primary glow-primary' : ''
                      }`}>
                        {/* Path Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground">{path.title}</h3>
                              {path.isRecommended && (
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <Sparkles className="w-4 h-4 text-yellow-400" />
                                </motion.div>
                              )}
                            </div>
                            <p className="text-sm text-foreground-secondary mb-2">{path.description}</p>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                                {path.difficulty}
                              </span>
                              <span className="text-xs text-foreground-secondary">{path.duration}</span>
                              <span className="text-xs text-foreground-secondary">{path.price}</span>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {path.isEnrolled && (
                          <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-foreground-secondary">Progress</span>
                              <span className="text-foreground">{path.completedLessons}/{path.totalLessons} lessons</span>
                            </div>
                            <div className="w-full bg-muted/30 rounded-full h-2">
                              <motion.div 
                                className="bg-gradient-primary h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${path.progress}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Skills */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {path.skills.slice(0, 3).map((skill, skillIndex) => (
                              <span 
                                key={skillIndex}
                                className="px-2 py-1 bg-muted/20 text-foreground-secondary rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                            {path.skills.length > 3 && (
                              <span className="px-2 py-1 bg-muted/20 text-foreground-secondary rounded text-xs">
                                +{path.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-foreground-secondary">Badges:</span>
                            <div className="flex gap-1">
                              {path.badges.map((badge, badgeIndex) => (
                                <div
                                  key={badgeIndex}
                                  className={`p-1 rounded ${
                                    badge.earned ? 'bg-yellow-500/20' : 'bg-muted/20'
                                  }`}
                                >
                                  <badge.icon className={`w-3 h-3 ${
                                    badge.earned ? 'text-yellow-400' : 'text-foreground-secondary'
                                  }`} />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Instructor */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 bg-gradient-secondary rounded-full flex items-center justify-center text-foreground text-xs font-semibold">
                            {path.instructorAvatar}
                          </div>
                          <span className="text-sm text-foreground-secondary">by {path.instructor}</span>
                          <div className="flex items-center gap-1 ml-auto">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-foreground">{path.rating}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {path.isEnrolled ? (
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleStartLesson(path.id)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Continue Learning
                            </Button>
                          ) : (
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleEnrollPath(path.id)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Enroll Now
                            </Button>
                          )}
                          
                          <Button variant="ghost" size="sm">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </TabsContent>

            {/* Other tabs would be implemented similarly */}
            <TabsContent value="tutorials" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard className="text-center py-12">
                  <Play className="w-16 h-16 mx-auto mb-4 text-foreground-secondary opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Tutorials</h3>
                  <p className="text-foreground-secondary">
                    Curated tutorials and video lessons will be displayed here.
                  </p>
                </GlassCard>
              </motion.div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-foreground-secondary opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Progress Tracking</h3>
                  <p className="text-foreground-secondary">
                    Detailed progress analytics and learning statistics will be shown here.
                  </p>
                </GlassCard>
              </motion.div>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard className="text-center py-12">
                  <Award className="w-16 h-16 mx-auto mb-4 text-foreground-secondary opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Certificates</h3>
                  <p className="text-foreground-secondary">
                    Your earned certificates and achievements will be displayed here.
                  </p>
                </GlassCard>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
