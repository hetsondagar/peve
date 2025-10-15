import { motion } from 'framer-motion';
import { NetworkBackground } from '@/components/NetworkBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const badges = [
  { name: 'Top Collaborator', icon: '🤝', description: 'Worked on 10+ projects', unlocked: true },
  { name: 'Idea Bee', icon: '💡', description: 'Shared 25+ ideas', unlocked: true },
  { name: 'Project Master', icon: '🚀', description: 'Completed 5 projects', unlocked: true },
  { name: 'Hive Leader', icon: '👑', description: 'Top 10 on leaderboard', unlocked: false },
  { name: 'Code Wizard', icon: '🧙', description: '1000+ contributions', unlocked: false },
  { name: 'Design Guru', icon: '🎨', description: 'Outstanding UI/UX work', unlocked: false },
];

const leaderboard = [
  { rank: 1, username: 'Sarah Chen', avatar: '🧑‍💻', score: 2450, recentlyActive: true },
  { rank: 2, username: 'Alex Rivera', avatar: '👨‍🎨', score: 2380, recentlyActive: true },
  { rank: 3, username: 'Priya Sharma', avatar: '👩‍🔬', score: 2210, recentlyActive: false },
  { rank: 4, username: 'David Kim', avatar: '👨‍💼', score: 2150, recentlyActive: true },
  { rank: 5, username: 'Emma Wilson', avatar: '👩‍💻', score: 2090, recentlyActive: false },
  { rank: 6, username: 'Carlos Garcia', avatar: '👨‍🔧', score: 1980, recentlyActive: true },
  { rank: 7, username: 'Lisa Anderson', avatar: '👩‍🚀', score: 1875, recentlyActive: false },
  { rank: 8, username: 'James Brown', avatar: '👨‍🎓', score: 1820, recentlyActive: true },
];

export default function Leaderboard() {
  const navigate = useNavigate();

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
              <button onClick={() => navigate('/leaderboard')} className="text-primary">Leaderboard</button>
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">Every buzz counts</h1>
          <p className="text-muted-foreground">Celebrate achievements and climb the ranks</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Badges Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="glass border-primary/20 glow-turquoise">
                <CardHeader>
                  <CardTitle className="gradient-text flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Your Badges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {badges.map((badge, index) => (
                    <motion.div
                      key={badge.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border transition-all ${
                        badge.unlocked
                          ? 'bg-primary/10 border-primary/30 glow-turquoise'
                          : 'bg-card-secondary border-border opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{badge.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground text-sm">{badge.name}</div>
                          <div className="text-xs text-muted-foreground">{badge.description}</div>
                        </div>
                        {badge.unlocked && <Badge className="bg-primary/20 text-primary">✓</Badge>}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Leaderboard Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-accent" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leaderboard.map((user, index) => (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-card-secondary hover:bg-primary/5 hover-glow transition-all cursor-pointer group"
                      >
                        {/* Rank */}
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                          user.rank === 1 ? 'bg-accent text-accent-foreground' :
                          user.rank === 2 ? 'bg-secondary text-secondary-foreground' :
                          user.rank === 3 ? 'bg-primary/20 text-primary' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {user.rank === 1 ? <Crown className="w-5 h-5" /> : user.rank}
                        </div>

                        {/* Avatar */}
                        <div className="relative">
                          <div className="text-3xl">{user.avatar}</div>
                          {user.recentlyActive && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-glow-pulse" />
                          )}
                        </div>

                        {/* Username */}
                        <div className="flex-1">
                          <div className="font-semibold text-foreground group-hover:gradient-text transition-all">
                            {user.username}
                          </div>
                          {user.recentlyActive && (
                            <div className="text-xs text-primary flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Recently active
                            </div>
                          )}
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">{user.score}</div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
