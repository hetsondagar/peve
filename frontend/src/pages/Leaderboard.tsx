import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Zap, Crown } from 'lucide-react';
import { NetworkBackground } from '@/components/NetworkBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import UsernameWithAvatar from '@/components/UsernameWithAvatar';
import Navbar from '@/components/Navbar';


export default function Leaderboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<any>(null);
  const { toast } = useToast();

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Always fetch leaderboard data (public)
        const leaderboardResponse = await apiFetch('/api/leaderboard');
        console.log('Leaderboard response:', leaderboardResponse);

        if (leaderboardResponse.success && leaderboardResponse.data) {
          setLeaderboardData(leaderboardResponse.data);
        }

        // Try to fetch user-specific data (requires authentication)
        try {
          const [badgesResponse, rankResponse] = await Promise.all([
            apiFetch('/api/leaderboard/badges'),
            apiFetch('/api/leaderboard/rank')
          ]);

          console.log('Badges response:', badgesResponse);
          console.log('Rank response:', rankResponse);

          if (badgesResponse.success && badgesResponse.data) {
            setUserBadges(badgesResponse.data);
          }
          if (rankResponse.success && rankResponse.data) {
            setUserRank(rankResponse.data);
          }
        } catch (authError) {
          console.log('User not authenticated, skipping user-specific data');
          // User is not authenticated, that's okay - just show public leaderboard
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


  return (
    <div className="relative min-h-screen overflow-hidden">
      <NetworkBackground />
      
      <Navbar currentPage="leaderboard" />

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
                        key={user._id || user.rank || index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-card-secondary hover:bg-primary/5 hover-glow transition-all cursor-pointer group"
                        onClick={() => navigate(`/profile/${user._id}`)}
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

                        {/* User Info */}
                        <div className="flex-1">
                          <UsernameWithAvatar
                            username={user.username || user.name || 'Unknown User'}
                            userId={user._id}
                            name={user.name}
                            avatarStyle={user.avatarStyle}
                            avatarUrl={user.avatarUrl}
                            size={32}
                            variant="detailed"
                            className="mb-2"
                          />
                          <div className="flex items-center gap-2">
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
                          <div className="text-xl font-bold text-primary">{user.score || 0}</div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-muted-foreground mb-4">No leaderboard data available</div>
                        <div className="text-sm text-muted-foreground">
                          Be the first to create projects and ideas to appear on the leaderboard!
                        </div>
                      </div>
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
