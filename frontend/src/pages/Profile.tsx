import { motion } from 'framer-motion';
import { NetworkBackground } from '@/components/NetworkBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GlowButton } from '@/components/ui/glow-button';
import { Trophy, Lightbulb, Rocket, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const achievements = [
  { year: '2025', month: 'Jan', title: 'First Collaboration', description: 'Joined a project team and made first contribution', icon: Users, color: 'primary' },
  { year: '2024', month: 'Dec', title: 'Idea Pioneer', description: 'Shared 10 innovative ideas with the hive', icon: Lightbulb, color: 'secondary' },
  { year: '2024', month: 'Nov', title: 'Project Launch', description: 'Successfully launched first full-stack project', icon: Rocket, color: 'accent' },
  { year: '2024', month: 'Oct', title: 'Top Contributor', description: 'Ranked in top 10 for monthly contributions', icon: Trophy, color: 'primary' },
];

const myProjects = [
  { name: 'AI Task Manager', status: 'Live', tech: ['React', 'Node.js', 'AI'] },
  { name: 'Blockchain Wallet', status: 'In Progress', tech: ['Web3', 'Solidity'] },
  { name: 'Code Collab Tool', status: 'Live', tech: ['TypeScript', 'WebRTC'] },
];

const myIdeas = [
  { title: 'Smart Home Dashboard', engagement: '42 likes' },
  { title: 'AR Learning Platform', engagement: '35 likes' },
  { title: 'Decentralized Storage', engagement: '28 likes' },
];

const connections = [
  { name: 'Sarah Chen', avatar: '🧑‍💻', compatibility: 95 },
  { name: 'Mike Johnson', avatar: '👨‍🎨', compatibility: 88 },
  { name: 'Priya Sharma', avatar: '👩‍🔬', compatibility: 92 },
  { name: 'Alex Rivera', avatar: '👨‍💼', compatibility: 85 },
  { name: 'Emma Wilson', avatar: '👩‍💻', compatibility: 90 },
];

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background">
      <NetworkBackground />
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <img src={'/final.png'} alt="peve" className="w-12 h-12" />
              <button onClick={() => navigate('/home')} className="text-2xl font-bold brand-peve">peve</button>
            </div>
            <div className="hidden md:flex gap-6">
              <button onClick={() => navigate('/home')} className="text-muted-foreground hover:text-primary transition-colors">Explore</button>
              <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-primary transition-colors">Dashboard</button>
              <button onClick={() => navigate('/profile')} className="text-primary">Profile</button>
            </div>
          </div>
          <div className="text-3xl">👤</div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="glass border-primary/20 glow-turquoise text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-primary mx-auto flex items-center justify-center text-5xl">
                    👤
                  </div>
                  <div>
                    <h2 className="text-xl font-bold gradient-text">Alex Developer</h2>
                    <p className="text-sm text-muted-foreground">Full-Stack Engineer</p>
                  </div>
                  <Badge className="bg-primary/20 text-primary">92% Compatibility</Badge>
                  <div className="pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Projects</span>
                      <span className="text-foreground font-semibold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ideas</span>
                      <span className="text-foreground font-semibold">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connections</span>
                      <span className="text-foreground font-semibold">156</span>
                    </div>
                  </div>
                  <GlowButton variant="outline" size="sm" className="w-full">
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </GlowButton>
                </CardContent>
              </Card>
            </motion.div>

            {/* Hive Connections */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="text-sm">Hive Connections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-center gap-2 flex-wrap">
                    {connections.map((connection, i) => (
                      <motion.div
                        key={connection.name}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="relative group cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-2xl hover-glow">
                          {connection.avatar}
                        </div>
                        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity animate-glow-pulse" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Center - Achievement Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold gradient-text mb-6">Achievements Timeline</h2>
              
              <div className="relative">
                {/* Vertical glowing line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent opacity-50" />
                
                <div className="space-y-8">
                  {achievements.map((achievement, index) => {
                    const IconComponent = achievement.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 }}
                        className="relative pl-16"
                      >
                        {/* Icon Node */}
                        <div className={`absolute left-0 w-12 h-12 rounded-full bg-${achievement.color} flex items-center justify-center glow-turquoise`}>
                          <IconComponent className="w-6 h-6 text-primary-foreground" />
                        </div>

                        <Card className="glass border-border hover-glow cursor-pointer group">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-foreground group-hover:gradient-text transition-all">
                                {achievement.title}
                              </h3>
                              <Badge variant="outline" className="text-xs">{achievement.month} {achievement.year}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - Projects & Ideas */}
          <div className="lg:col-span-1 space-y-6">
            {/* My Projects */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-accent" />
                    My Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {myProjects.map((project, i) => (
                    <div key={i} className="p-3 rounded-xl bg-card-secondary hover:bg-primary/5 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-foreground">{project.name}</div>
                        <Badge className={`text-xs ${
                          project.status === 'Live' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                        }`}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.tech.map((tech, j) => (
                          <span key={j} className="text-xs text-muted-foreground">{tech}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* My Ideas */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-secondary" />
                    My Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {myIdeas.map((idea, i) => (
                    <div key={i} className="p-3 rounded-xl bg-card-secondary hover:bg-primary/5 transition-colors cursor-pointer">
                      <div className="text-sm font-semibold text-foreground mb-1">{idea.title}</div>
                      <div className="text-xs text-muted-foreground">{idea.engagement}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
