import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Star, 
  Users, 
  Briefcase, 
  Award, 
  Calendar,
  ExternalLink,
  Mail,
  MessageCircle,
  UserPlus,
  Github,
  Linkedin,
  Globe,
  Trophy,
  Target,
  Activity,
  Zap,
  TrendingUp,
  Heart,
  Share2,
  Eye,
  Code,
  Palette,
  Database,
  Cloud,
  Shield,
  Crown,
  Medal,
  Flame
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("about");
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());

  const skills = [
    { name: "React", level: 95, category: "Frontend" },
    { name: "TypeScript", level: 90, category: "Programming" },
    { name: "UI/UX Design", level: 88, category: "Design" },
    { name: "Node.js", level: 85, category: "Backend" },
    { name: "Python", level: 80, category: "Programming" },
    { name: "Figma", level: 92, category: "Design" }
  ];

  const projects = [
    {
      id: "1",
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React, Node.js, and MongoDB",
      image: "/api/placeholder/400/200",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      likes: 42,
      views: 1200,
      isLiked: likedProjects.has("1")
    },
    {
      id: "2", 
      title: "AI Chat Assistant",
      description: "Intelligent chatbot with natural language processing capabilities",
      image: "/api/placeholder/400/200",
      tags: ["Python", "OpenAI", "FastAPI", "React"],
      likes: 38,
      views: 980,
      isLiked: likedProjects.has("2")
    },
    {
      id: "3",
      title: "Mobile Banking App",
      description: "Secure mobile banking application with biometric authentication",
      image: "/api/placeholder/400/200", 
      tags: ["React Native", "Node.js", "PostgreSQL", "AWS"],
      likes: 56,
      views: 1500,
      isLiked: likedProjects.has("3")
    }
  ];

  const achievements = [
    { id: "1", title: "Code Master", description: "Completed 100+ coding challenges", icon: Trophy, color: "text-yellow-400" },
    { id: "2", title: "Team Player", description: "Collaborated on 20+ projects", icon: Users, color: "text-blue-400" },
    { id: "3", title: "Innovation Leader", description: "Launched 5 successful products", icon: Zap, color: "text-purple-400" },
    { id: "4", title: "Mentor", description: "Helped 50+ developers grow", icon: Crown, color: "text-green-400" }
  ];

  const connections = [
    { id: "1", name: "Sarah Chen", role: "Full Stack Developer", avatar: "/api/placeholder/60/60", mutual: 12 },
    { id: "2", name: "Marcus Johnson", role: "Product Manager", avatar: "/api/placeholder/60/60", mutual: 8 },
    { id: "3", name: "Elena Rodriguez", role: "UX Designer", avatar: "/api/placeholder/60/60", mutual: 15 },
    { id: "4", name: "David Kim", role: "DevOps Engineer", avatar: "/api/placeholder/60/60", mutual: 6 }
  ];

  const activities = [
    { id: "1", type: "project", action: "published", target: "E-Commerce Platform", time: "2 hours ago" },
    { id: "2", type: "skill", action: "earned", target: "React Expert badge", time: "1 day ago" },
    { id: "3", type: "connection", action: "connected with", target: "Sarah Chen", time: "3 days ago" },
    { id: "4", type: "achievement", action: "unlocked", target: "Code Master", time: "1 week ago" }
  ];

  const toggleLike = (projectId: string) => {
    setLikedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">JD</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold gradient-text mb-2">John Doe</h1>
                      <p className="text-foreground-secondary mb-2">Senior Full Stack Developer</p>
                      <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>San Francisco, CA</span>
                        <span>•</span>
                        <span>Available for work</span>
                      </div>
                      <p className="text-foreground-secondary max-w-2xl">
                        Passionate developer with 5+ years of experience building scalable web applications. 
                        Love working with React, Node.js, and modern cloud technologies.
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2">
                        <Button variant="glass" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      </div>
                      
                      <div className="flex gap-4">
                        <a href="#" className="text-foreground-secondary hover:text-primary transition-colors">
                          <Github className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-foreground-secondary hover:text-primary transition-colors">
                          <Linkedin className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-foreground-secondary hover:text-primary transition-colors">
                          <Globe className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Profile Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="connections">Connections</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      Skills & Expertise
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {skills.map((skill, index) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-foreground">{skill.name}</span>
                            <span className="text-sm text-foreground-secondary">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          <span className="text-xs text-foreground-secondary">{skill.category}</span>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-400" />
                      Achievements
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-center gap-3 p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                        >
                          <achievement.icon className={`w-8 h-8 ${achievement.color}`} />
                          <div>
                            <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                            <p className="text-sm text-foreground-secondary">{achievement.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-green-400" />
                      Featured Projects
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="group"
                        >
                          <GlassCard className="p-4 h-full hover:shadow-lg transition-all duration-300">
                            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                              <Code className="w-12 h-12 text-primary" />
                            </div>
                            <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                              {project.title}
                            </h4>
                            <p className="text-sm text-foreground-secondary mb-4 line-clamp-2">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                                <button
                                  onClick={() => toggleLike(project.id)}
                                  className={`flex items-center gap-1 hover:text-red-400 transition-colors ${
                                    project.isLiked ? 'text-red-400' : ''
                                  }`}
                                >
                                  <Heart className={`w-4 h-4 ${project.isLiked ? 'fill-current' : ''}`} />
                                  {project.likes}
                                </button>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {project.views}
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </GlassCard>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              </TabsContent>

              {/* Connections Tab */}
              <TabsContent value="connections" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      Professional Network
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {connections.map((connection, index) => (
                        <motion.div
                          key={connection.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                            {connection.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{connection.name}</h4>
                            <p className="text-sm text-foreground-secondary">{connection.role}</p>
                            <p className="text-xs text-foreground-secondary">{connection.mutual} mutual connections</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-400" />
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {activities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <Activity className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-foreground">
                              <span className="font-semibold">{activity.action}</span> {activity.target}
                            </p>
                            <p className="text-sm text-foreground-secondary">{activity.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}