import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NetworkBackground } from '@/components/NetworkBackground';
import { ProjectCard } from '@/components/ProjectCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { GlowButton } from '@/components/ui/glow-button';
import { Github, ExternalLink, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import ProjectSubmissionForm from '@/components/ProjectSubmissionForm';
import { CommentModal } from '@/components/CommentModal';
import Navbar from '@/components/Navbar';

const mockProjects = [
  { id: 1, title: 'AI Task Manager', description: 'Smart productivity app with AI-powered task prioritization and time tracking', tags: ['React', 'Node.js', 'AI'], likes: 156, comments: 43, teamSize: 3, image: null },
  { id: 2, title: 'Decentralized Social Network', description: 'Privacy-first social platform built on blockchain technology', tags: ['Web3', 'Solidity', 'IPFS'], likes: 203, comments: 67, teamSize: 5, image: null },
  { id: 3, title: 'Collaborative Code Editor', description: 'Real-time code collaboration tool with video chat and AI assistance', tags: ['TypeScript', 'WebRTC', 'Monaco'], likes: 189, comments: 54, teamSize: 4, image: null },
  { id: 4, title: 'Smart Home Dashboard', description: 'IoT control center with machine learning for automation patterns', tags: ['Python', 'IoT', 'ML'], likes: 142, comments: 38, teamSize: 2, image: null },
];

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedProjectForComment, setSelectedProjectForComment] = useState<any>(null);
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());
  const [savedProjects, setSavedProjects] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiFetch('/api/projects');
        const projectsData = response.data.items || [];
        setProjects(projectsData);
        
        // Fetch interaction status for all projects
        if (projectsData.length > 0) {
          try {
            const interactionResponse = await apiFetch('/api/interactions/status', {
              method: 'POST',
              body: JSON.stringify({
                items: projectsData.map((project: any) => ({
                  targetType: 'project',
                  targetId: project._id
                }))
              })
            });
            
            if (interactionResponse.success) {
              const likedSet = new Set<string>();
              const savedSet = new Set<string>();
              
              interactionResponse.data.forEach((status: any) => {
                if (status.isLiked) likedSet.add(status.targetId);
                if (status.isSaved) savedSet.add(status.targetId);
              });
              
              setLikedProjects(likedSet);
              setSavedProjects(savedSet);
            }
          } catch (interactionError) {
            console.error('Failed to fetch interaction status:', interactionError);
          }
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);


  const handleLikeProject = (projectId: string) => {
    setLikedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });

    // Update projects list
    setProjects((prev: any) => prev.map((project: any) => 
      project._id === projectId 
        ? { ...project, metrics: { ...project.metrics, likes: project.metrics.likes + (likedProjects.has(projectId) ? -1 : 1) } }
        : project
    ));
  };

  const handleOpenCommentModal = (project: any) => {
    setSelectedProjectForComment(project);
    setShowCommentModal(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NetworkBackground />
      
      <Navbar currentPage="projects" />

      <div className="relative z-10 container mx-auto px-6 py-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold mb-4"><span className="gradient-text">Project</span> Showcase</h1>
              <p className="text-muted-foreground mb-8">Explore amazing projects built by the hive</p>
              <div className="flex justify-center">
                <GlowButton
                  onClick={() => setShowProjectForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Post Project
                </GlowButton>
              </div>
            </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading projects...</div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any, index: number) => (
                     <ProjectCard
                       key={project._id || index}
                       id={project._id}
                       title={project.title}
                       description={project.description}
                       author={project.author}
                       techStack={project.techStack || []}
                       likes={project.metrics?.likes || 0}
                       comments={project.metrics?.comments || 0}
                       views={project.metrics?.views || 0}
                       coverImage={project.coverImage?.url}
                       onLike={handleLikeProject}
                       onComment={handleOpenCommentModal}
                       isLiked={likedProjects.has(project._id)}
                       isSaved={savedProjects.has(project._id)}
                     />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">No projects found. Be the first to share a project!</div>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="glass border-primary/20 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl gradient-text">{selectedProject?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Project Image */}
            {selectedProject?.coverImage?.url ? (
              <div className="w-full rounded-xl overflow-hidden bg-gradient-primary flex items-center justify-center">
                <img 
                  src={selectedProject.coverImage.url} 
                  alt={selectedProject.title}
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            ) : (
              <div className="h-64 rounded-xl bg-gradient-primary opacity-20" />
            )}
            
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

      {/* Project Submission Form */}
      <ProjectSubmissionForm
        isOpen={showProjectForm}
        onClose={() => setShowProjectForm(false)}
      />

      {/* Comment Modal */}
      {selectedProjectForComment && (
        <CommentModal
          isOpen={showCommentModal}
          onClose={() => {
            setShowCommentModal(false);
            setSelectedProjectForComment(null);
          }}
          targetType="project"
          targetId={selectedProjectForComment.id}
          targetTitle={selectedProjectForComment.title}
          currentUserId={localStorage.getItem('peve_user_id') || undefined}
        />
      )}
    </div>
  );
}
