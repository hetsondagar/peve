import { useState } from 'react';
import { motion } from 'framer-motion';
import { NetworkBackground } from '@/components/NetworkBackground';
import { ProjectCard } from '@/components/ProjectCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { GlowButton } from '@/components/ui/glow-button';
import { Github, ExternalLink, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockProjects = [
  { id: 1, title: 'AI Task Manager', description: 'Smart productivity app with AI-powered task prioritization and time tracking', tags: ['React', 'Node.js', 'AI'], likes: 156, comments: 43, teamSize: 3, image: null },
  { id: 2, title: 'Decentralized Social Network', description: 'Privacy-first social platform built on blockchain technology', tags: ['Web3', 'Solidity', 'IPFS'], likes: 203, comments: 67, teamSize: 5, image: null },
  { id: 3, title: 'Collaborative Code Editor', description: 'Real-time code collaboration tool with video chat and AI assistance', tags: ['TypeScript', 'WebRTC', 'Monaco'], likes: 189, comments: 54, teamSize: 4, image: null },
  { id: 4, title: 'Smart Home Dashboard', description: 'IoT control center with machine learning for automation patterns', tags: ['Python', 'IoT', 'ML'], likes: 142, comments: 38, teamSize: 2, image: null },
];

export default function Projects() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<typeof mockProjects[0] | null>(null);

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
              <button onClick={() => navigate('/ideas')} className="text-muted-foreground hover:text-primary transition-colors">Ideas</button>
              <button onClick={() => navigate('/projects')} className="text-primary">Projects</button>
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
          <h1 className="text-4xl font-bold gradient-text mb-4">Project Showcase</h1>
          <p className="text-muted-foreground">Explore amazing projects built by the hive</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project, index) => (
            <div key={project.id} onClick={() => setSelectedProject(project)}>
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="glass border-primary/20 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl gradient-text">{selectedProject?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Project Image Placeholder */}
            <div className="h-64 rounded-xl bg-gradient-primary opacity-20" />
            
            <p className="text-muted-foreground">{selectedProject?.description}</p>
            
            {/* Tech Stack */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject?.tags.map((tag, i) => (
                  <Badge key={i} className="bg-primary/10 text-primary border-primary/20">{tag}</Badge>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Team Members</h3>
              <div className="flex gap-2">
                {Array.from({ length: selectedProject?.teamSize || 0 }).map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-xl">
                    👤
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{selectedProject?.likes}</div>
                <div className="text-xs text-muted-foreground">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{selectedProject?.comments}</div>
                <div className="text-xs text-muted-foreground">Comments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">1.2k</div>
                <div className="text-xs text-muted-foreground">Views</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <GlowButton className="flex-1">
                <Github className="w-4 h-4" />
                View on GitHub
              </GlowButton>
              <GlowButton variant="violet" className="flex-1">
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </GlowButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
