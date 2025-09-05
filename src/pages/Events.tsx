import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  Heart, 
  Share2, 
  Bookmark, 
  Filter, 
  Search, 
  Plus, 
  ArrowRight, 
  Brain, 
  Zap, 
  Target, 
  Award, 
  Briefcase, 
  Code, 
  Palette, 
  Database, 
  Cloud, 
  Smartphone, 
  Globe, 
  TrendingUp, 
  Lightbulb, 
  Rocket, 
  Crown, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  ExternalLink, 
  Download, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  MessageCircle, 
  UserPlus, 
  Calendar as CalendarIcon, 
  Video, 
  Mic, 
  Camera, 
  Wifi, 
  WifiOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Events() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAIRecommendations, setShowAIRecommendations] = useState(true);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<number[]>([1, 3, 5]);

  const events = [
    {
      id: 1,
      title: "AI & Machine Learning Summit 2024",
      description: "Join industry leaders for a deep dive into the latest AI and ML technologies, featuring hands-on workshops and networking opportunities.",
      type: "conference",
      category: "ai-ml",
      date: "2024-04-15",
      time: "09:00 - 17:00",
      location: "San Francisco Convention Center",
      isOnline: false,
      attendees: 1250,
      maxAttendees: 2000,
      price: "$299",
      isFree: false,
      organizer: "Tech Innovation Hub",
      speakers: [
        { name: "Dr. Sarah Chen", role: "AI Research Director", company: "Google" },
        { name: "Marcus Rodriguez", role: "ML Engineer", company: "OpenAI" },
        { name: "Elena Vasquez", role: "Data Scientist", company: "Microsoft" }
      ],
      tags: ["AI", "Machine Learning", "Deep Learning", "Neural Networks"],
      isBookmarked: true,
      isRegistered: false,
      rating: 4.8,
      reviews: 156
    },
    {
      id: 2,
      title: "React Advanced Patterns Workshop",
      description: "Master advanced React patterns including Render Props, Hooks optimization, and performance tuning techniques.",
      type: "workshop",
      category: "web-development",
      date: "2024-04-20",
      time: "14:00 - 18:00",
      location: "Online",
      isOnline: true,
      attendees: 45,
      maxAttendees: 50,
      price: "Free",
      isFree: true,
      organizer: "React Community",
      speakers: [
        { name: "Alex Johnson", role: "Senior React Developer", company: "Meta" }
      ],
      tags: ["React", "JavaScript", "Frontend", "Performance"],
      isBookmarked: false,
      isRegistered: true,
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      title: "Startup Pitch Competition",
      description: "Present your innovative startup idea to a panel of investors and industry experts. Winner receives $50,000 funding.",
      type: "competition",
      category: "entrepreneurship",
      date: "2024-04-25",
      time: "10:00 - 16:00",
      location: "Silicon Valley Innovation Center",
      isOnline: false,
      attendees: 75,
      maxAttendees: 100,
      price: "$99",
      isFree: false,
      organizer: "Venture Capital Partners",
      speakers: [
        { name: "Lisa Park", role: "Partner", company: "Andreessen Horowitz" },
        { name: "David Kim", role: "Managing Director", company: "Sequoia Capital" }
      ],
      tags: ["Startup", "Pitch", "Funding", "Innovation"],
      isBookmarked: true,
      isRegistered: false,
      rating: 4.7,
      reviews: 23
    },
    {
      id: 4,
      title: "UX Design Masterclass",
      description: "Learn advanced UX design principles, user research methodologies, and prototyping techniques from industry experts.",
      type: "masterclass",
      category: "design",
      date: "2024-05-02",
      time: "10:00 - 15:00",
      location: "Design Studio Hub",
      isOnline: false,
      attendees: 30,
      maxAttendees: 40,
      price: "$199",
      isFree: false,
      organizer: "Design Academy",
      speakers: [
        { name: "Maria Garcia", role: "UX Director", company: "Apple" },
        { name: "James Wilson", role: "Design Lead", company: "Figma" }
      ],
      tags: ["UX", "Design", "User Research", "Prototyping"],
      isBookmarked: false,
      isRegistered: false,
      rating: 4.9,
      reviews: 67
    },
    {
      id: 5,
      title: "Blockchain & Web3 Hackathon",
      description: "48-hour hackathon focused on building innovative blockchain solutions. Prizes worth $25,000 for top teams.",
      type: "hackathon",
      category: "blockchain",
      date: "2024-05-10",
      time: "18:00 - 18:00",
      location: "Crypto Innovation Lab",
      isOnline: false,
      attendees: 120,
      maxAttendees: 150,
      price: "Free",
      isFree: true,
      organizer: "Blockchain Foundation",
      speakers: [
        { name: "Priya Patel", role: "Blockchain Architect", company: "Ethereum Foundation" }
      ],
      tags: ["Blockchain", "Web3", "Smart Contracts", "DeFi"],
      isBookmarked: true,
      isRegistered: false,
      rating: 4.6,
      reviews: 45
    },
    {
      id: 6,
      title: "DevOps & Cloud Infrastructure Meetup",
      description: "Monthly meetup discussing latest trends in DevOps, cloud infrastructure, and automation tools.",
      type: "meetup",
      category: "devops",
      date: "2024-04-18",
      time: "19:00 - 21:00",
      location: "Tech Hub Downtown",
      isOnline: false,
      attendees: 85,
      maxAttendees: 100,
      price: "Free",
      isFree: true,
      organizer: "DevOps Community",
      speakers: [
        { name: "Tom Chen", role: "DevOps Engineer", company: "AWS" },
        { name: "Anna Smith", role: "Cloud Architect", company: "Google Cloud" }
      ],
      tags: ["DevOps", "Cloud", "Automation", "Infrastructure"],
      isBookmarked: false,
      isRegistered: false,
      rating: 4.5,
      reviews: 34
    }
  ];

  const aiOpportunities = [
    {
      id: 1,
      title: "Senior React Developer at TechCorp",
      type: "job",
      company: "TechCorp",
      location: "Remote",
      salary: "$120k - $150k",
      matchScore: 95,
      reason: "Perfect match based on your React expertise and full-stack experience",
      posted: "2 days ago",
      category: "web-development",
      requirements: ["React", "TypeScript", "Node.js", "5+ years experience"],
      isRemote: true,
      isUrgent: true
    },
    {
      id: 2,
      title: "AI/ML Consultant Project",
      type: "freelance",
      company: "Innovation Labs",
      location: "Remote",
      salary: "$80 - $120/hour",
      matchScore: 88,
      reason: "Your Python and AI skills make you ideal for this machine learning project",
      posted: "1 week ago",
      category: "ai-ml",
      requirements: ["Python", "TensorFlow", "Machine Learning", "3+ years experience"],
      isRemote: true,
      isUrgent: false
    },
    {
      id: 3,
      title: "Startup Co-founder Opportunity",
      type: "partnership",
      company: "Stealth Startup",
      location: "San Francisco",
      salary: "Equity + $80k",
      matchScore: 92,
      reason: "Your technical leadership skills and innovation background are exactly what we need",
      posted: "3 days ago",
      category: "entrepreneurship",
      requirements: ["Technical Leadership", "Product Development", "Startup Experience"],
      isRemote: false,
      isUrgent: true
    }
  ];

  const categories = [
    { value: "all", label: "All Events", icon: Calendar, count: events.length },
    { value: "ai-ml", label: "AI & ML", icon: Brain, count: events.filter(e => e.category === "ai-ml").length },
    { value: "web-development", label: "Web Dev", icon: Code, count: events.filter(e => e.category === "web-development").length },
    { value: "design", label: "Design", icon: Palette, count: events.filter(e => e.category === "design").length },
    { value: "blockchain", label: "Blockchain", icon: Database, count: events.filter(e => e.category === "blockchain").length },
    { value: "devops", label: "DevOps", icon: Cloud, count: events.filter(e => e.category === "devops").length },
    { value: "entrepreneurship", label: "Startup", icon: Rocket, count: events.filter(e => e.category === "entrepreneurship").length }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'conference': return 'text-blue-400 bg-blue-500/20';
      case 'workshop': return 'text-green-400 bg-green-500/20';
      case 'competition': return 'text-yellow-400 bg-yellow-500/20';
      case 'masterclass': return 'text-purple-400 bg-purple-500/20';
      case 'hackathon': return 'text-orange-400 bg-orange-500/20';
      case 'meetup': return 'text-cyan-400 bg-cyan-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getFilteredEvents = () => {
    let filtered = events;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const handleBookmarkEvent = (eventId: number) => {
    setBookmarkedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleRegisterEvent = (eventId: number) => {
    // In a real app, this would handle event registration
    console.log(`Registered for event ${eventId}`);
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
                <h1 className="text-4xl font-bold gradient-text mb-2">Events & Opportunities</h1>
                <p className="text-foreground-secondary">
                  Discover upcoming events, workshops, and career opportunities tailored for you
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="hero">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
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

          {/* AI Opportunities Panel */}
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
                      <h3 className="text-lg font-semibold text-foreground">AI-Curated Opportunities</h3>
                      <p className="text-sm text-foreground-secondary">Personalized job and project recommendations</p>
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
                  {aiOpportunities.map((opportunity, index) => (
                    <motion.div
                      key={opportunity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    >
                      <GlassCard className="hover:scale-105 transition-transform">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">{opportunity.title}</h4>
                            <p className="text-sm text-foreground-secondary">{opportunity.company}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              opportunity.type === 'job' ? 'bg-blue-500/20 text-blue-400' :
                              opportunity.type === 'freelance' ? 'bg-green-500/20 text-green-400' :
                              'bg-purple-500/20 text-purple-400'
                            }`}>
                              {opportunity.type}
                            </span>
                            {opportunity.isUrgent && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                                Urgent
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-foreground-secondary mb-3">{opportunity.reason}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-foreground">{opportunity.salary}</span>
                          <span className="text-xs text-foreground-secondary">{opportunity.posted}</span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-foreground-secondary">Match Score</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted/30 rounded-full h-2">
                              <motion.div 
                                className="bg-gradient-primary h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${opportunity.matchScore}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              />
                            </div>
                            <span className="text-xs text-foreground">{opportunity.matchScore}%</span>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Details
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
                { value: "upcoming", label: "Upcoming", icon: Calendar },
                { value: "bookmarked", label: "Bookmarked", icon: Bookmark },
                { value: "registered", label: "Registered", icon: CheckCircle },
                { value: "past", label: "Past Events", icon: Clock }
              ].map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Upcoming Events Tab */}
            <TabsContent value="upcoming" className="space-y-8">
              {/* Filters */}
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
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
                        <input
                          type="text"
                          placeholder="Search events..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 bg-muted/20 border border-border/30 rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Events Grid */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <AnimatePresence>
                  {getFilteredEvents().map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      layout
                    >
                      <GlassCard className="hover:scale-105 transition-all duration-300">
                        {/* Event Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                            <p className="text-sm text-foreground-secondary line-clamp-2">{event.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                              {event.type}
                            </span>
                            {event.isFree && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                                Free
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                            {event.isOnline ? (
                              <>
                                <Wifi className="w-4 h-4" />
                                Online Event
                              </>
                            ) : (
                              <>
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                            <Users className="w-4 h-4" />
                            {event.attendees}/{event.maxAttendees} attendees
                          </div>
                          <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            {event.rating} ({event.reviews} reviews)
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {event.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span 
                                key={tagIndex}
                                className="px-2 py-1 bg-muted/20 text-foreground-secondary rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {event.tags.length > 3 && (
                              <span className="px-2 py-1 bg-muted/20 text-foreground-secondary rounded text-xs">
                                +{event.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {event.isRegistered ? (
                            <Button variant="default" size="sm" className="flex-1" disabled>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Registered
                            </Button>
                          ) : (
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleRegisterEvent(event.id)}
                            >
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              Register
                            </Button>
                          )}
                          
                          <motion.button
                            onClick={() => handleBookmarkEvent(event.id)}
                            className="p-2 hover:bg-muted/20 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Bookmark className={`w-4 h-4 ${
                              bookmarkedEvents.includes(event.id) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-foreground-secondary'
                            }`} />
                          </motion.button>
                          
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
            <TabsContent value="bookmarked" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard className="text-center py-12">
                  <Bookmark className="w-16 h-16 mx-auto mb-4 text-foreground-secondary opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Bookmarked Events</h3>
                  <p className="text-foreground-secondary">
                    Events you've bookmarked will appear here.
                  </p>
                </GlassCard>
              </motion.div>
            </TabsContent>

            <TabsContent value="registered" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard className="text-center py-12">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-foreground-secondary opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Registered Events</h3>
                  <p className="text-foreground-secondary">
                    Events you've registered for will appear here.
                  </p>
                </GlassCard>
              </motion.div>
            </TabsContent>

            <TabsContent value="past" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard className="text-center py-12">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-foreground-secondary opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Past Events</h3>
                  <p className="text-foreground-secondary">
                    Your past event history will be displayed here.
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
