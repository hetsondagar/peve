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
  Target
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "Connections", value: "156", change: "+12%", icon: Users },
    { label: "Projects", value: "23", change: "+8%", icon: Target },
    { label: "Messages", value: "47", change: "+23%", icon: MessageCircle },
    { label: "Achievements", value: "18", change: "+2", icon: Award }
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold gradient-text mb-2">Welcome back, Alex!</h1>
              <p className="text-foreground-secondary">Here's what's happening in your network today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <GlassCard 
                  key={stat.label} 
                  className="animate-scale-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <stat.icon className="w-5 h-5 text-foreground" />
                    </div>
                    <span className="text-sm text-success font-medium">{stat.change}</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-foreground-secondary">{stat.label}</div>
                  </div>
                </GlassCard>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Activity Feed */}
              <div className="lg:col-span-2">
                <GlassCard className="animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
                    <Button variant="ghost" size="sm">
                      <Activity className="w-4 h-4 mr-2" />
                      View All
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-4 p-3 hover:bg-muted/20 rounded-lg transition-colors"
                      >
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-foreground font-semibold text-sm">
                          {activity.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground">
                            <span className="font-medium">{activity.user}</span>{" "}
                            <span className="text-foreground-secondary">{activity.action}</span>
                          </p>
                          <p className="text-sm text-foreground-secondary">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <GlassCard className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="glass" className="w-full justify-start">
                      <Plus className="mr-3 h-4 w-4" />
                      Start New Project
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <MessageCircle className="mr-3 h-4 w-4" />
                      Send Message
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="mr-3 h-4 w-4" />
                      Find Collaborators
                    </Button>
                  </div>
                </GlassCard>

                {/* Upcoming Events */}
                <GlassCard className="animate-fade-in" style={{animationDelay: '0.4s'}}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Upcoming</h3>
                    <Calendar className="w-5 h-5 text-foreground-secondary" />
                  </div>
                  <div className="space-y-3">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="p-3 bg-muted/20 rounded-lg">
                        <div className="font-medium text-foreground text-sm mb-1">{event.title}</div>
                        <div className="text-xs text-foreground-secondary mb-2">{event.time}</div>
                        <div className="text-xs text-foreground-secondary">
                          {event.participants} participants
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Progress Card */}
                <GlassCard className="animate-fade-in glow-purple" style={{animationDelay: '0.6s'}}>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Your Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground-secondary">Profile Completion</span>
                        <span className="text-foreground font-medium">85%</span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div className="bg-gradient-primary h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground-secondary">Monthly Goal</span>
                        <span className="text-foreground font-medium">12/15</span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div className="bg-gradient-secondary h-2 rounded-full" style={{width: '80%'}}></div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}