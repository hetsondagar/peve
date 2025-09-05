import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Users, 
  MessageCircle, 
  Award, 
  Settings, 
  CheckCircle,
  X,
  Star,
  Heart,
  UserPlus,
  Briefcase,
  Calendar,
  TrendingUp,
  Shield,
  BellRing,
  Zap,
  Sparkles,
  Crown,
  Target,
  Eye,
  EyeOff,
  Filter,
  Search,
  MoreVertical,
  Archive,
  Trash2,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Notifications() {
  const [filter, setFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    {
      id: 1,
      type: "social",
      icon: Heart,
      title: "Sarah Chen liked your project",
      message: "Your 'AI-Powered Analytics Dashboard' received a like",
      time: "2 minutes ago",
      read: false,
      avatar: "SC",
      action: "View Project",
      priority: "high",
      category: "engagement",
      metadata: { projectId: "proj_123", userId: "user_456" }
    },
    {
      id: 2,
      type: "social", 
      icon: MessageCircle,
      title: "New message from Marcus Rodriguez",
      message: "I'd love to collaborate on your next project. Are you available for a quick chat?",
      time: "15 minutes ago",
      read: false,
      avatar: "MR",
      action: "Reply",
      priority: "high",
      category: "message",
      metadata: { messageId: "msg_789", userId: "user_123" }
    },
    {
      id: 3,
      type: "system",
      icon: Award,
      title: "Achievement Unlocked!",
      message: "You've earned the 'Innovation Leader' badge for completing 5 breakthrough projects",
      time: "1 hour ago",
      read: false,
      avatar: null,
      action: "View Badge"
    },
    {
      id: 4,
      type: "social",
      icon: UserPlus,
      title: "Elena Vasquez wants to connect",
      message: "Researcher at MIT interested in your AI/ML expertise",
      time: "2 hours ago",
      read: true,
      avatar: "EV",
      action: "Accept"
    },
    {
      id: 5,
      type: "personal",
      icon: Calendar,
      title: "Meeting reminder",
      message: "Design Sprint Workshop starts in 30 minutes",
      time: "3 hours ago",
      read: false,
      avatar: null,
      action: "Join Meeting"
    },
    {
      id: 6,
      type: "system",
      icon: TrendingUp,
      title: "Weekly Report Ready",
      message: "Your productivity increased by 23% this week. View detailed insights.",
      time: "1 day ago",
      read: true,
      avatar: null,
      action: "View Report"
    },
    {
      id: 7,
      type: "social",
      icon: Briefcase,
      title: "Project invitation",
      message: "Lisa Park invited you to collaborate on 'Sustainable E-commerce Platform'",
      time: "1 day ago",
      read: true,
      avatar: "LP",
      action: "View Project"
    },
    {
      id: 8,
      type: "system",
      icon: Shield,
      title: "Security Update",
      message: "Your account security settings have been updated successfully",
      time: "2 days ago",
      read: true,
      avatar: null,
      action: "Review Settings"
    },
    {
      id: 9,
      type: "social",
      icon: Star,
      title: "Project featured",
      message: "Your 'AR Collaboration Tool' has been featured in the community showcase",
      time: "3 days ago",
      read: true,
      avatar: null,
      action: "View Showcase"
    }
  ];

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new notifications coming in
      if (Math.random() > 0.7) {
        const newNotification = {
          id: Date.now(),
          type: "social",
          icon: Math.random() > 0.5 ? Heart : Star,
          title: "New activity detected",
          message: "Someone interacted with your content",
          time: "Just now",
          read: false,
          avatar: "U" + Math.floor(Math.random() * 10),
          action: "View",
          priority: "medium",
          category: "engagement",
          metadata: {}
        };
        // In a real app, this would be handled by a state management system
        console.log("New notification:", newNotification);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    if (filter !== "all") {
      filtered = filtered.filter(n => n.type === filter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (!showArchived) {
      filtered = filtered.filter(n => !n.archived);
    }
    
    return filtered;
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const socialCount = notifications.filter(n => n.type === "social" && !n.read).length;
  const personalCount = notifications.filter(n => n.type === "personal" && !n.read).length;
  const systemCount = notifications.filter(n => n.type === "system" && !n.read).length;

  const markAsRead = (id: number) => {
    // In a real app, this would update the notification state
    console.log(`Marking notification ${id} as read`);
  };

  const markAllAsRead = () => {
    // In a real app, this would mark all notifications as read
    console.log("Marking all notifications as read");
  };

  const getNotificationIcon = (notification: any) => {
    const IconComponent = notification.icon;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Notifications</h1>
              <p className="text-foreground-secondary">
                Stay updated with the latest activities and updates
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.div 
                className="flex items-center gap-2 text-foreground-secondary"
                animate={{ scale: unreadCount > 0 ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BellRing className="w-5 h-5" />
                <span className="text-sm">{unreadCount} unread</span>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" onClick={markAllAsRead}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsRefreshing(true)}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Notification Categories */}
          <Tabs value={filter} onValueChange={setFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass mb-8">
              <TabsTrigger value="all" className="relative">
                All
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full text-xs text-foreground flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="social" className="relative">
                Social
                {socialCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary rounded-full text-xs text-foreground flex items-center justify-center">
                    {socialCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="personal" className="relative">
                Personal
                {personalCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent rounded-full text-xs text-foreground flex items-center justify-center">
                    {personalCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="system" className="relative">
                System
                {systemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-warning rounded-full text-xs text-foreground flex items-center justify-center">
                    {systemCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="space-y-4">
              <AnimatePresence>
                {getFilteredNotifications().map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    layout
                  >
                    <GlassCard 
                      className={`transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                        !notification.read 
                          ? 'border-l-4 border-l-primary glow-primary shadow-glow' 
                          : 'hover:border-border/40'
                      } ${
                        notification.priority === 'high' 
                          ? 'ring-2 ring-primary/20' 
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar or Icon */}
                        <div className="flex-shrink-0">
                          {notification.avatar ? (
                            <motion.div 
                              className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-foreground font-semibold relative"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {notification.avatar}
                              {!notification.read && (
                                <motion.div
                                  className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              )}
                            </motion.div>
                          ) : (
                            <motion.div 
                              className={`w-12 h-12 rounded-full flex items-center justify-center relative ${
                                notification.type === 'system' ? 'bg-gradient-accent' :
                                notification.type === 'personal' ? 'bg-gradient-secondary' :
                                'bg-gradient-primary'
                              }`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {getNotificationIcon(notification)}
                              {!notification.read && (
                                <motion.div
                                  className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              )}
                            </motion.div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-foreground">{notification.title}</h3>
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <motion.div 
                                  className="w-2 h-2 bg-primary rounded-full"
                                  animate={{ scale: [1, 1.5, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                />
                              )}
                              <motion.button
                                onClick={() => markAsRead(notification.id)}
                                className="text-foreground-secondary hover:text-foreground transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <X className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                          
                          <p className="text-foreground-secondary text-sm leading-relaxed mb-3">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-foreground-secondary">
                                {notification.time}
                              </span>
                              {notification.priority === 'high' && (
                                <motion.span 
                                  className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium"
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  High Priority
                                </motion.span>
                              )}
                            </div>
                            
                            {notification.action && (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="transition-transform"
                                >
                                  {notification.action}
                                </Button>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>

              {getFilteredNotifications().length === 0 && (
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
                      <Bell className="w-16 h-16 mx-auto mb-4 text-foreground-secondary opacity-50" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No notifications</h3>
                    <p className="text-foreground-secondary">
                      You're all caught up! Check back later for new updates.
                    </p>
                  </GlassCard>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>

          {/* Notification Settings Quick Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard className="mt-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Notification Preferences
                  </h3>
                  <p className="text-sm text-foreground-secondary">
                    Customize when and how you receive notifications
                  </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}