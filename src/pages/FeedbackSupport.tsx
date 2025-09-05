import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  HelpCircle, 
  Send, 
  Search, 
  Filter, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Bug, 
  Lightbulb, 
  Heart, 
  Mail, 
  Phone, 
  Clock, 
  User, 
  FileText, 
  Image, 
  Paperclip, 
  Smile, 
  Frown, 
  Meh, 
  Brain, 
  Zap, 
  Crown, 
  Sparkles, 
  Rocket, 
  Target, 
  Award, 
  TrendingUp, 
  RefreshCw, 
  Download, 
  Share2, 
  Bookmark, 
  Eye, 
  EyeOff, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowDown, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Edit, 
  Trash2, 
  MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FeedbackSupport() {
  const [activeTab, setActiveTab] = useState("feedback");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const feedbackForm = {
    category: selectedCategory,
    subject: "",
    message: "",
    priority: "medium",
    attachments: [] as File[],
    rating: 0
  };

  const [formData, setFormData] = useState(feedbackForm);

  const categories = [
    { value: "general", label: "General", icon: HelpCircle },
    { value: "bug", label: "Bug Report", icon: Bug },
    { value: "feature", label: "Feature Request", icon: Lightbulb },
    { value: "account", label: "Account", icon: User },
    { value: "billing", label: "Billing", icon: FileText },
    { value: "technical", label: "Technical", icon: Code }
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I reset my password?",
      answer: "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and we'll send you a reset link. Make sure to check your spam folder if you don't see the email within a few minutes.",
      category: "account",
      helpful: 45,
      notHelpful: 3
    },
    {
      id: 2,
      question: "How can I upgrade my account?",
      answer: "You can upgrade your account by going to Settings > Billing. Choose your preferred plan and follow the payment process. Your new features will be available immediately after payment confirmation.",
      category: "billing",
      helpful: 38,
      notHelpful: 2
    },
    {
      id: 3,
      question: "How do I connect with other professionals?",
      answer: "Use the Explore page to discover professionals in your field. You can search by skills, location, or interests. Send connection requests and start conversations to build your network.",
      category: "general",
      helpful: 52,
      notHelpful: 1
    },
    {
      id: 4,
      question: "Can I export my data?",
      answer: "Yes, you can export your data by going to Settings > Privacy & Security > Data Export. This will generate a downloadable file with all your account information and activity data.",
      category: "account",
      helpful: 29,
      notHelpful: 4
    },
    {
      id: 5,
      question: "How do I report inappropriate content?",
      answer: "You can report inappropriate content by clicking the three dots menu on any post or profile, then selecting 'Report'. Our moderation team will review the report within 24 hours.",
      category: "general",
      helpful: 41,
      notHelpful: 2
    },
    {
      id: 6,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our encrypted payment system.",
      category: "billing",
      helpful: 33,
      notHelpful: 1
    },
    {
      id: 7,
      question: "How do I delete my account?",
      answer: "To delete your account, go to Settings > Privacy & Security > Account Deletion. This action is irreversible and will permanently remove all your data. Make sure to export any important information first.",
      category: "account",
      helpful: 27,
      notHelpful: 8
    },
    {
      id: 8,
      question: "How do I enable two-factor authentication?",
      answer: "Go to Settings > Privacy & Security > Two-Factor Authentication. Follow the setup process using an authenticator app like Google Authenticator or Authy. This adds an extra layer of security to your account.",
      category: "technical",
      helpful: 44,
      notHelpful: 3
    }
  ];

  const aiChatResponses = [
    "I understand you're having trouble with that. Let me help you find a solution.",
    "Based on your question, here are some steps you can try:",
    "That's a great question! Let me provide you with some helpful information.",
    "I can help you with that. Here's what I recommend:",
    "Let me search our knowledge base for the best answer to your question."
  ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitStatus('success');
    
    // Reset form after success
    setTimeout(() => {
      setSubmitStatus('idle');
      setFormData(feedbackForm);
    }, 3000);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        message: aiChatResponses[Math.floor(Math.random() * aiChatResponses.length)],
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFAQHelpful = (faqId: number, isHelpful: boolean) => {
    // In a real app, this would update the FAQ helpfulness
    console.log(`FAQ ${faqId} marked as ${isHelpful ? 'helpful' : 'not helpful'}`);
  };

  const getFilteredFAQs = () => {
    let filtered = faqs;
    
    if (selectedCategory !== "general") {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
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
                <h1 className="text-4xl font-bold gradient-text mb-2">Feedback & Support</h1>
                <p className="text-foreground-secondary">
                  We're here to help! Get support, share feedback, or find answers to common questions
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Support
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Us
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass mb-8">
              {[
                { value: "feedback", label: "Send Feedback", icon: MessageCircle },
                { value: "faq", label: "FAQ", icon: HelpCircle },
                { value: "chat", label: "AI Assistant", icon: Brain },
                { value: "contact", label: "Contact Us", icon: Mail }
              ].map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Feedback Tab */}
            <TabsContent value="feedback" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Feedback Form */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <GlassCard>
                    <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-blue-400" />
                      Send Feedback
                    </h3>
                    
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                      {/* Category Selection */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Category
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {categories.map((category) => (
                            <Button
                              key={category.value}
                              type="button"
                              variant={selectedCategory === category.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedCategory(category.value)}
                              className="justify-start"
                            >
                              <category.icon className="w-4 h-4 mr-2" />
                              {category.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Brief description of your feedback"
                          className="w-full px-4 py-2 bg-muted/20 border border-border/30 rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                          required
                        />
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Priority
                        </label>
                        <div className="flex gap-2">
                          {[
                            { value: "low", label: "Low", color: "green" },
                            { value: "medium", label: "Medium", color: "yellow" },
                            { value: "high", label: "High", color: "red" }
                          ].map((priority) => (
                            <Button
                              key={priority.value}
                              type="button"
                              variant={formData.priority === priority.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                              className={`${
                                formData.priority === priority.value 
                                  ? `bg-${priority.color}-500 hover:bg-${priority.color}-600` 
                                  : ''
                              }`}
                            >
                              {priority.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Message
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Please provide detailed information about your feedback..."
                          rows={6}
                          className="w-full px-4 py-2 bg-muted/20 border border-border/30 rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                          required
                        />
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Overall Experience Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Star className={`w-6 h-6 ${
                                star <= formData.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-foreground-secondary'
                              }`} />
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Submit Feedback
                            </>
                          )}
                        </Button>
                      </motion.div>

                      {/* Success Message */}
                      <AnimatePresence>
                        {submitStatus === 'success' && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-400" />
                              <span className="text-green-400 font-medium">Feedback submitted successfully!</span>
                            </div>
                            <p className="text-sm text-green-300 mt-1">
                              Thank you for your feedback. We'll review it and get back to you soon.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </GlassCard>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-6"
                >
                  <GlassCard>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      {[
                        { icon: Bug, label: "Report a Bug", description: "Found something broken?" },
                        { icon: Lightbulb, label: "Suggest Feature", description: "Have an idea?" },
                        { icon: Heart, label: "Give Feedback", description: "Share your thoughts" },
                        { icon: Star, label: "Rate Experience", description: "How are we doing?" }
                      ].map((action, index) => (
                        <motion.button
                          key={action.label}
                          className="w-full p-3 rounded-lg border border-border/20 hover:border-border/40 transition-colors text-left"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <action.icon className="w-5 h-5 text-foreground-secondary" />
                            <div>
                              <div className="font-medium text-foreground">{action.label}</div>
                              <div className="text-sm text-foreground-secondary">{action.description}</div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-400" />
                      Response Times
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground-secondary">General Feedback</span>
                        <span className="text-foreground font-medium">24-48 hours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground-secondary">Bug Reports</span>
                        <span className="text-foreground font-medium">12-24 hours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground-secondary">Account Issues</span>
                        <span className="text-foreground font-medium">6-12 hours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-foreground-secondary">Billing Support</span>
                        <span className="text-foreground font-medium">2-6 hours</span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-8">
              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <GlassCard>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2 bg-muted/20 p-1 rounded-lg">
                        {categories.map((category) => (
                          <Button
                            key={category.value}
                            variant={selectedCategory === category.value ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setSelectedCategory(category.value)}
                            className="px-3"
                          >
                            <category.icon className="w-4 h-4 mr-2" />
                            {category.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
                      <input
                        type="text"
                        placeholder="Search FAQ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-muted/20 border border-border/30 rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* FAQ List */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <AnimatePresence>
                  {getFilteredFAQs().map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      layout
                    >
                      <GlassCard>
                        <div
                          className="cursor-pointer"
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">{faq.question}</h3>
                            <motion.div
                              animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-5 h-5 text-foreground-secondary" />
                            </motion.div>
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {expandedFAQ === faq.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 pt-4 border-t border-border/20"
                            >
                              <p className="text-foreground-secondary mb-4">{faq.answer}</p>
                              
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-foreground-secondary">
                                  Was this helpful?
                                </span>
                                <div className="flex gap-2">
                                  <motion.button
                                    onClick={() => handleFAQHelpful(faq.id, true)}
                                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span className="text-sm">{faq.helpful}</span>
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleFAQHelpful(faq.id, false)}
                                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                    <span className="text-sm">{faq.notHelpful}</span>
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </GlassCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </TabsContent>

            {/* AI Chat Tab */}
            <TabsContent value="chat" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <GlassCard className="h-96 flex flex-col">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/20">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <Brain className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">AI Support Assistant</h3>
                      <p className="text-sm text-foreground-secondary">Ask me anything about Peve</p>
                    </div>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-foreground-secondary">
                        <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Start a conversation with our AI assistant</p>
                      </div>
                    ) : (
                      chatMessages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs p-3 rounded-lg ${
                            message.type === 'user' 
                              ? 'bg-gradient-primary text-foreground' 
                              : 'bg-muted/20 text-foreground'
                          }`}>
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-muted/20 p-3 rounded-lg">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-foreground-secondary rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-foreground-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-foreground-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Chat Input */}
                  <form onSubmit={handleChatSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask me anything..."
                      className="flex-1 px-4 py-2 bg-muted/20 border border-border/30 rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <Button type="submit" disabled={!chatInput.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </GlassCard>
              </motion.div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Mail,
                      title: "Email Support",
                      description: "Get help via email",
                      contact: "support@peve.com",
                      responseTime: "24-48 hours",
                      color: "blue"
                    },
                    {
                      icon: Phone,
                      title: "Phone Support",
                      description: "Speak with our team",
                      contact: "+1 (555) 123-4567",
                      responseTime: "Immediate",
                      color: "green"
                    },
                    {
                      icon: MessageCircle,
                      title: "Live Chat",
                      description: "Chat with support",
                      contact: "Available 24/7",
                      responseTime: "Immediate",
                      color: "purple"
                    }
                  ].map((contact, index) => (
                    <motion.div
                      key={contact.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    >
                      <GlassCard className="text-center hover:scale-105 transition-transform">
                        <div className={`p-3 bg-gradient-${contact.color} rounded-lg w-fit mx-auto mb-4`}>
                          <contact.icon className="w-8 h-8 text-foreground" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{contact.title}</h3>
                        <p className="text-sm text-foreground-secondary mb-3">{contact.description}</p>
                        <p className="text-foreground font-medium mb-2">{contact.contact}</p>
                        <p className="text-xs text-foreground-secondary">{contact.responseTime}</p>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
