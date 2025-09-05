import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Heart, 
  Users, 
  Calendar, 
  Clock, 
  Target, 
  Zap, 
  Brain, 
  Code, 
  Palette, 
  Database, 
  Cloud, 
  Smartphone, 
  Globe, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  MessageCircle, 
  Share2, 
  Download, 
  MoreVertical, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink, 
  TrendingUp, 
  Award, 
  Crown, 
  Sparkles, 
  Rocket, 
  Lightbulb, 
  Shield, 
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Projects() {
  const [activeTab, setActiveTab] = useState("my-projects");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAIRecommendations, setShowAIRecommendations] = useState(true);

  const projects = [
    {
      id: 1,
      title: "AI-Powered Analytics Dashboard",
      description: "A comprehensive dashboard for analyzing user behavior and business metrics with real-time AI insights.",
      status: "active",
      progress: 75,
      category: "web-app",
      technologies: ["React", "Node.js", "Python", "PostgreSQL"],
      team: [
        { name: "Alex Johnson", role: "Lead Developer", avatar: "AJ" },
        { name: "Sarah Chen", role: "UX Designer", avatar: "SC" },
        { name: "Marcus Rodriguez", role: "Data Scientist", avatar: "MR" }
      ],
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      likes: 42,
      views: 128,
      isLiked: true,
      isOwner: true,
      priority: "high",
      tags: ["AI", "Analytics", "Dashboard", "Real-time"]
    },
    {
      id: 2,
      title: "Sustainable E-commerce Platform",
      description: "An eco-friendly e-commerce solution with carbon footprint tracking and sustainable product recommendations.",
      status: "planning",
      progress: 25,
      category: "web-app",
      technologies: ["Vue.js", "Laravel", "MySQL", "Redis"],
      team: [
        { name: "Lisa Park", role: "Product Manager", avatar: "LP" },
        { name: "David Kim", role: "Backend Developer", avatar: "DK" }
      ],
      startDate: "2024-03-01",
      endDate: "2024-07-01",
      likes: 28,
      views: 95,
      isLiked: false,
      isOwner: false,
      priority: "medium",
      tags: ["Sustainability", "E-commerce", "Green Tech"]
    },
    {
      id: 3,
      title: "AR Collaboration Tool",
      description: "Revolutionary AR tool for remote team collaboration with 3D workspace visualization.",
      status: "completed",
      progress: 100,
      category: "mobile-app",
      technologies: ["Unity", "C#", "ARCore", "Firebase"],
      team: [
        { name: "Elena Vasquez", role: "AR Developer", avatar: "EV" },
        { name: "James Wilson", role: "3D Artist", avatar: "JW" },
        { name: "Maria Garcia", role: "UX Researcher", avatar: "MG" }
      ],
      startDate: "2023-09-01",
      endDate: "2024-02-28",
      likes: 67,
      views: 234,
      isLiked: true,
      isOwner: false,
      priority: "high",
      tags: ["AR", "Collaboration", "Remote Work", "Innovation"]
    },
    {
      id: 4,
      title: "Blockchain Voting System",
      description: "Secure and transparent voting system built on blockchain technology for democratic processes.",
      status: "active",
      progress: 60,
      category: "web-app",
      technologies: ["Solidity", "Web3.js", "React", "IPFS"],
      team: [
        { name: "Alex Johnson", role: "Blockchain Developer", avatar: "AJ" },
        { name: "Priya Patel", role: "Security Expert", avatar: "PP" }
      ],
      startDate: "2024-02-01",
      endDate: "2024-06-30",
      likes: 35,
      views: 156,
      isLiked: false,
      isOwner: true,
      priority: "high",
      tags: ["Blockchain", "Security", "Democracy", "Transparency"]
    },
    {
      id: 5,
      title: "IoT Smart Home Hub",
      description: "Centralized hub for managing all smart home devices with AI-powered automation.",
      status: "planning",
      progress: 15,
      category: "iot",
      technologies: ["Python", "MQTT", "TensorFlow", "Raspberry Pi"],
      team: [
        { name: "Tom Chen", role: "IoT Engineer", avatar: "TC" },
        { name: "Anna Smith", role: "AI Specialist", avatar: "AS" }
      ],
      startDate: "2024-04-01",
      endDate: "2024-09-30",
      likes: 19,
      views: 78,
      isLiked: false,
      isOwner: false,
      priority: "low",
      tags: ["IoT", "Smart Home", "AI", "Automation"]
    },
    {
      id: 6,
      title: "Health Monitoring App",
      description: "Personal health tracking app with AI-powered insights and doctor integration.",
      status: "active",
      progress: 45,
      category: "mobile-app",
      technologies: ["React Native", "Node.js", "MongoDB", "TensorFlow"],
      team: [
        { name: "Dr. Sarah Lee", role: "Medical Advisor", avatar: "SL" },
        { name: "Mike Johnson", role: "Mobile Developer", avatar: "MJ" }
      ],
      startDate: "2024-01-01",
      endDate: "2024-05-31",
      likes: 53,
      views: 189,
      isLiked: true,
      isOwner: false,
      priority: "medium",
      tags: ["Health", "AI", "Mobile", "Healthcare"]
    }
  ];

  const aiTeammateSuggestions = [
    {
      id: 1,
      name: "Elena Rodriguez",
      role: "Full Stack Developer",
      avatar: "ER",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      matchScore: 95,
      reason: "Perfect match for your AI Dashboard project. Strong in React and backend development.",
      availability: "Available",
      hourlyRate: "$75/hour",
      experience: "5 years",
      rating: 4.9
    },
    {
      id: 2,
      name: "David Park",
      role: "UI/UX Designer",
      avatar: "DP",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      matchScore: 88,
      reason: "Excellent design skills and experience with analytics dashboards.",
      availability: "Available",
      hourlyRate: "$60/hour",
      experience: "4 years",
      rating: 4.8
    },
    {
      id: 3,
      name: "Maria Santos",
      role: "Data Scientist",
      avatar: "MS",
      skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
      matchScore: 92,
      reason: "Strong background in AI and data analysis. Perfect for your analytics project.",
      availability: "Available in 2 weeks",
      hourlyRate: "$90/hour",
      experience: "6 years",
      rating: 4.9
    }
  ];

  const categories = [
    { value: "all", label: "All Projects", icon: Briefcase, count: projects.length },
    { value: "web-app", label: "Web Apps", icon: Globe, count: projects.filter(p => p.category === "web-app").length },
    { value: "mobile-app", label: "Mobile Apps", icon: Smartphone, count: projects.filter(p => p.category === "mobile-app").length },
    { value: "iot", label: "IoT", icon: Database, count: projects.filter(p => p.category === "iot").length }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'planning': return 'text-yellow-400 bg-yellow-500/20';
      case 'completed': return 'text-blue-400 bg-blue-500/20';
      case 'paused': return 'text-orange-400 bg-orange-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getFilteredProjects = () => {
    let filtered = projects;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const handleLikeProject = (projectId: number) => {
    // In a real app, this would update the project like status
    console.log(`Liked project ${projectId}`);
  };

  const handleJoinProject = (projectId: number) => {
    // In a real app, this would send a join request
    console.log(`Requested to join project ${projectId}`);
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
                <h1 className="text-4xl font-bold gradient-text mb-2">Projects & Collaboration</h1>
                <p className="text-foreground-secondary">
                  Discover, create, and collaborate on innovative projects with talented professionals
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="hero">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
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

          {/* AI Recommendations Panel */}
          {showAIRecommendations && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="glow-primary border-primary/30">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <Brain className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">AI Teammate Suggestions</h3>
                      <p className="text-sm text-foreground-secondary">Find the perfect collaborators for your projects</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAIRecommendations(false)}
                  >
                    <EyeOff className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiTeammateSuggestions.map((teammate, index) => (
                    <motion.div
                      key={teammate.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    >
                      <GlassCard className="hover:scale-105 transition-transform">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center text-foreground font-semibold">
                            {teammate.avatar}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{teammate.name}</h4>
                            <p className="text-sm text-foreground-secondary">{teammate.role}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-foreground-secondary">{teammate.experience}</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-foreground">{teammate.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-foreground-secondary mb-3">{teammate.reason}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-foreground">{teammate.hourlyRate}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            teammate.availability.includes('Available') 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {teammate.availability}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-foreground-secondary">Match Score</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted/30 rounded-full h-2">
                              <motion.div 
                                className="bg-gradient-primary h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${teammate.matchScore}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              />
                            </div>
                            <span className="text-xs text-foreground">{teammate.matchScore}%</span>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass mb-8">
              {[
                { value: "my-projects", label: "My Projects", icon: Briefcase },
                { value: "collaborating", label: "Collaborating", icon: Users },
                { value: "discover", label: "Discover", icon: Search },
                { value: "completed", label: "Completed", icon: CheckCircle }
              ].map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* My Projects Tab */}
            <TabsContent value="my-projects" className="space-y-8">
              {/* Filters and Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
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

              {/* Projects Grid */}
              <motion.div
                className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                  : "space-y-6"
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <AnimatePresence>
                  {getFilteredProjects().map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      layout
                    >
                      <GlassCard className={`hover:scale-105 transition-all duration-300 ${
                        project.priority === 'high' ? 'border-l-4 border-l-red-500' : ''
                      }`}>
                        {/* Project Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{project.title}</h3>
                            <p className="text-sm text-foreground-secondary line-clamp-2">{project.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                              {project.priority}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-foreground-secondary">Progress</span>
                            <span className="text-foreground">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-muted/30 rounded-full h-2">
                            <motion.div 
                              className="bg-gradient-primary h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            />
                          </div>
                        </div>

                        {/* Technologies */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map((tech, techIndex) => (
                              <span 
                                key={techIndex}
                                className="px-2 py-1 bg-muted/20 text-foreground-secondary rounded text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="px-2 py-1 bg-muted/20 text-foreground-secondary rounded text-xs">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Team */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-foreground-secondary" />
                            <span className="text-sm text-foreground-secondary">
                              {project.team.length} member{project.team.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                            <div className="flex items-center gap-1">
                              <Heart className={`w-4 h-4 ${project.isLiked ? 'text-red-400 fill-current' : ''}`} />
                              {project.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {project.views}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {project.isOwner ? (
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="flex-1">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Contact Team
                            </Button>
                          )}
                          
                          <motion.button
                            onClick={() => handleLikeProject(project.id)}
                            className="p-2 hover:bg-muted/20 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Heart className={`w-4 h-4 ${project.isLiked ? 'text-red-400 fill-current' : 'text-foreground-secondary'}`} />
                          </motion.button>
                          
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </TabsContent>

            {/* Other tabs would be implemented similarly */}
            <TabsContent value="collaborating" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-foreground-secondary opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Collaboration Projects</h3>
                  <p className="text-foreground-secondary">
                    Projects you're collaborating on will appear here.
                  </p>
                </GlassCard>
              </motion.div>
            </TabsContent>

            <TabsContent value="discover" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard className="text-center py-12">
                  <Search className="w-16 h-16 mx-auto mb-4 text-foreground-secondary opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Discover Projects</h3>
                  <p className="text-foreground-secondary">
                    Find exciting projects to join and collaborate on.
                  </p>
                </GlassCard>
              </motion.div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard className="text-center py-12">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-foreground-secondary opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Completed Projects</h3>
                  <p className="text-foreground-secondary">
                    Your completed projects will be showcased here.
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
