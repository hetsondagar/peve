import { motion } from 'framer-motion';
import { NetworkBackground } from '@/components/NetworkBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Lightbulb, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { title: 'Ideas Shared', value: '24', icon: Lightbulb, color: 'text-primary' },
    { title: 'Projects Built', value: '8', icon: Rocket, color: 'text-secondary' },
    { title: 'Peers Connected', value: '156', icon: Users, color: 'text-accent' },
    { title: 'Collaboration Score', value: '92%', icon: TrendingUp, color: 'text-primary' },
  ];

  const weeklyData = [
    { day: 'Mon', score: 65 },
    { day: 'Tue', score: 75 },
    { day: 'Wed', score: 82 },
    { day: 'Thu', score: 78 },
    { day: 'Fri', score: 88 },
    { day: 'Sat', score: 92 },
    { day: 'Sun', score: 90 },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      <NetworkBackground />
      
      {/* Navbar */}
      <nav className="relative z-10 border-b border-border glass">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={() => navigate('/home')} className="text-2xl font-bold gradient-text">Peve</button>
            <div className="hidden md:flex gap-6">
              <button onClick={() => navigate('/home')} className="text-muted-foreground hover:text-primary transition-colors">Explore</button>
              <button onClick={() => navigate('/dashboard')} className="text-primary">Dashboard</button>
              <button onClick={() => navigate('/profile')} className="text-muted-foreground hover:text-primary transition-colors">Profile</button>
            </div>
          </div>
          <div className="text-3xl">👤</div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Stats & Insights</h1>
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
