import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { 
  Home, 
  MessageCircle, 
  Compass, 
  Settings, 
  TrendingUp, 
  Users, 
  Award, 
  Activity,
  Plus,
  Calendar,
  Target,
  Brain,
  Star,
  Clock,
  ArrowRight,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: "Connections", value: "156", change: "+12%", icon: Users, color: "text-blue-400" },
    { label: "Projects", value: "23", change: "+8%", icon: Target, color: "text-green-400" },
    { label: "Messages", value: "47", change: "+23%", icon: MessageCircle, color: "text-purple-400" },
    { label: "Achievements", value: "18", change: "+2", icon: Award, color: "text-yellow-400" }
  ];

  const recentActivity = [
    { user: "Sarah Chen", action: "liked your project", time: "2m ago", avatar: "SC" },
    { user: "Marcus Rodriguez", action: "sent you a message", time: "15m ago", avatar: "MR" },
    { user: "Elena Vasquez", action: "started following you", time: "1h ago", avatar: "EV" },
    { user: "James Wilson", action: "commented on your post", time: "2h ago", avatar: "JW" },
    { user: "Lisa Park", action: "invited you to collaborate", time: "3h ago", avatar: "LP" }
  ];

  const upcomingEvents = [
    { title: "Design Sprint Workshop", time: "Today, 2:00 PM", participants: 12 },
    { title: "Weekly Standup", time: "Tomorrow, 10:00 AM", participants: 8 },
    { title: "Product Demo", time: "Friday, 3:00 PM", participants: 25 }
  ];

  const aiRecommendations = [
    {
      type: "user",
      title: "Connect with Sarah Chen",
      description: "Based on your React skills, you'd work great together on frontend projects",
      avatar: "SC",
      action: "Connect"
    },
    {
      type: "project",
      title: "Join AI Hackathon",
      description: "Perfect match for your machine learning expertise",
      avatar: "AI",
      action: "Join"
    },
    {
      type: "skill",
      title: "Learn TypeScript",
      description: "Boost your profile with this trending skill",
      avatar: "TS",
      action: "Learn"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className="w-64 fixed left-0 top-20 h-[calc(100vh-5rem)] p-6">
          <GlassCard className="h-full">
            <nav className="space-y-2">
              <Button variant="glass" className="w-full justify-start bg-primary/20 border-primary/30">
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </Button>
              <a href="/messages" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <MessageCircle className="mr-3 h-5 w-5" />
                  Messages
                </Button>
              </a>
              <a href="/explore" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <Compass className="mr-3 h-5 w-5" />
                  Explore
                </Button>
              </a>
              <a href="/comparison" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-3 h-5 w-5" />
                  Compare
                </Button>
              </a>
              <a href="/settings" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </Button>
              </a>
            </nav>
          </GlassCard>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold gradient-text mb-2">
                    Welcome back, Alex! 👋
                  </h1>
                  <p className="text-foreground-secondary">
                    Here's what's happening in your network today.
                  </p>
                </div>
                <motion.div 
                  className="text-right"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="text-sm text-foreground-secondary mb-1">
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <GlassCard className="h-full">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div 
                        className="p-3 bg-gradient-primary rounded-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </motion.div>
                      <span className="text-sm text-success font-medium bg-success/10 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-foreground-secondary">{stat.label}</div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Activity Feed */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <GlassCard>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Recent Activity
                      </h2>
                      <Button variant="ghost" size="sm">
                        View All
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-center gap-4 p-3 hover:bg-muted/20 rounded-lg transition-colors cursor-pointer"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-foreground font-semibold text-sm">
                            {activity.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="text-foreground">
                              <span className="font-medium">{activity.user}</span>{" "}
                              <span className="text-foreground-secondary">{activity.action}</span>
                            </p>
                            <p className="text-sm text-foreground-secondary flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.time}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>

                {/* AI Recommendations */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <GlassCard className="glow-purple">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        AI Recommendations
                      </h2>
                      <div className="flex items-center gap-1 text-xs text-foreground-secondary">
                        <Zap className="w-3 h-3" />
                        Powered by AI
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {aiRecommendations.map((rec, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-center gap-4 p-4 bg-muted/10 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors cursor-pointer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center text-foreground font-semibold text-sm">
                            {rec.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground mb-1">{rec.title}</p>
                            <p className="text-sm text-foreground-secondary">{rec.description}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                            {rec.action}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <GlassCard>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="glass" className="w-full justify-start">
                          <Plus className="mr-3 h-4 w-4" />
                          Start New Project
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="ghost" className="w-full justify-start">
                          <MessageCircle className="mr-3 h-4 w-4" />
                          Send Message
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Users className="mr-3 h-4 w-4" />
                          Find Collaborators
                        </Button>
                      </motion.div>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Upcoming Events */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <GlassCard>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        Upcoming
                      </h3>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {upcomingEvents.map((event, index) => (
                        <motion.div 
                          key={index} 
                          className="p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="font-medium text-foreground text-sm mb-1">{event.title}</div>
                          <div className="text-xs text-foreground-secondary mb-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </div>
                          <div className="text-xs text-foreground-secondary flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {event.participants} participants
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Progress Card */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <GlassCard className="glow-purple">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Your Progress
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-foreground-secondary">Profile Completion</span>
                          <span className="text-foreground font-medium">85%</span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-2">
                          <motion.div 
                            className="bg-gradient-primary h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '85%' }}
                            transition={{ duration: 1, delay: 0.8 }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-foreground-secondary">Monthly Goal</span>
                          <span className="text-foreground font-medium">12/15</span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-2">
                          <motion.div 
                            className="bg-gradient-secondary h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '80%' }}
                            transition={{ duration: 1, delay: 1 }}
                          />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}