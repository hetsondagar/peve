import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, Zap, Plus } from 'lucide-react';
import { NetworkBackground } from '@/components/NetworkBackground';
import { GlowButton } from '@/components/ui/glow-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const mockIdeas = [
  { id: 1, username: 'Sarah Chen', avatar: '🧑‍💻', title: 'AI-Powered Code Review Tool', description: 'A collaborative platform that uses AI to provide instant code reviews and suggestions', tags: ['AI', 'DevTools', 'Python'], likes: 42, comments: 12 },
  { id: 2, username: 'Mike Johnson', avatar: '👨‍🎨', title: 'Real-time Whiteboard for Remote Teams', description: 'Interactive whiteboard with video chat integration for distributed teams', tags: ['React', 'WebRTC', 'Collaboration'], likes: 35, comments: 8 },
  { id: 3, username: 'Priya Sharma', avatar: '👩‍🔬', title: 'Blockchain-Based Academic Credentials', description: 'Decentralized system for verifying and sharing educational achievements', tags: ['Blockchain', 'Web3', 'Education'], likes: 28, comments: 15 },
];

export default function IdeaBoard() {
  const navigate = useNavigate();
  const [showPostPanel, setShowPostPanel] = useState(false);
  const [ideaType, setIdeaType] = useState<'brainstorm' | 'build'>('brainstorm');

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
              <button onClick={() => navigate('/ideas')} className="text-primary">Ideas</button>
              <button onClick={() => navigate('/projects')} className="text-muted-foreground hover:text-primary transition-colors">Projects</button>
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
          <h1 className="text-4xl font-bold gradient-text mb-4">Where peers become projects</h1>
          <p className="text-muted-foreground">Share ideas, find collaborators, build the future</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Idea Feed */}
          <div className="lg:col-span-2 space-y-6">
            {mockIdeas.map((idea, index) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-border hover-glow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">{idea.avatar}</div>
                      <div>
                        <div className="font-semibold text-foreground">{idea.username}</div>
                        <div className="text-xs text-muted-foreground">2 hours ago</div>
                      </div>
                    </div>
                    <CardTitle className="group-hover:gradient-text transition-all">{idea.title}</CardTitle>
                    <CardDescription>{idea.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {idea.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-6 pt-4 border-t border-border">
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{idea.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{idea.comments}</span>
                      </button>
                      <GlowButton variant="outline" size="sm" className="ml-auto">
                        <Zap className="w-4 h-4" />
                        Collaborate
                      </GlowButton>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Right: Post Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-6"
            >
              <Card className="glass border-primary/20 glow-turquoise">
                <CardHeader>
                  <CardTitle className="gradient-text">Post Your Idea</CardTitle>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setIdeaType('brainstorm')}
                      className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        ideaType === 'brainstorm' ? 'bg-primary text-primary-foreground' : 'bg-card-secondary text-muted-foreground'
                      }`}
                    >
                      Brainstorm
                    </button>
                    <button
                      onClick={() => setIdeaType('build')}
                      className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        ideaType === 'build' ? 'bg-secondary text-secondary-foreground' : 'bg-card-secondary text-muted-foreground'
                      }`}
                    >
                      Build This
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Idea Title" className="bg-card-secondary border-primary/20" />
                  <Textarea placeholder="Describe your idea..." className="bg-card-secondary border-primary/20 min-h-[120px]" />
                  <Input placeholder="Tags (React, AI, Web3...)" className="bg-card-secondary border-primary/20" />
                  <GlowButton className="w-full">
                    <Plus className="w-4 h-4" />
                    Post to Hive
                  </GlowButton>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
