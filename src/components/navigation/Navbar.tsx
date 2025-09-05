import { Button } from "@/components/ui/button";
import { Bell, Menu, Search, User } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 p-4">
      <GlassCard className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold gradient-text">Peve</h1>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="text-foreground-secondary hover:text-foreground transition-colors">
              Home
            </a>
            <a href="/dashboard" className="text-foreground-secondary hover:text-foreground transition-colors">
              Dashboard
            </a>
            <a href="/explore" className="text-foreground-secondary hover:text-foreground transition-colors">
              Explore
            </a>
            <a href="/messages" className="text-foreground-secondary hover:text-foreground transition-colors">
              Messages
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 bg-muted/20 rounded-large px-4 py-2 min-w-[300px]">
            <Search className="w-5 h-5 text-foreground-secondary" />
            <input
              type="text"
              placeholder="Search people, projects..."
              className="bg-transparent border-none outline-none flex-1 text-foreground placeholder-foreground-secondary"
            />
          </div>
          
          <Button variant="ghost" size="icon">
            <a href="/notifications">
              <Bell className="w-5 h-5" />
            </a>
          </Button>
          
          <Button variant="ghost" size="icon">
            <a href="/profile">
              <User className="w-5 h-5" />
            </a>
          </Button>
          
          <Button variant="glass" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </GlassCard>
    </nav>
  );
}