import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Users, 
  Code, 
  Palette, 
  Briefcase,
  GraduationCap,
  Camera,
  Music,
  Rocket
} from "lucide-react";

export default function Explore() {
  const categories = [
    { icon: Code, label: "Development", count: 1234, color: "primary" },
    { icon: Palette, label: "Design", count: 856, color: "secondary" },
    { icon: Briefcase, label: "Business", count: 642, color: "accent" },
    { icon: GraduationCap, label: "Education", count: 428, color: "primary" },
    { icon: Camera, label: "Photography", count: 312, color: "secondary" },
    { icon: Music, label: "Music", count: 298, color: "accent" },
    { icon: Rocket, label: "Startups", count: 567, color: "primary" }
  ];

  const users = [
    {
      name: "Sarah Chen",
      role: "Senior UX Designer",
      location: "San Francisco, CA",
      skills: ["UI/UX", "Figma", "Prototyping"],
      rating: 4.9,
      projects: 23,
      avatar: "SC",
      verified: true
    },
    {
      name: "Marcus Rodriguez",
      role: "Full Stack Developer",
      location: "New York, NY",
      skills: ["React", "Node.js", "TypeScript"],
      rating: 4.8,
      projects: 31,
      avatar: "MR",
      verified: true
    },
    {
      name: "Elena Vasquez",
      role: "Research Scientist",
      location: "Boston, MA",
      skills: ["AI/ML", "Python", "Data Science"],
      rating: 5.0,
      projects: 18,
      avatar: "EV",
      verified: true
    },
    {
      name: "James Wilson",
      role: "Product Manager",
      location: "Seattle, WA",
      skills: ["Strategy", "Analytics", "Leadership"],
      rating: 4.7,
      projects: 27,
      avatar: "JW",
      verified: false
    },
    {
      name: "Lisa Park",
      role: "Marketing Director",
      location: "Los Angeles, CA",
      skills: ["Digital Marketing", "Branding", "Content"],
      rating: 4.9,
      projects: 19,
      avatar: "LP",
      verified: true
    },
    {
      name: "David Kim",
      role: "Blockchain Developer",
      location: "Austin, TX",
      skills: ["Solidity", "Web3", "DeFi"],
      rating: 4.6,
      projects: 15,
      avatar: "DK",
      verified: false
    }
  ];

  const trending = [
    { tag: "AI & Machine Learning", posts: 1247 },
    { tag: "Sustainable Design", posts: 892 },
    { tag: "Web3 Development", posts: 756 },
    { tag: "Remote Collaboration", posts: 634 },
    { tag: "Startup Funding", posts: 521 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">Explore Community</h1>
            <p className="text-xl text-foreground-secondary max-w-2xl">
              Discover talented professionals, innovative projects, and exciting opportunities 
              from our global community of creators and innovators.
            </p>
          </div>

          {/* Search and Filters */}
          <GlassCard className="mb-8 animate-fade-in">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-secondary" />
                <input
                  type="text"
                  placeholder="Search by name, skills, location, or interests..."
                  className="w-full pl-12 pr-4 py-3 bg-muted/20 border border-border/30 rounded-large text-foreground placeholder-foreground-secondary focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <Button variant="glass" className="lg:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Categories */}
            <div className="space-y-6">
              <GlassCard className="animate-fade-in">
                <h3 className="text-lg font-semibold text-foreground mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <button
                      key={category.label}
                      className="w-full flex items-center justify-between p-3 hover:bg-muted/20 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-${category.color}`}>
                          <category.icon className="w-4 h-4 text-foreground" />
                        </div>
                        <span className="text-foreground group-hover:text-primary transition-colors">
                          {category.label}
                        </span>
                      </div>
                      <span className="text-sm text-foreground-secondary">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                <h3 className="text-lg font-semibold text-foreground mb-4">Trending Topics</h3>
                <div className="space-y-3">
                  {trending.map((item, index) => (
                    <div key={item.tag} className="flex justify-between items-center">
                      <span className="text-foreground-secondary text-sm hover:text-foreground transition-colors cursor-pointer">
                        #{item.tag.replace(/\s+/g, '').toLowerCase()}
                      </span>
                      <span className="text-xs text-foreground-secondary">
                        {item.posts}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Main Content - User Grid */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Featured Professionals
                </h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Grid</Button>
                  <Button variant="ghost" size="sm">List</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {users.map((user, index) => (
                  <GlassCard 
                    key={user.name} 
                    className="animate-scale-in hover:glow-primary"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-foreground font-bold text-lg">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{user.name}</h3>
                            {user.verified && (
                              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-foreground text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <p className="text-foreground-secondary text-sm">{user.role}</p>
                          <div className="flex items-center gap-1 text-xs text-foreground-secondary mt-1">
                            <MapPin className="w-3 h-3" />
                            {user.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {user.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-muted/30 rounded-full text-xs text-foreground-secondary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-warning fill-current" />
                          {user.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {user.projects} projects
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="flex-1">
                        Connect
                      </Button>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="glass" size="lg">
                  <Users className="w-4 h-4 mr-2" />
                  Load More Profiles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}