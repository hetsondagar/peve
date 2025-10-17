import { motion } from 'framer-motion';
import { Bell, User, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProjectCard } from '@/components/ProjectCard';
import { NetworkBackground } from '@/components/NetworkBackground';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GlowButton } from '@/components/ui/glow-button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import ProjectSubmissionForm from '@/components/ProjectSubmissionForm';
import { CommentModal } from '@/components/CommentModal';
import SearchBar from '@/components/SearchBar';
// Use public logo everywhere

const mockProjects = [
  {
    title: "AI Task Manager",
    description: "Smart task management with AI-powered prioritization and team collaboration features",
    tags: ["React", "Node.js", "OpenAI"],
    likes: 234,
    comments: 45,
    teamSize: 3,
  },
  {
    title: "Social Learning Platform",
    description: "Connect with study buddies and share knowledge through interactive courses",
    tags: ["Next.js", "PostgreSQL", "WebRTC"],
    likes: 189,
    comments: 32,
    teamSize: 4,
  },
  {
    title: "Crypto Portfolio Tracker",
    description: "Real-time cryptocurrency tracking with advanced analytics and alerts",
    tags: ["Vue", "Firebase", "Web3"],
    likes: 312,
    comments: 67,
    teamSize: 2,
  },
  {
    title: "Fitness Companion App",
    description: "Your personal workout buddy with AR exercises and nutrition tracking",
    tags: ["React Native", "TensorFlow", "AR"],
    likes: 156,
    comments: 28,
    teamSize: 5,
  },
  {
    title: "Code Snippet Manager",
    description: "Organize and share your code snippets with syntax highlighting and collaboration",
    tags: ["TypeScript", "MongoDB", "Redis"],
    likes: 278,
    comments: 51,
    teamSize: 2,
  },
  {
    title: "Music Discovery Engine",
    description: "AI-powered music recommendations based on mood and listening patterns",
    tags: ["Python", "Spotify API", "ML"],
    likes: 423,
    comments: 89,
    teamSize: 3,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedProjectForComment, setSelectedProjectForComment] = useState<any>(null);
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiFetch('/api/projects');
        setProjects(response.data.items || []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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
                <button onClick={() => navigate('/home')} className="text-primary">Explore</button>
                <button onClick={() => navigate('/ideas')} className="text-muted-foreground hover:text-primary transition-colors">Ideas</button>
                <button onClick={() => navigate('/projects')} className="text-muted-foreground hover:text-primary transition-colors">Projects</button>
                <button onClick={() => navigate('/codetalks')} className="text-muted-foreground hover:text-primary transition-colors">CodeTalks</button>
                <button onClick={() => navigate('/leaderboard')} className="text-muted-foreground hover:text-primary transition-colors">Leaderboard</button>
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

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h1 className="text-5xl font-bold mb-4">
                  Explore the <span className="gradient-text">Hive</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Discover trending projects and connect with fellow developers
                </p>
                <GlowButton
                  onClick={() => setShowProjectForm(true)}
                  className="flex items-center gap-2 mx-auto"
                  size="lg"
                >
                  <Plus className="w-5 h-5" />
                  Share Your Project
                </GlowButton>
              </motion.div>

        {/* Project Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading projects...</div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any, index: number) => (
              <motion.div
                key={project._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                       <ProjectCard
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
                       />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">No projects found. Be the first to share a project!</div>
          </div>
        )}

        {/* Top Peers Sidebar - Could be added later */}
        {/* Right sidebar with "Recent Buzz" - Could be added later */}
      </main>

      {/* Transition Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 right-8 text-xs text-muted-foreground/30 pointer-events-none"
      >
        The hive awakens.
      </motion.div>

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
