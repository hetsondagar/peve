import { useState } from "react";
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
  BellRing
} from "lucide-react";

export default function Notifications() {
  const [filter, setFilter] = useState("all");

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
      action: "View Project"
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
      action: "Reply"
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

  const getFilteredNotifications = () => {
    if (filter === "all") return notifications;
    return notifications.filter(n => n.type === filter);
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Notifications</h1>
              <p className="text-foreground-secondary">
                Stay updated with the latest activities and updates
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-foreground-secondary">
                <BellRing className="w-5 h-5" />
                <span className="text-sm">{unreadCount} unread</span>
              </div>
              <Button variant="outline" onClick={markAllAsRead}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </div>

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
              {getFilteredNotifications().map((notification, index) => (
                <GlassCard 
                  key={notification.id} 
                  className={`animate-fade-in transition-all duration-300 hover:scale-[1.01] ${
                    !notification.read ? 'border-l-4 border-l-primary glow-primary' : ''
                  }`}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar or Icon */}
                    <div className="flex-shrink-0">
                      {notification.avatar ? (
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-foreground font-semibold">
                          {notification.avatar}
                        </div>
                      ) : (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          notification.type === 'system' ? 'bg-gradient-accent' :
                          notification.type === 'personal' ? 'bg-gradient-secondary' :
                          'bg-gradient-primary'
                        }`}>
                          {getNotificationIcon(notification)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{notification.title}</h3>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-foreground-secondary hover:text-foreground transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-foreground-secondary text-sm leading-relaxed mb-3">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground-secondary">
                          {notification.time}
                        </span>
                        
                        {notification.action && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:scale-105 transition-transform"
                          >
                            {notification.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}

              {getFilteredNotifications().length === 0 && (
                <GlassCard className="text-center py-12">
                  <Bell className="w-16 h-16 mx-auto mb-4 text-foreground-secondary opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No notifications</h3>
                  <p className="text-foreground-secondary">
                    You're all caught up! Check back later for new updates.
                  </p>
                </GlassCard>
              )}
            </TabsContent>
          </Tabs>

          {/* Notification Settings Quick Access */}
          <GlassCard className="mt-8 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Notification Preferences</h3>
                <p className="text-sm text-foreground-secondary">
                  Customize when and how you receive notifications
                </p>
              </div>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}