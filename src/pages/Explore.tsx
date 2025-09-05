import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Users, 
  Code, 
  Palette, 
  Briefcase,
  GraduationCap,
  Camera,
  Music,
  Rocket,
  Brain,
  Zap,
  TrendingUp,
  Grid3X3,
  List,
  ArrowRight,
  Heart,
  MessageCircle,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Explore() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { icon: Code, label: "Development", count: 1234, color: "primary" },
    { icon: Palette, label: "Design", count: 856, color: "secondary" },
    { icon: Briefcase, label: "Business", count: 642, color: "accent" },
    { icon: GraduationCap, label: "Education", count: 428, color: "primary" },
    { icon: Camera, label: "Photography", count: 312, color: "secondary" },
    { icon: Music, label: "Music", count: 298, color: "accent" },
    { icon: Rocket, label: "Startups", count: 567, color: "primary" }
  ];

  const users = [
    {
      name: "Sarah Chen",
      role: "Senior UX Designer",
      location: "San Francisco, CA",
      skills: ["UI/UX", "Figma", "Prototyping"],
      rating: 4.9,
      projects: 23,
      avatar: "SC",
      verified: true
    },
    {
      name: "Marcus Rodriguez",
      role: "Full Stack Developer",
      location: "New York, NY",
      skills: ["React", "Node.js", "TypeScript"],
      rating: 4.8,
      projects: 31,
      avatar: "MR",
      verified: true
    },
    {
      name: "Elena Vasquez",
      role: "Research Scientist",
      location: "Boston, MA",
      skills: ["AI/ML", "Python", "Data Science"],
      rating: 5.0,
      projects: 18,
      avatar: "EV",
      verified: true
    },
    {
      name: "James Wilson",
      role: "Product Manager",
      location: "Seattle, WA",
      skills: ["Strategy", "Analytics", "Leadership"],
      rating: 4.7,
      projects: 27,
      avatar: "JW",
      verified: false
    },
    {
      name: "Lisa Park",
      role: "Marketing Director",
      location: "Los Angeles, CA",
      skills: ["Digital Marketing", "Branding", "Content"],
      rating: 4.9,
      projects: 19,
      avatar: "LP",
      verified: true
    },
    {
      name: "David Kim",
      role: "Blockchain Developer",
      location: "Austin, TX",
      skills: ["Solidity", "Web3", "DeFi"],
      rating: 4.6,
      projects: 15,
      avatar: "DK",
      verified: false
    }
  ];

  const trending = [
    { tag: "AI & Machine Learning", posts: 1247 },
    { tag: "Sustainable Design", posts: 892 },
    { tag: "Web3 Development", posts: 756 },
    { tag: "Remote Collaboration", posts: 634 },
    { tag: "Startup Funding", posts: 521 }
  ];

  const aiSuggestions = [
    {
      type: "perfect_match",
      title: "Perfect Match Found!",
      description: "Sarah Chen shares 95% skill compatibility with your profile",
      user: "Sarah Chen",
      avatar: "SC",
      reason: "Both React experts with UI/UX focus",
      action: "Connect Now"
    },
    {
      type: "trending_skill",
      title: "Trending in Your Network",
      description: "TypeScript is gaining popularity among your connections",
      skill: "TypeScript",
      growth: "+23%",
      action: "Learn More"
    },
    {
      type: "collaboration",
      title: "Collaboration Opportunity",
      description: "3 developers are looking for a designer for their startup",
      project: "FinTech Mobile App",
      participants: 3,
      action: "Join Project"
    }
  ];

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
            <h1 className="text-4xl font-bold gradient-text mb-4">Explore Community</h1>
            <p className="text-xl text-foreground-secondary max-w-2xl">
              Discover talented professionals, innovative projects, and exciting opportunities 
              from our global community of creators and innovators.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-secondary" />
                  <input
                    type="text"
                    placeholder="Search by name, skills, location, or interests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-muted/20 border border-border/30 rounded-large text-foreground placeholder-foreground-secondary focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <Button variant="glass" className="lg:w-auto">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </GlassCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Categories & AI Suggestions */}
            <div className="space-y-6">
              {/* AI Smart Suggestions */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <GlassCard className="glow-purple">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      AI Smart Suggestions
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-foreground-secondary">
                      <Zap className="w-3 h-3" />
                      Live
                    </div>
                  </div>
                  <div className="space-y-4">
                    {aiSuggestions.map((suggestion, index) => (
                      <motion.div 
                        key={index}
                        className="p-4 bg-muted/10 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center text-foreground font-semibold text-sm">
                            {suggestion.avatar || "AI"}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground text-sm mb-1">{suggestion.title}</h4>
                            <p className="text-xs text-foreground-secondary mb-2">{suggestion.description}</p>
                            {suggestion.reason && (
                              <p className="text-xs text-purple-400 mb-2">{suggestion.reason}</p>
                            )}
                            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 p-0 h-auto">
                              {suggestion.action} <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Categories */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <GlassCard>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Categories</h3>
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <motion.button
                        key={category.label}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors group ${
                          selectedCategory === category.label 
                            ? 'bg-primary/20 border border-primary/30' 
                            : 'hover:bg-muted/20'
                        }`}
                        onClick={() => setSelectedCategory(selectedCategory === category.label ? null : category.label)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-${category.color}`}>
                            <category.icon className="w-4 h-4 text-foreground" />
                          </div>
                          <span className="text-foreground group-hover:text-primary transition-colors">
                            {category.label}
                          </span>
                        </div>
                        <span className="text-sm text-foreground-secondary">
                          {category.count}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Trending Topics */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <GlassCard>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Trending Topics
                  </h3>
                  <div className="space-y-3">
                    {trending.map((item, index) => (
                      <motion.div 
                        key={item.tag} 
                        className="flex justify-between items-center hover:bg-muted/10 p-2 rounded-lg transition-colors cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-foreground-secondary text-sm hover:text-foreground transition-colors">
                          #{item.tag.replace(/\s+/g, '').toLowerCase()}
                        </span>
                        <span className="text-xs text-foreground-secondary bg-muted/20 px-2 py-1 rounded-full">
                          {item.posts}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Main Content - User Grid */}
            <div className="lg:col-span-3">
              <motion.div 
                className="flex justify-between items-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-2xl font-semibold text-foreground">
                  Featured Professionals
                </h2>
                <div className="flex gap-2 bg-muted/20 p-1 rounded-lg">
                  <Button 
                    variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="px-3"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'ghost'} 
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>

              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {users.map((user, index) => (
                  <motion.div
                    key={user.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <GlassCard className="h-full hover:glow-primary">
                      <div className={`flex ${viewMode === 'list' ? 'items-center gap-6' : 'flex-col'}`}>
                        <div className={`flex ${viewMode === 'list' ? 'items-center gap-4' : 'items-start justify-between mb-4'}`}>
                          <div className="flex items-center gap-4">
                            <motion.div 
                              className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-foreground font-bold text-lg"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              {user.avatar}
                            </motion.div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{user.name}</h3>
                                {user.verified && (
                                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                    <span className="text-foreground text-xs">✓</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-foreground-secondary text-sm">{user.role}</p>
                              <div className="flex items-center gap-1 text-xs text-foreground-secondary mt-1">
                                <MapPin className="w-3 h-3" />
                                {user.location}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={`flex flex-wrap gap-2 ${viewMode === 'list' ? 'mb-4' : 'mb-4'}`}>
                          {user.skills.map((skill) => (
                            <motion.span
                              key={skill}
                              className="px-3 py-1 bg-muted/30 rounded-full text-xs text-foreground-secondary hover:bg-primary/20 hover:text-primary transition-colors cursor-pointer"
                              whileHover={{ scale: 1.05 }}
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>

                        <div className={`flex items-center ${viewMode === 'list' ? 'gap-6' : 'justify-between mb-4'}`}>
                          <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-warning fill-current" />
                              {user.rating}
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {user.projects} projects
                            </div>
                          </div>
                        </div>

                        <div className={`flex gap-2 ${viewMode === 'list' ? 'ml-auto' : ''}`}>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="default" size="sm" className="flex-1">
                              <Heart className="w-4 h-4 mr-2" />
                              Connect
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="sm">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              <motion.div 
                className="text-center mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <Button variant="glass" size="lg" className="group">
                  <Users className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Load More Profiles
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}