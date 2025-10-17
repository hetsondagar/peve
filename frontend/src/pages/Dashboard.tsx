import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NetworkBackground } from '@/components/NetworkBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Lightbulb, Rocket } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiFetch('/api/dashboard/stats');
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Use real data from backend or fallback to sample data
  const stats = dashboardData?.stats ? [
    { title: 'Ideas Shared', value: dashboardData.stats.ideasShared.toString(), icon: Lightbulb, color: 'text-primary' },
    { title: 'Projects Built', value: dashboardData.stats.projectsBuilt.toString(), icon: Rocket, color: 'text-secondary' },
    { title: 'Peers Connected', value: dashboardData.stats.peersConnected.toString(), icon: Users, color: 'text-accent' },
    { title: 'Collaboration Score', value: dashboardData.stats.collaborationScore, icon: TrendingUp, color: 'text-primary' },
  ] : [
    { title: 'Ideas Shared', value: '0', icon: Lightbulb, color: 'text-primary' },
    { title: 'Projects Built', value: '0', icon: Rocket, color: 'text-secondary' },
    { title: 'Peers Connected', value: '0', icon: Users, color: 'text-accent' },
    { title: 'Collaboration Score', value: '0%', icon: TrendingUp, color: 'text-primary' },
  ];

  const weeklyData = dashboardData?.weeklyActivity || [
    { day: 'Mon', score: 0 },
    { day: 'Tue', score: 0 },
    { day: 'Wed', score: 0 },
    { day: 'Thu', score: 0 },
    { day: 'Fri', score: 0 },
    { day: 'Sat', score: 0 },
    { day: 'Sun', score: 0 },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NetworkBackground />
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Nav */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <img src={'/final.png'} alt="peve" className="w-12 h-12" />
                <button onClick={() => navigate('/home')} className="text-2xl font-bold brand-peve">peve</button>
              </div>
              <div className="hidden md:flex gap-6">
                <button onClick={() => navigate('/home')} className="text-muted-foreground hover:text-primary transition-colors">Explore</button>
                <button onClick={() => navigate('/ideas')} className="text-muted-foreground hover:text-primary transition-colors">Ideas</button>
                <button onClick={() => navigate('/projects')} className="text-muted-foreground hover:text-primary transition-colors">Projects</button>
                <button onClick={() => navigate('/dashboard')} className="text-primary">Dashboard</button>
                <button onClick={() => navigate('/leaderboard')} className="text-muted-foreground hover:text-primary transition-colors">Leaderboard</button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search projects, ideas, peers..."
                  className="pl-12 bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-11"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <User className="w-5 h-5 text-muted-foreground" />
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl glass border border-border p-2 z-50">
                    <button onClick={() => { navigate('/profile'); setShowProfileDropdown(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10">Profile</button>
                    <button onClick={() => { navigate('/dashboard'); setShowProfileDropdown(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10">Dashboard</button>
                    <button onClick={() => { localStorage.removeItem('peve_token'); navigate('/login'); setShowProfileDropdown(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10">Log out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2"><span className="gradient-text">Stats</span> & Insights</h1>
          <p className="text-muted-foreground">Track your hive activity and growth</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass border-border hover-glow group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Weekly Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border-primary/20 glow-turquoise">
            <CardHeader>
              <CardTitle className="gradient-text">Weekly Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-4">
                {weeklyData.map((data, index) => (
                  <motion.div
                    key={data.day}
                    initial={{ height: 0 }}
                    animate={{ height: `${data.score}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-primary rounded-t-lg relative group cursor-pointer"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">{data.score}%</div>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                      {data.day}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle>Recent Interactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { action: 'Collaborated on', item: 'AI Task Manager', time: '2 hours ago' },
                { action: 'Liked', item: 'Blockchain Social Network', time: '5 hours ago' },
                { action: 'Commented on', item: 'Real-time Code Editor', time: '1 day ago' },
                { action: 'Shared idea', item: 'Smart Home Dashboard', time: '2 days ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-card-secondary hover:bg-primary/5 transition-colors cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
                  <div className="flex-1">
                    <div className="text-sm text-foreground">
                      {activity.action} <span className="text-primary font-semibold">{activity.item}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
