import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Star,
  Image,
  Mic
} from "lucide-react";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(0);
  const [newMessage, setNewMessage] = useState("");

  const contacts = [
    {
      name: "Sarah Chen",
      role: "Senior Designer",
      avatar: "SC",
      lastMessage: "That sounds like a great idea! When can we start?",
      time: "2m ago",
      unread: 2,
      online: true
    },
    {
      name: "Marcus Rodriguez",
      role: "Full Stack Dev",
      avatar: "MR", 
      lastMessage: "I've finished the API integration",
      time: "15m ago",
      unread: 0,
      online: true
    },
    {
      name: "Elena Vasquez",
      role: "Data Scientist",
      avatar: "EV",
      lastMessage: "Can you review the ML model results?",
      time: "1h ago",
      unread: 1,
      online: false
    },
    {
      name: "James Wilson",
      role: "Product Manager",
      avatar: "JW",
      lastMessage: "Meeting scheduled for tomorrow at 2 PM",
      time: "3h ago",
      unread: 0,
      online: false
    },
    {
      name: "Lisa Park",
      role: "Marketing Director",
      avatar: "LP",
      lastMessage: "Love the new brand direction!",
      time: "1d ago",
      unread: 0,
      online: true
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Chen",
      content: "Hey Alex! I saw your latest project on the dashboard. The UI looks amazing!",
      time: "2:30 PM",
      isMine: false
    },
    {
      id: 2,
      sender: "Me",
      content: "Thanks Sarah! I'd love to get your feedback on the user flow. Are you free for a quick call?",
      time: "2:32 PM", 
      isMine: true
    },
    {
      id: 3,
      sender: "Sarah Chen",
      content: "Absolutely! I'm free right now if you want to jump on a call.",
      time: "2:33 PM",
      isMine: false
    },
    {
      id: 4,
      sender: "Me", 
      content: "Perfect! I'll send you the Figma link in a moment.",
      time: "2:35 PM",
      isMine: true
    },
    {
      id: 5,
      sender: "Sarah Chen",
      content: "That sounds like a great idea! When can we start working on the next iteration?",
      time: "2:40 PM",
      isMine: false
    }
  ];

  const quickReplies = [
    "Sounds good!",
    "Let me check",
    "Thanks!",
    "Can we schedule a call?"
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-6rem)]">
            {/* Contacts Sidebar */}
            <div className="col-span-4">
              <GlassCard className="h-full flex flex-col animate-fade-in">
                <div className="p-6 border-b border-border/20">
                  <h2 className="text-2xl font-bold gradient-text mb-4">Messages</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      className="w-full pl-10 pr-4 py-2 bg-muted/20 border border-border/30 rounded-lg text-foreground placeholder-foreground-secondary focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {contacts.map((contact, index) => (
                    <div
                      key={contact.name}
                      onClick={() => setSelectedChat(index)}
                      className={`p-4 border-b border-border/10 cursor-pointer transition-colors hover:bg-muted/20 ${
                        selectedChat === index ? 'bg-primary/10 border-r-2 border-r-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-foreground font-semibold">
                            {contact.avatar}
                          </div>
                          {contact.online && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-semibold text-foreground truncate">{contact.name}</h3>
                            <span className="text-xs text-foreground-secondary">{contact.time}</span>
                          </div>
                          <p className="text-sm text-foreground-secondary truncate">{contact.lastMessage}</p>
                          <p className="text-xs text-foreground-secondary mt-1">{contact.role}</p>
                        </div>
                        
                        {contact.unread > 0 && (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-xs text-foreground font-medium">{contact.unread}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Chat Window */}
            <div className="col-span-8">
              <GlassCard className="h-full flex flex-col animate-slide-up">
                {/* Chat Header */}
                <div className="p-6 border-b border-border/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-foreground font-semibold">
                        {contacts[selectedChat].avatar}
                      </div>
                      {contacts[selectedChat].online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{contacts[selectedChat].name}</h3>
                      <p className="text-sm text-foreground-secondary">
                        {contacts[selectedChat].online ? 'Online' : 'Last seen 2h ago'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Star className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.isMine ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`p-4 rounded-2xl ${
                            message.isMine
                              ? 'bg-gradient-primary text-foreground ml-4'
                              : 'bg-muted/30 text-foreground mr-4'
                          }`}
                        >
                          <p className="leading-relaxed">{message.content}</p>
                        </div>
                        <p className={`text-xs text-foreground-secondary mt-2 ${
                          message.isMine ? 'text-right mr-4' : 'text-left ml-4'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  <div className="flex justify-start">
                    <div className="bg-muted/30 p-4 rounded-2xl mr-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-foreground-secondary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-foreground-secondary rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                        <div className="w-2 h-2 bg-foreground-secondary rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Quick Replies */}
                <div className="px-6 py-2 border-t border-border/20">
                  <div className="flex gap-2 mb-4">
                    <span className="text-xs text-foreground-secondary">Quick replies:</span>
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => setNewMessage(reply)}
                        className="px-3 py-1 bg-muted/20 hover:bg-muted/30 rounded-full text-xs text-foreground-secondary hover:text-foreground transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-border/20">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Image className="w-5 h-5" />
                    </Button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full px-4 py-3 bg-muted/20 border border-border/30 rounded-large text-foreground placeholder-foreground-secondary focus:outline-none focus:border-primary/50 transition-colors"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                    </div>
                    
                    <Button variant="ghost" size="icon">
                      <Smile className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Mic className="w-5 h-5" />
                    </Button>
                    <Button variant="default" size="icon" onClick={handleSendMessage}>
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}