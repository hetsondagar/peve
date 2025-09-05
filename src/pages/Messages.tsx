import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Send, 
  Smile, 
  Paperclip, 
  MoreVertical,
  Phone,
  Video,
  Info,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState("1");
  const [message, setMessage] = useState("");

  const conversations = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Full Stack Developer",
      avatar: "/api/placeholder/60/60",
      lastMessage: "Hey! I saw your latest project, it looks amazing!",
      time: "2 min ago",
      unread: 2,
      isOnline: true
    },
    {
      id: "2",
      name: "Marcus Johnson",
      role: "Product Manager",
      avatar: "/api/placeholder/60/60",
      lastMessage: "Thanks for the feedback on the design system",
      time: "1 hour ago",
      unread: 0,
      isOnline: false
    },
    {
      id: "3",
      name: "Elena Rodriguez",
      role: "UX Designer",
      avatar: "/api/placeholder/60/60",
      lastMessage: "Let's schedule a call to discuss the collaboration",
      time: "3 hours ago",
      unread: 1,
      isOnline: true
    },
    {
      id: "4",
      name: "David Kim",
      role: "DevOps Engineer",
      avatar: "/api/placeholder/60/60",
      lastMessage: "The deployment went smoothly!",
      time: "1 day ago",
      unread: 0,
      isOnline: false
    }
  ];

  const messages = [
    {
      id: "1",
      sender: "sarah",
      content: "Hey! I saw your latest project, it looks amazing!",
      time: "2:30 PM",
      isOwn: false
    },
    {
      id: "2",
      sender: "you",
      content: "Thank you! I've been working on it for weeks. The AI integration was particularly challenging.",
      time: "2:32 PM",
      isOwn: true
    },
    {
      id: "3",
      sender: "sarah",
      content: "I can imagine! I've been working on something similar. Would you be interested in collaborating?",
      time: "2:35 PM",
      isOwn: false
    },
    {
      id: "4",
      sender: "you",
      content: "Absolutely! I'd love to collaborate. What's your timeline?",
      time: "2:37 PM",
      isOwn: true
    },
    {
      id: "5",
      sender: "sarah",
      content: "Perfect! I'm thinking we could start next week. I'll send you the project details.",
      time: "2:40 PM",
      isOwn: false
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]"
          >
            {/* Conversations Sidebar */}
            <div className="col-span-4">
              <GlassCard className="h-full flex flex-col">
                <div className="p-6 border-b border-border">
                  <h2 className="text-2xl font-bold gradient-text mb-4">Messages</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 space-y-2">
                    {conversations.map((conversation, index) => (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedChat === conversation.id
                            ? 'bg-primary/20 border border-primary/30'
                            : 'hover:bg-muted/20'
                        }`}
                        onClick={() => setSelectedChat(conversation.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                              {conversation.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            {conversation.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-background rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-foreground truncate">
                                {conversation.name}
                              </h3>
                              <span className="text-xs text-foreground-secondary">
                                {conversation.time}
                              </span>
                            </div>
                            <p className="text-sm text-foreground-secondary truncate">
                              {conversation.lastMessage}
                            </p>
                            <p className="text-xs text-primary">{conversation.role}</p>
                          </div>
                          {conversation.unread > 0 && (
                            <div className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                              {conversation.unread}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Chat Window */}
            <div className="col-span-8">
              <GlassCard className="h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-sm font-bold text-white">SC</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Sarah Chen</h3>
                        <p className="text-sm text-foreground-secondary">Full Stack Developer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Info className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <AnimatePresence>
                    {messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          msg.isOwn 
                            ? 'bg-primary text-white' 
                            : 'bg-muted text-foreground'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.isOwn ? 'text-white/70' : 'text-foreground-secondary'
                          }`}>
                            {msg.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="pr-12"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      >
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button onClick={handleSendMessage} disabled={!message.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}