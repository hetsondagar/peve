import { Button } from "@/components/ui/button";
import { Bell, Menu, Search, User, HelpCircle, ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Minimal navigation - only essential items in navbar
  const essentialNavItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/explore", label: "Explore" },
    { path: "/messages", label: "Messages" },
  ];

  return (
    <nav className="w-full z-50 p-6" ref={menuRef}>
      <div className="flex items-center justify-between px-8 py-6 bg-white/10 backdrop-blur-3xl rounded-2xl shadow-2xl shadow-black/20 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="hover:opacity-80 transition-all duration-300 hover:scale-105">
          <Logo size="lg" />
        </Link>
        
        {/* Essential Navigation - Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          {essentialNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-4 py-2 rounded-xl transition-all duration-500 group backdrop-blur-sm ${
                location.pathname === item.path
                  ? 'text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30'
                  : 'text-foreground-secondary hover:text-white hover:bg-white/5 hover:scale-105'
              }`}
            >
              <span className="relative z-10 text-sm font-medium">{item.label}</span>
              {location.pathname === item.path && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg shadow-primary/25"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Search - Hidden on smaller screens */}
          <motion.div 
            className="hidden xl:flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-xl px-5 py-3 min-w-[320px] hover:bg-white/15 transition-all duration-500"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <Search className="w-4 h-4 text-foreground-secondary" />
            <input
              type="text"
              placeholder="Search people, projects..."
              className="bg-transparent border-none outline-none flex-1 text-foreground placeholder-foreground-secondary text-sm"
            />
          </motion.div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative rounded-xl hover:bg-white/5 transition-all duration-500 backdrop-blur-sm"
                asChild
              >
                <Link to="/notifications">
              <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </Link>
          </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-white/5 transition-all duration-500 backdrop-blur-sm"
                asChild
              >
                <Link to="/profile">
              <User className="w-5 h-5" />
                </Link>
          </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <ThemeToggle />
            </motion.div>
            
            {/* Mobile Menu Button */}
            <motion.div 
              className="lg:hidden"
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.2 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-white/5 transition-all duration-500 backdrop-blur-sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
            <Menu className="w-5 h-5" />
                </motion.div>
          </Button>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden mt-3 mx-4"
          >
            <div className="bg-white/15 backdrop-blur-3xl rounded-2xl shadow-2xl shadow-black/30 p-8 overflow-hidden">
              <div className="space-y-3">
                {essentialNavItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`block px-4 py-3 rounded-xl transition-all duration-500 backdrop-blur-sm ${
                        location.pathname === item.path
                          ? 'text-white bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30'
                          : 'text-foreground-secondary hover:text-white hover:bg-white/5 hover:scale-105'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Search */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-xl px-5 py-4 mt-6 hover:bg-white/15 transition-all duration-500"
                >
                  <Search className="w-4 h-4 text-foreground-secondary" />
                  <input
                    type="text"
                    placeholder="Search people, projects..."
                    className="bg-transparent border-none outline-none flex-1 text-foreground placeholder-foreground-secondary text-sm"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}