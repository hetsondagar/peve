import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Brain,
  Globe,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Zap,
  Target,
  Award
} from "lucide-react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weekly: true,
    mentions: true,
    projects: true
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showProjects: true,
    analyticsOptIn: true
  });

  const [aiPreferences, setAiPreferences] = useState({
    recommendations: true,
    autoMatching: true,
    skillSuggestions: true,
    smartNotifications: true,
    dataAnalysis: true
  });

  const gamificationStats = {
    level: 12,
    xp: 8420,
    nextLevelXp: 10000,
    badges: 18,
    rank: "Innovation Leader"
  };

  const handleSaveProfile = () => {
    // In a real app, this would save the profile data
    console.log("Saving profile...");
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handleAIChange = (key: string, value: boolean) => {
    setAiPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
            <p className="text-foreground-secondary">
              Customize your Peve experience and manage your account preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <GlassCard className="sticky top-24">
                <nav className="space-y-2">
                  <Tabs defaultValue="profile" orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col h-auto bg-transparent p-0 w-full">
                      <TabsTrigger value="profile" className="w-full justify-start data-[state=active]:bg-primary/20">
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </TabsTrigger>
                      <TabsTrigger value="privacy" className="w-full justify-start data-[state=active]:bg-primary/20">
                        <Shield className="w-4 h-4 mr-3" />
                        Privacy & Security
                      </TabsTrigger>
                      <TabsTrigger value="notifications" className="w-full justify-start data-[state=active]:bg-primary/20">
                        <Bell className="w-4 h-4 mr-3" />
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger value="appearance" className="w-full justify-start data-[state=active]:bg-primary/20">
                        <Palette className="w-4 h-4 mr-3" />
                        Appearance
                      </TabsTrigger>
                      <TabsTrigger value="ai" className="w-full justify-start data-[state=active]:bg-primary/20">
                        <Brain className="w-4 h-4 mr-3" />
                        AI Preferences
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </nav>
              </GlassCard>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile" orientation="vertical" className="w-full">
                {/* Profile Settings */}
                <TabsContent value="profile" className="space-y-6">
                  <GlassCard className="animate-fade-in">
                    <h3 className="text-xl font-semibold text-foreground mb-6">Profile Information</h3>
                    
                    <div className="space-y-6">
                      {/* Avatar Section */}
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-foreground font-bold text-2xl">
                          AJ
                        </div>
                        <div>
                          <Button variant="outline" className="mb-2">
                            <Camera className="w-4 h-4 mr-2" />
                            Change Avatar
                          </Button>
                          <p className="text-sm text-foreground-secondary">
                            JPG, PNG or GIF. Max size 2MB.
                          </p>
                        </div>
                      </div>

                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            defaultValue="Alex Johnson"
                            className="w-full px-4 py-3 bg-muted/20 border border-border/30 rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Job Title
                          </label>
                          <input
                            type="text"
                            defaultValue="Senior Full Stack Developer"
                            className="w-full px-4 py-3 bg-muted/20 border border-border/30 rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email
                          </label>
                          <input
                            type="email"
                            defaultValue="alex.johnson@email.com"
                            className="w-full px-4 py-3 bg-muted/20 border border-border/30 rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Phone
                          </label>
                          <input
                            type="tel"
                            defaultValue="+1 (555) 123-4567"
                            className="w-full px-4 py-3 bg-muted/20 border border-border/30 rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          Location
                        </label>
                        <input
                          type="text"
                          defaultValue="San Francisco, CA"
                          className="w-full px-4 py-3 bg-muted/20 border border-border/30 rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Bio
                        </label>
                        <textarea
                          rows={4}
                          defaultValue="Passionate full-stack developer with 8+ years of experience building scalable web applications and leading cross-functional teams. Specializing in React, Node.js, and cloud architecture."
                          className="w-full px-4 py-3 bg-muted/20 border border-border/30 rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                        />
                      </div>

                      <Button variant="default" onClick={handleSaveProfile} className="w-full md:w-auto">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </GlassCard>

                  {/* Gamification Stats */}
                  <GlassCard className="animate-slide-up glow-purple">
                    <h3 className="text-xl font-semibold text-foreground mb-6">Your Progress</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-primary rounded-full flex items-center justify-center">
                          <Target className="w-8 h-8 text-foreground" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">Level {gamificationStats.level}</div>
                        <div className="text-sm text-foreground-secondary">{gamificationStats.rank}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-secondary rounded-full flex items-center justify-center">
                          <Zap className="w-8 h-8 text-foreground" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">{gamificationStats.xp.toLocaleString()}</div>
                        <div className="text-sm text-foreground-secondary">XP Earned</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-accent rounded-full flex items-center justify-center">
                          <Award className="w-8 h-8 text-foreground" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">{gamificationStats.badges}</div>
                        <div className="text-sm text-foreground-secondary">Badges</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground-secondary">Progress to Level {gamificationStats.level + 1}</span>
                        <span className="text-foreground">{gamificationStats.xp}/{gamificationStats.nextLevelXp} XP</span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-3">
                        <div 
                          className="bg-gradient-primary h-3 rounded-full transition-all duration-1000"
                          style={{width: `${(gamificationStats.xp / gamificationStats.nextLevelXp) * 100}%`}}
                        />
                      </div>
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* Privacy & Security */}
                <TabsContent value="privacy" className="space-y-6">
                  <GlassCard className="animate-fade-in">
                    <h3 className="text-xl font-semibold text-foreground mb-6">Privacy Settings</h3>
                    
                    <div className="space-y-6">
                      {Object.entries({
                        profileVisible: "Make my profile visible to other users",
                        showEmail: "Show my email address on my profile",
                        showPhone: "Show my phone number on my profile", 
                        allowMessages: "Allow other users to message me",
                        showProjects: "Show my projects publicly",
                        analyticsOptIn: "Allow analytics to improve recommendations"
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            {key.includes('show') ? <Eye className="w-5 h-5 text-foreground-secondary" /> : 
                             key === 'allowMessages' ? <Mail className="w-5 h-5 text-foreground-secondary" /> :
                             <Shield className="w-5 h-5 text-foreground-secondary" />}
                            <span className="text-foreground">{label}</span>
                          </div>
                          <Switch
                            checked={privacy[key as keyof typeof privacy]}
                            onCheckedChange={(value) => handlePrivacyChange(key, value)}
                          />
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard className="animate-slide-up">
                    <h3 className="text-xl font-semibold text-foreground mb-6">Security</h3>
                    
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-3" />
                        Change Password
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-3" />
                        Enable Two-Factor Authentication
                      </Button>
                      
                      <Button variant="outline" className="w-full justify-start">
                        <Globe className="w-4 h-4 mr-3" />
                        Review Active Sessions
                      </Button>
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value="notifications" className="space-y-6">
                  <GlassCard className="animate-fade-in">
                    <h3 className="text-xl font-semibold text-foreground mb-6">Notification Preferences</h3>
                    
                    <div className="space-y-6">
                      {Object.entries({
                        email: "Email notifications",
                        push: "Push notifications",
                        sms: "SMS notifications",
                        weekly: "Weekly digest email",
                        mentions: "When someone mentions me",
                        projects: "Project updates and invitations"
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-foreground-secondary" />
                            <span className="text-foreground">{label}</span>
                          </div>
                          <Switch
                            checked={notifications[key as keyof typeof notifications]}
                            onCheckedChange={(value) => handleNotificationChange(key, value)}
                          />
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* Appearance */}
                <TabsContent value="appearance" className="space-y-6">
                  <GlassCard className="animate-fade-in">
                    <h3 className="text-xl font-semibold text-foreground mb-6">Theme Preferences</h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          {darkMode ? <Moon className="w-5 h-5 text-foreground-secondary" /> : 
                                     <Sun className="w-5 h-5 text-foreground-secondary" />}
                          <span className="text-foreground">Dark Mode</span>
                        </div>
                        <Switch
                          checked={darkMode}
                          onCheckedChange={setDarkMode}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { name: "Electric Blue", color: "bg-gradient-primary" },
                          { name: "Cosmic Purple", color: "bg-gradient-secondary" },
                          { name: "Neon Cyan", color: "bg-gradient-accent" }
                        ].map((theme) => (
                          <button
                            key={theme.name}
                            className="p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors text-center"
                          >
                            <div className={`w-12 h-12 mx-auto mb-2 rounded-full ${theme.color}`} />
                            <span className="text-sm text-foreground">{theme.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </TabsContent>

                {/* AI Preferences */}
                <TabsContent value="ai" className="space-y-6">
                  <GlassCard className="animate-fade-in glow-primary">
                    <h3 className="text-xl font-semibold text-foreground mb-6">AI-Powered Features</h3>
                    
                    <div className="space-y-6">
                      {Object.entries({
                        recommendations: "AI-powered project and connection recommendations",
                        autoMatching: "Automatic skill-based matching",
                        skillSuggestions: "Personalized skill development suggestions",
                        smartNotifications: "Smart notification filtering and prioritization",
                        dataAnalysis: "Advanced analytics and insights"
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Brain className="w-5 h-5 text-foreground-secondary" />
                            <span className="text-foreground">{label}</span>
                          </div>
                          <Switch
                            checked={aiPreferences[key as keyof typeof aiPreferences]}
                            onCheckedChange={(value) => handleAIChange(key, value)}
                          />
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}