import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { 
  Users, 
  MessageCircle, 
  ArrowRight,
  Star,
  Award,
  Zap,
  Brain,
  Target,
  Code,
  Palette,
  Briefcase,
  TrendingUp,
  Sparkles,
  Crown,
  Shield,
  Database,
  Cloud,
  Heart,
  Share2,
  Copy,
  Download
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Comparison() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'detailed' | 'overview'>('detailed');

  const user1 = {
    name: "Alex Johnson",
    role: "Senior Full Stack Developer",
    avatar: "AJ",
    rating: 4.9,
    skills: [
      { name: "React", level: 95, category: "Frontend" },
      { name: "Node.js", level: 85, category: "Backend" },
      { name: "TypeScript", level: 90, category: "Programming" },
      { name: "UI/UX Design", level: 88, category: "Design" },
      { name: "Python", level: 80, category: "Programming" },
      { name: "DevOps", level: 75, category: "Infrastructure" },
      { name: "Product Strategy", level: 70, category: "Business" },
      { name: "Team Leadership", level: 85, category: "Management" },
      { name: "AWS", level: 78, category: "Cloud" },
      { name: "Docker", level: 82, category: "Infrastructure" },
      { name: "GraphQL", level: 88, category: "Backend" },
      { name: "Machine Learning", level: 65, category: "AI/ML" }
    ],
    strengths: ["Full Stack Development", "Team Leadership", "Technical Architecture"],
    achievements: 12,
    projects: 31
  };

  const user2 = {
    name: "Sarah Chen",
    role: "Senior UX Designer",
    avatar: "SC",
    rating: 4.8,
    skills: [
      { name: "UI/UX Design", level: 95, category: "Design" },
      { name: "Figma", level: 92, category: "Design" },
      { name: "User Research", level: 88, category: "Research" },
      { name: "Prototyping", level: 90, category: "Design" },
      { name: "React", level: 70, category: "Frontend" },
      { name: "Design Systems", level: 85, category: "Design" },
      { name: "Product Strategy", level: 88, category: "Business" },
      { name: "Data Analysis", level: 75, category: "Analytics" },
      { name: "Sketch", level: 90, category: "Design" },
      { name: "Adobe Creative Suite", level: 85, category: "Design" },
      { name: "A/B Testing", level: 80, category: "Analytics" },
      { name: "Accessibility", level: 88, category: "Design" }
    ],
    strengths: ["User Experience", "Design Systems", "User Research"],
    achievements: 8,
    projects: 23
  };

  const getSkillComparison = () => {
    const allSkills = new Set([
      ...user1.skills.map(s => s.name),
      ...user2.skills.map(s => s.name)
    ]);

    return Array.from(allSkills).map(skillName => {
      const user1Skill = user1.skills.find(s => s.name === skillName);
      const user2Skill = user2.skills.find(s => s.name === skillName);
      
      return {
        name: skillName,
        user1Level: user1Skill?.level || 0,
        user2Level: user2Skill?.level || 0,
        category: user1Skill?.category || user2Skill?.category || 'Other',
        gap: Math.abs((user1Skill?.level || 0) - (user2Skill?.level || 0))
      };
    }).sort((a, b) => b.gap - a.gap);
  };

  const skillComparison = getSkillComparison();
  const complementarySkills = skillComparison.filter(skill => 
    (skill.user1Level > 80 && skill.user2Level < 50) || 
    (skill.user2Level > 80 && skill.user1Level < 50)
  );

  const collaborationPotential = {
    score: 92,
    factors: [
      { name: "Complementary Skills", score: 95, icon: Zap },
      { name: "Experience Level", score: 88, icon: Star },
      { name: "Communication Style", score: 92, icon: MessageCircle },
      { name: "Project Overlap", score: 90, icon: Target }
    ]
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Frontend': return Code;
      case 'Backend': return Database;
      case 'Design': return Palette;
      case 'Business': return Briefcase;
      case 'Programming': return Code;
      case 'Infrastructure': return Shield;
      case 'Cloud': return Cloud;
      case 'AI/ML': return Brain;
      case 'Research': return Target;
      case 'Analytics': return TrendingUp;
      case 'Management': return Crown;
      default: return Brain;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Frontend': return 'text-blue-400';
      case 'Backend': return 'text-green-400';
      case 'Design': return 'text-purple-400';
      case 'Business': return 'text-yellow-400';
      case 'Programming': return 'text-blue-400';
      case 'Infrastructure': return 'text-orange-400';
      case 'Cloud': return 'text-cyan-400';
      case 'AI/ML': return 'text-pink-400';
      case 'Research': return 'text-indigo-400';
      case 'Analytics': return 'text-emerald-400';
      case 'Management': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  const uniqueSkills = skillComparison.filter(skill => 
    skill.user1Level === 0 || skill.user2Level === 0
  );

  const missingSkills = {
    user1: skillComparison.filter(skill => skill.user1Level === 0),
    user2: skillComparison.filter(skill => skill.user2Level === 0)
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold gradient-text mb-4">Skills Comparison</h1>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              Discover collaboration opportunities through detailed skill analysis and compatibility scoring.
            </p>
          </motion.div>

          {/* User Comparison Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="mb-8 glow-primary">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* User 1 */}
                <motion.div 
                  className="text-center lg:text-left"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="flex flex-col lg:flex-row items-center gap-4 mb-4">
                    <motion.div 
                      className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-foreground font-bold text-2xl relative"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {user1.avatar}
                      <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Crown className="w-3 h-3 text-foreground" />
                      </motion.div>
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{user1.name}</h3>
                      <p className="text-foreground-secondary">{user1.role}</p>
                      <div className="flex items-center justify-center lg:justify-start gap-4 mt-2 text-sm text-foreground-secondary">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-warning fill-current" />
                          {user1.rating}
                        </span>
                        <span>{user1.projects} projects</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* VS */}
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <motion.div 
                    className="w-16 h-16 mx-auto bg-gradient-secondary rounded-full flex items-center justify-center mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-foreground font-bold text-xl">VS</span>
                  </motion.div>
                  <div className="text-sm text-foreground-secondary">
                    Collaboration Score: <span className="text-foreground font-semibold text-lg">{collaborationPotential.score}%</span>
                  </div>
                </motion.div>

                {/* User 2 */}
                <motion.div 
                  className="text-center lg:text-right"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="flex flex-col lg:flex-row-reverse items-center gap-4 mb-4">
                    <motion.div 
                      className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center text-foreground font-bold text-2xl relative"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {user2.avatar}
                      <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-3 h-3 text-foreground" />
                      </motion.div>
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{user2.name}</h3>
                      <p className="text-foreground-secondary">{user2.role}</p>
                      <div className="flex items-center justify-center lg:justify-end gap-4 mt-2 text-sm text-foreground-secondary">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-warning fill-current" />
                          {user2.rating}
                        </span>
                        <span>{user2.projects} projects</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Skills Comparison */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <GlassCard>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-foreground">Detailed Skills Analysis</h3>
                    <div className="flex gap-2 bg-muted/20 p-1 rounded-lg">
                      <Button 
                        variant={viewMode === 'detailed' ? 'default' : 'ghost'} 
                        size="sm"
                        onClick={() => setViewMode('detailed')}
                        className="px-3"
                      >
                        Detailed
                      </Button>
                      <Button 
                        variant={viewMode === 'overview' ? 'default' : 'ghost'} 
                        size="sm"
                        onClick={() => setViewMode('overview')}
                        className="px-3"
                      >
                        Overview
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {skillComparison.map((skill, index) => {
                      const CategoryIcon = getCategoryIcon(skill.category);
                      const categoryColor = getCategoryColor(skill.category);
                      const isComplementary = complementarySkills.includes(skill);
                      const isUnique = uniqueSkills.includes(skill);
                      const isMissing = skill.user1Level === 0 || skill.user2Level === 0;
                      
                      return (
                        <motion.div 
                          key={skill.name} 
                          className={`p-4 rounded-lg border transition-all duration-300 ${
                            isComplementary 
                              ? 'border-primary/50 bg-primary/5 shadow-glow' 
                              : isUnique
                              ? 'border-cyan-500/50 bg-cyan-500/5 shadow-glow'
                              : 'border-border/20 hover:border-border/40'
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.7 + index * 0.05 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                              >
                                <CategoryIcon className={`w-5 h-5 ${categoryColor}`} />
                              </motion.div>
                              <span className="font-medium text-foreground">{skill.name}</span>
                              {isComplementary && (
                                <motion.span 
                                  className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium"
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  Complementary
                                </motion.span>
                              )}
                              {isUnique && (
                                <motion.span 
                                  className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium"
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                >
                                  Unique
                                </motion.span>
                              )}
                            </div>
                            <span className="text-xs text-foreground-secondary">{skill.category}</span>
                          </div>
                          
                          <div className="space-y-2">
                            {/* User 1 Skill Bar */}
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-foreground-secondary w-8">{user1.avatar}</span>
                              <div className="flex-1 bg-muted/30 rounded-full h-3 relative overflow-hidden">
                                <motion.div 
                                  className={`h-3 rounded-full ${
                                    skill.user1Level === 0 
                                      ? 'bg-gradient-to-r from-red-500/50 to-red-600/50' 
                                      : 'bg-gradient-primary'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.user1Level}%` }}
                                  transition={{ duration: 1, delay: 0.8 + index * 0.05 }}
                                />
                                {skill.user1Level === 0 && (
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/30 to-transparent"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  />
                                )}
                              </div>
                              <span className={`text-sm font-medium w-8 ${
                                skill.user1Level === 0 ? 'text-red-400' : 'text-foreground'
                              }`}>
                                {skill.user1Level}%
                              </span>
                            </div>
                            
                            {/* User 2 Skill Bar */}
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-foreground-secondary w-8">{user2.avatar}</span>
                              <div className="flex-1 bg-muted/30 rounded-full h-3 relative overflow-hidden">
                                <motion.div 
                                  className={`h-3 rounded-full ${
                                    skill.user2Level === 0 
                                      ? 'bg-gradient-to-r from-red-500/50 to-red-600/50' 
                                      : 'bg-gradient-secondary'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.user2Level}%` }}
                                  transition={{ duration: 1, delay: 0.9 + index * 0.05 }}
                                />
                                {skill.user2Level === 0 && (
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/30 to-transparent"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                                  />
                                )}
                              </div>
                              <span className={`text-sm font-medium w-8 ${
                                skill.user2Level === 0 ? 'text-red-400' : 'text-foreground'
                              }`}>
                                {skill.user2Level}%
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Collaboration Analysis */}
            <div className="space-y-6">
              {/* Collaboration Potential */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <GlassCard className="glow-purple">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Collaboration Potential
                  </h3>
                  
                  <div className="text-center mb-6">
                    <motion.div 
                      className="w-20 h-20 mx-auto bg-gradient-accent rounded-full flex items-center justify-center mb-3 relative"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      <span className="text-2xl font-bold text-foreground">{collaborationPotential.score}%</span>
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-purple-400/30"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                    <p className="text-sm text-foreground-secondary">Exceptional Match</p>
                  </div>

                  <div className="space-y-3">
                    {collaborationPotential.factors.map((factor, index) => (
                      <motion.div 
                        key={factor.name} 
                        className="flex items-center justify-between p-2 hover:bg-muted/10 rounded-lg transition-colors"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      >
                        <div className="flex items-center gap-2">
                          <factor.icon className="w-4 h-4 text-foreground-secondary" />
                          <span className="text-sm text-foreground">{factor.name}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">{factor.score}%</span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Complementary Skills */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <GlassCard>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Complementary Skills
                  </h3>
                  <div className="space-y-3">
                    {complementarySkills.slice(0, 5).map((skill, index) => (
                      <motion.div 
                        key={skill.name} 
                        className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-sm text-foreground">{skill.name}</span>
                        <span className="text-xs text-foreground-secondary">
                          {skill.user1Level > skill.user2Level ? user1.avatar : user2.avatar} leads
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Missing Skills */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <GlassCard className="border-cyan-500/30">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    Unique Skills
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        {user1.name} has:
                      </h4>
                      <div className="space-y-1">
                        {missingSkills.user2.slice(0, 3).map((skill, index) => (
                          <motion.div 
                            key={skill.name} 
                            className="text-xs text-foreground-secondary bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                          >
                            {skill.name}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        {user2.name} has:
                      </h4>
                      <div className="space-y-1">
                        {missingSkills.user1.slice(0, 3).map((skill, index) => (
                          <motion.div 
                            key={skill.name} 
                            className="text-xs text-foreground-secondary bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                          >
                            {skill.name}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="hero" size="lg" className="w-full group">
                    <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Start Collaboration
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" size="lg" className="w-full">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </motion.div>

                <div className="flex gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}