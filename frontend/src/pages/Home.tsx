import { motion } from 'framer-motion';
import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProjectCard } from '@/components/ProjectCard';
import { NetworkBackground } from '@/components/NetworkBackground';
import { useNavigate } from 'react-router-dom';
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
  
  return (
    <div className="relative min-h-screen">
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
                <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-primary transition-colors">Dashboard</button>
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
              <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="relative group">
                <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                  <User className="w-5 h-5 text-muted-foreground" />
                </button>
                <div className="absolute right-0 mt-2 w-40 rounded-xl glass border border-border p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition">
                  <button onClick={() => navigate('/dashboard')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10">Dashboard</button>
                  <button onClick={() => { localStorage.removeItem('peve_token'); navigate('/login'); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10">Log out</button>
                </div>
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
          <p className="text-xl text-muted-foreground">
            Discover trending projects and connect with fellow developers
          </p>
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>

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
    </div>
  );
}
