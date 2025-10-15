import { motion } from 'framer-motion';
import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProjectCard } from '@/components/ProjectCard';
import { NetworkBackground } from '@/components/NetworkBackground';
import hiveLogo from '@/assets/hive-logo.png';

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
  return (
    <div className="relative min-h-screen">
      <NetworkBackground />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={hiveLogo} alt="Peve" className="w-10 h-10" />
              <span className="text-2xl font-bold gradient-text">Peve</span>
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
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                <User className="w-5 h-5 text-muted-foreground" />
              </button>
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
