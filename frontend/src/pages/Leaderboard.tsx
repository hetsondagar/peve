import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NetworkBackground } from '@/components/NetworkBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Zap, Crown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import SearchBar from '@/components/SearchBar';


export default function Leaderboard() {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const [leaderboardResponse, badgesResponse, rankResponse] = await Promise.all([
          apiFetch('/api/leaderboard'),
          apiFetch('/api/leaderboard/badges'),
          apiFetch('/api/leaderboard/rank')
        ]);

        console.log('Leaderboard response:', leaderboardResponse);
        console.log('Badges response:', badgesResponse);
        console.log('Rank response:', rankResponse);

        if (leaderboardResponse.success && leaderboardResponse.data) {
          setLeaderboardData(leaderboardResponse.data);
        }
        if (badgesResponse.success && badgesResponse.data) {
          setUserBadges(badgesResponse.data);
        }
        if (rankResponse.success && rankResponse.data) {
          setUserRank(rankResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load leaderboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
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
                <button onClick={() => navigate('/codetalks')} className="text-muted-foreground hover:text-primary transition-colors">CodeTalks</button>
                <button onClick={() => navigate('/leaderboard')} className="text-primary">Leaderboard</button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <SearchBar />
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
                    <button onClick={() => { navigate('/codetalks'); setShowProfileDropdown(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10">CodeTalks</button>
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Every <span className="gradient-text">buzz</span> counts</h1>
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
                  {loading ? (
                    <div className="text-center py-4 text-muted-foreground">Loading badges...</div>
                  ) : userBadges.length > 0 ? (
                    userBadges.map((badge, index) => (
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
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">No badges yet</div>
                  )}
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
                    {loading ? (
                      <div className="text-center py-4 text-muted-foreground">Loading leaderboard...</div>
                    ) : leaderboardData.length > 0 ? (
                      leaderboardData.map((user, index) => (
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
                          <div className="text-3xl">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                                {user.username?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>
                          {user.recentlyActive && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-glow-pulse" />
                          )}
                        </div>

                        {/* Username */}
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">
                            {user.username || user.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {user.badges && user.badges.length > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-sm">{user.badges[0].icon}</span>
                                <span className="text-xs text-muted-foreground">{user.badges[0].name}</span>
                              </div>
                            )}
                            {user.recentlyActive && (
                              <div className="text-xs text-primary flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                Recently active
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">{user.score}</div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No leaderboard data available</div>
                    )}
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
