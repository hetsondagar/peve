import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  Award, 
  Users, 
  Briefcase, 
  Calendar,
  Star,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Lightbulb,
  Rocket,
  Crown,
  Sparkles,
  CheckCircle,
  Clock,
  AlertTriangle,
  Info,
  RefreshCw,
  Download,
  Share2,
  Filter,
  Search,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, AreaChart, Area } from 'recharts';

export default function AIInsights() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("6m");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for charts
  const skillGrowthData = [
    { month: 'Jan', React: 75, Node: 60, TypeScript: 70, Python: 55 },
    { month: 'Feb', React: 78, Node: 65, TypeScript: 73, Python: 58 },
    { month: 'Mar', React: 82, Node: 70, TypeScript: 77, Python: 62 },
    { month: 'Apr', React: 85, Node: 75, TypeScript: 80, Python: 65 },
    { month: 'May', React: 88, Node: 78, TypeScript: 83, Python: 68 },
    { month: 'Jun', React: 92, Node: 82, TypeScript: 87, Python: 72 }
  ];

  const engagementData = [
    { name: 'Projects', value: 35, color: '#3B82F6' },
    { name: 'Connections', value: 28, color: '#8B5CF6' },
    { name: 'Messages', value: 42, color: '#06B6D4' },
    { name: 'Learning', value: 25, color: '#10B981' }
  ];

  const productivityData = [
    { day: 'Mon', productivity: 85, focus: 78, collaboration: 92 },
    { day: 'Tue', productivity: 88, focus: 82, collaboration: 89 },
    { day: 'Wed', productivity: 92, focus: 85, collaboration: 94 },
    { day: 'Thu', productivity: 89, focus: 80, collaboration: 87 },
    { day: 'Fri', productivity: 95, focus: 88, collaboration: 91 },
    { day: 'Sat', productivity: 78, focus: 75, collaboration: 83 },
    { day: 'Sun', productivity: 82, focus: 79, collaboration: 86 }
  ];

  const aiRecommendations = [
    {
      id: 1,
      type: "skill",
      title: "Boost React Skills",
      description: "Your React skills are at 92%. Consider learning advanced patterns like Render Props and Hooks optimization.",
      priority: "high",
      impact: "+15% productivity",
      icon: Rocket,
      action: "Start Learning",
      progress: 92
    },
    {
      id: 2,
      type: "collaboration",
      title: "Join AI/ML Project",
      description: "Based on your Python skills and interest in AI, join the 'Machine Learning Dashboard' project.",
      priority: "medium",
      impact: "+8% network growth",
      icon: Users,
      action: "View Project",
      progress: 68
    },
    {
      id: 3,
      type: "learning",
      title: "Complete TypeScript Course",
      description: "You're 87% through the TypeScript mastery path. Complete the remaining modules for certification.",
      priority: "high",
      impact: "+12% skill rating",
      icon: Award,
      action: "Continue Course",
      progress: 87
    },
    {
      id: 4,
      type: "network",
      title: "Connect with Designers",
      description: "Expand your network by connecting with 5 UX designers to enhance your frontend skills.",
      priority: "low",
      impact: "+5% collaboration",
      icon: Star,
      action: "Find Designers",
      progress: 45
    }
  ];

  const insights = [
    {
      id: 1,
      title: "Peak Productivity Hours",
      description: "You're most productive between 10 AM - 2 PM. Schedule important tasks during this window.",
      type: "productivity",
      icon: Activity,
      value: "10 AM - 2 PM",
      trend: "up"
    },
    {
      id: 2,
      title: "Top Collaboration Skill",
      description: "Your communication skills have improved by 23% this month, making you a better team player.",
      type: "collaboration",
      icon: Users,
      value: "+23%",
      trend: "up"
    },
    {
      id: 3,
      title: "Learning Velocity",
      description: "You're learning 40% faster than the average user. Keep up the momentum!",
      type: "learning",
      icon: TrendingUp,
      value: "40% faster",
      trend: "up"
    },
    {
      id: 4,
      title: "Network Growth",
      description: "Your professional network has grown by 15 new connections this month.",
      type: "network",
      icon: Briefcase,
      value: "+15",
      trend: "up"
    }
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-2">AI Insights</h1>
                <p className="text-foreground-secondary">
                  Discover patterns, track progress, and get personalized recommendations powered by AI
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    onClick={handleRefresh}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Timeframe Selector */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Time Period</h3>
                <div className="flex gap-2 bg-muted/20 p-1 rounded-lg">
                  {[
                    { value: "1m", label: "1 Month" },
                    { value: "3m", label: "3 Months" },
                    { value: "6m", label: "6 Months" },
                    { value: "1y", label: "1 Year" }
                  ].map((period) => (
                    <Button
                      key={period.value}
                      variant={selectedTimeframe === period.value ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedTimeframe(period.value)}
                      className="px-3"
                    >
                      {period.label}
                    </Button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass mb-8">
              {[
                { value: "overview", label: "Overview", icon: BarChart3 },
                { value: "skills", label: "Skills Growth", icon: TrendingUp },
                { value: "productivity", label: "Productivity", icon: Activity },
                { value: "recommendations", label: "AI Recommendations", icon: Brain }
              ].map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Key Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <GlassCard className="hover:scale-105 transition-transform">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-primary rounded-lg">
                          <insight.icon className="w-6 h-6 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{insight.title}</h4>
                          <p className="text-sm text-foreground-secondary mb-2">{insight.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-foreground">{insight.value}</span>
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              {insight.trend === "up" ? (
                                <ArrowUp className="w-4 h-4 text-green-400" />
                              ) : (
                                <ArrowDown className="w-4 h-4 text-red-400" />
                              )}
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Skill Growth Chart */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <GlassCard>
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      Skill Growth Over Time
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={skillGrowthData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="month" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }} 
                          />
                          <Line type="monotone" dataKey="React" stroke="#3B82F6" strokeWidth={3} />
                          <Line type="monotone" dataKey="Node" stroke="#8B5CF6" strokeWidth={3} />
                          <Line type="monotone" dataKey="TypeScript" stroke="#06B6D4" strokeWidth={3} />
                          <Line type="monotone" dataKey="Python" stroke="#10B981" strokeWidth={3} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Engagement Distribution */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <GlassCard>
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-purple-400" />
                      Activity Distribution
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={engagementData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {engagementData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px'
                            }} 
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {engagementData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-foreground-secondary">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </TabsContent>

            {/* Skills Growth Tab */}
            <TabsContent value="skills" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard>
                  <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-400" />
                    Detailed Skills Analysis
                  </h3>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={skillGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }} 
                        />
                        <Area type="monotone" dataKey="React" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Node" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="TypeScript" stackId="1" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="Python" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </motion.div>
            </TabsContent>

            {/* Productivity Tab */}
            <TabsContent value="productivity" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <GlassCard>
                  <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Weekly Productivity Trends
                  </h3>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productivityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="productivity" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="focus" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="collaboration" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              </motion.div>
            </TabsContent>

            {/* AI Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aiRecommendations.map((recommendation, index) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <GlassCard className={`${
                      recommendation.priority === 'high' ? 'border-l-4 border-l-red-500 glow-primary' :
                      recommendation.priority === 'medium' ? 'border-l-4 border-l-yellow-500' :
                      'border-l-4 border-l-green-500'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${
                          recommendation.priority === 'high' ? 'bg-red-500/20' :
                          recommendation.priority === 'medium' ? 'bg-yellow-500/20' :
                          'bg-green-500/20'
                        }`}>
                          <recommendation.icon className="w-6 h-6 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-foreground">{recommendation.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              recommendation.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              recommendation.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {recommendation.priority}
                            </span>
                          </div>
                          <p className="text-sm text-foreground-secondary mb-3">{recommendation.description}</p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-foreground">{recommendation.impact}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-foreground-secondary">Progress</span>
                              <div className="w-20 bg-muted/30 rounded-full h-2">
                                <motion.div 
                                  className="bg-gradient-primary h-2 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${recommendation.progress}%` }}
                                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                />
                              </div>
                              <span className="text-xs text-foreground">{recommendation.progress}%</span>
                            </div>
                          </div>
                          
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="sm" className="w-full">
                              {recommendation.action}
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
