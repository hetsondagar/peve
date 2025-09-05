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
  Briefcase
} from "lucide-react";

export default function Comparison() {
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
      { name: "Team Leadership", level: 85, category: "Management" }
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
      { name: "Data Analysis", level: 75, category: "Analytics" }
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
      case 'Backend': return Code;
      case 'Design': return Palette;
      case 'Business': return Briefcase;
      default: return Brain;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">Skills Comparison</h1>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              Discover collaboration opportunities through detailed skill analysis and compatibility scoring.
            </p>
          </div>

          {/* User Comparison Header */}
          <GlassCard className="mb-8 animate-fade-in glow-primary">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* User 1 */}
              <div className="text-center lg:text-left">
                <div className="flex flex-col lg:flex-row items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-foreground font-bold text-2xl">
                    {user1.avatar}
                  </div>
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
              </div>

              {/* VS */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-secondary rounded-full flex items-center justify-center mb-4">
                  <span className="text-foreground font-bold text-xl">VS</span>
                </div>
                <div className="text-sm text-foreground-secondary">
                  Collaboration Score: <span className="text-foreground font-semibold text-lg">{collaborationPotential.score}%</span>
                </div>
              </div>

              {/* User 2 */}
              <div className="text-center lg:text-right">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center text-foreground font-bold text-2xl">
                    {user2.avatar}
                  </div>
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
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Skills Comparison */}
            <div className="lg:col-span-2">
              <GlassCard className="animate-slide-up">
                <h3 className="text-xl font-semibold text-foreground mb-6">Detailed Skills Analysis</h3>
                <div className="space-y-6">
                  {skillComparison.map((skill, index) => {
                    const CategoryIcon = getCategoryIcon(skill.category);
                    const isComplementary = complementarySkills.includes(skill);
                    
                    return (
                      <div key={skill.name} className={`p-4 rounded-lg border ${
                        isComplementary ? 'border-primary/50 bg-primary/5' : 'border-border/20'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <CategoryIcon className="w-5 h-5 text-foreground-secondary" />
                            <span className="font-medium text-foreground">{skill.name}</span>
                            {isComplementary && (
                              <span className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">
                                Complementary
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-foreground-secondary">{skill.category}</span>
                        </div>
                        
                        <div className="space-y-2">
                          {/* User 1 Skill Bar */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-foreground-secondary w-8">{user1.avatar}</span>
                            <div className="flex-1 bg-muted/30 rounded-full h-2">
                              <div 
                                className="bg-gradient-primary h-2 rounded-full transition-all duration-1000"
                                style={{width: `${skill.user1Level}%`}}
                              />
                            </div>
                            <span className="text-sm text-foreground font-medium w-8">{skill.user1Level}%</span>
                          </div>
                          
                          {/* User 2 Skill Bar */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-foreground-secondary w-8">{user2.avatar}</span>
                            <div className="flex-1 bg-muted/30 rounded-full h-2">
                              <div 
                                className="bg-gradient-secondary h-2 rounded-full transition-all duration-1000"
                                style={{width: `${skill.user2Level}%`, animationDelay: '0.1s'}}
                              />
                            </div>
                            <span className="text-sm text-foreground font-medium w-8">{skill.user2Level}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>

            {/* Collaboration Analysis */}
            <div className="space-y-6">
              {/* Collaboration Potential */}
              <GlassCard className="animate-scale-in glow-purple">
                <h3 className="text-lg font-semibold text-foreground mb-4">Collaboration Potential</h3>
                
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-accent rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-foreground">{collaborationPotential.score}%</span>
                  </div>
                  <p className="text-sm text-foreground-secondary">Exceptional Match</p>
                </div>

                <div className="space-y-3">
                  {collaborationPotential.factors.map((factor) => (
                    <div key={factor.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <factor.icon className="w-4 h-4 text-foreground-secondary" />
                        <span className="text-sm text-foreground">{factor.name}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{factor.score}%</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Complementary Skills */}
              <GlassCard className="animate-scale-in" style={{animationDelay: '0.2s'}}>
                <h3 className="text-lg font-semibold text-foreground mb-4">Complementary Skills</h3>
                <div className="space-y-3">
                  {complementarySkills.slice(0, 5).map((skill) => (
                    <div key={skill.name} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="text-sm text-foreground">{skill.name}</span>
                      <span className="text-xs text-foreground-secondary">
                        {skill.user1Level > skill.user2Level ? user1.avatar : user2.avatar} leads
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Strengths Overview */}
              <GlassCard className="animate-scale-in" style={{animationDelay: '0.4s'}}>
                <h3 className="text-lg font-semibold text-foreground mb-4">Key Strengths</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">{user1.name}</h4>
                    <div className="space-y-1">
                      {user1.strengths.map((strength) => (
                        <div key={strength} className="text-xs text-foreground-secondary bg-primary/10 px-2 py-1 rounded">
                          {strength}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">{user2.name}</h4>
                    <div className="space-y-1">
                      {user2.strengths.map((strength) => (
                        <div key={strength} className="text-xs text-foreground-secondary bg-secondary/10 px-2 py-1 rounded">
                          {strength}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button variant="hero" size="lg" className="w-full group">
                  <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Collaboration
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button variant="outline" size="lg" className="w-full">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}