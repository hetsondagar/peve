import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Star, 
  Users, 
  Briefcase, 
  Award, 
  Calendar,
  ExternalLink,
  Mail,
  MessageCircle,
  UserPlus,
  Github,
  Linkedin,
  Globe,
  Trophy,
  Target,
  Activity
} from "lucide-react";

export default function Profile() {
  const skills = [
    { name: "React", level: 95, category: "Frontend" },
    { name: "TypeScript", level: 90, category: "Programming" },
    { name: "UI/UX Design", level: 88, category: "Design" },
    { name: "Node.js", level: 85, category: "Backend" },
    { name: "Python", level: 80, category: "Programming" },
    { name: "Figma", level: 92, category: "Design" }
  ];

  const achievements = [
    { title: "Innovation Leader", description: "Led 5+ breakthrough projects", icon: Trophy, color: "primary" },
    { title: "Community Champion", description: "Helped 100+ developers", icon: Users, color: "secondary" },
    { title: "Code Master", description: "1000+ commits this year", icon: Target, color: "accent" },
    { title: "Design Guru", description: "Featured in 10+ showcases", icon: Award, color: "primary" }
  ];

  const projects = [
    {
      title: "AI-Powered Analytics Dashboard",
      description: "Real-time data visualization platform with ML insights",
      tech: ["React", "Python", "TensorFlow"],
      status: "Live",
      collaborators: 4
    },
    {
      title: "Sustainable E-commerce Platform",
      description: "Eco-friendly marketplace with carbon tracking",
      tech: ["Next.js", "Stripe", "MongoDB"],
      status: "In Progress",
      collaborators: 6
    },
    {
      title: "AR Collaboration Tool",
      description: "Virtual workspace for remote teams",
      tech: ["Unity", "WebRTC", "Firebase"],
      status: "Prototype",
      collaborators: 3
    }
  ];

  const connections = [
    { name: "Sarah Chen", role: "Senior Designer", avatar: "SC", mutual: 12 },
    { name: "Marcus Rodriguez", role: "Full Stack Dev", avatar: "MR", mutual: 8 },
    { name: "Elena Vasquez", role: "Data Scientist", avatar: "EV", mutual: 15 },
    { name: "James Wilson", role: "Product Manager", avatar: "JW", mutual: 6 }
  ];

  const activities = [
    { action: "Completed project milestone", project: "AI Analytics Dashboard", time: "2 hours ago" },
    { action: "Joined collaboration", project: "Sustainable E-commerce", time: "1 day ago" },
    { action: "Earned achievement", project: "Innovation Leader", time: "3 days ago" },
    { action: "Started new project", project: "AR Collaboration Tool", time: "1 week ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <GlassCard className="mb-8 animate-fade-in glow-primary">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex flex-col items-center lg:items-start">
                <div className="w-32 h-32 bg-gradient-primary rounded-full flex items-center justify-center text-foreground font-bold text-4xl mb-4">
                  AJ
                </div>
                <div className="flex gap-4">
                  <Button variant="glass" size="icon">
                    <Github className="w-5 h-5" />
                  </Button>
                  <Button variant="glass" size="icon">
                    <Linkedin className="w-5 h-5" />
                  </Button>
                  <Button variant="glass" size="icon">
                    <Globe className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold gradient-text">Alex Johnson</h1>
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-foreground text-xs">✓</span>
                      </div>
                    </div>
                    <p className="text-xl text-foreground-secondary mb-2">Senior Full Stack Developer</p>
                    <div className="flex items-center gap-2 text-foreground-secondary mb-4">
                      <MapPin className="w-4 h-4" />
                      San Francisco, CA
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="default" className="group">
                      <MessageCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Message
                    </Button>
                    <Button variant="secondary" className="group">
                      <UserPlus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Connect
                    </Button>
                  </div>
                </div>
                
                <p className="text-foreground-secondary leading-relaxed mb-6">
                  Passionate full-stack developer with 8+ years of experience building scalable web applications 
                  and leading cross-functional teams. Specializing in React, Node.js, and cloud architecture. 
                  Always excited to collaborate on innovative projects that make a positive impact.
                </p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">4.9</div>
                    <div className="text-sm text-foreground-secondary flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-current" />
                      Rating
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">247</div>
                    <div className="text-sm text-foreground-secondary flex items-center justify-center gap-1">
                      <Users className="w-4 h-4" />
                      Connections
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">31</div>
                    <div className="text-sm text-foreground-secondary flex items-center justify-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      Projects
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">12</div>
                    <div className="text-sm text-foreground-secondary flex items-center justify-center gap-1">
                      <Award className="w-4 h-4" />
                      Achievements
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Tabs Content */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass mb-8">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="animate-slide-up">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Skills & Expertise</h3>
                  <div className="space-y-4">
                    {skills.map((skill, index) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-foreground font-medium">{skill.name}</span>
                          <span className="text-sm text-foreground-secondary">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-2">
                          <div 
                            className="bg-gradient-primary h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{width: `${skill.level}%`, animationDelay: `${index * 0.1}s`}}
                          />
                        </div>
                        <span className="text-xs text-foreground-secondary">{skill.category}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="animate-slide-up" style={{animationDelay: '0.2s'}}>
                  <h3 className="text-xl font-semibold text-foreground mb-6">Achievements</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <div 
                        key={achievement.title}
                        className="p-4 bg-muted/20 rounded-lg text-center hover:bg-muted/30 transition-colors"
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-${achievement.color} rounded-full flex items-center justify-center`}>
                          <achievement.icon className="w-6 h-6 text-foreground" />
                        </div>
                        <div className="font-semibold text-foreground text-sm mb-1">
                          {achievement.title}
                        </div>
                        <div className="text-xs text-foreground-secondary">
                          {achievement.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                  <GlassCard 
                    key={project.title} 
                    className="animate-scale-in hover:glow-primary"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${project.status === 'Live' ? 'bg-success/20 text-success' : 
                          project.status === 'In Progress' ? 'bg-warning/20 text-warning' : 
                          'bg-info/20 text-info'}
                      `}>
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-foreground-secondary mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-muted/30 rounded-full text-xs text-foreground-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                        <Users className="w-4 h-4" />
                        {project.collaborators} collaborators
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Project
                      </Button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </TabsContent>

            {/* Connections Tab */}
            <TabsContent value="connections" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {connections.map((connection, index) => (
                  <GlassCard 
                    key={connection.name} 
                    className="text-center animate-fade-in"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center text-foreground font-bold">
                      {connection.avatar}
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{connection.name}</h3>
                    <p className="text-sm text-foreground-secondary mb-3">{connection.role}</p>
                    <p className="text-xs text-foreground-secondary mb-4">
                      {connection.mutual} mutual connections
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </GlassCard>
                ))}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <GlassCard className="animate-fade-in">
                <h3 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 hover:bg-muted/20 rounded-lg transition-colors"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-foreground">
                          <span className="font-medium">{activity.action}</span>
                          {activity.project && (
                            <span className="text-foreground-secondary"> • {activity.project}</span>
                          )}
                        </p>
                        <p className="text-sm text-foreground-secondary">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}