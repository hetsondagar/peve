import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import Avatar from '@/components/Avatar';
import { apiFetch } from '@/lib/api';

interface NavbarProps {
  currentPage?: string;
}

export default function Navbar({ currentPage = 'home' }: NavbarProps) {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiFetch('/api/auth/me');
        if (response.success) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNavButtonClass = (page: string) => {
    return currentPage === page 
      ? "text-primary" 
      : "text-muted-foreground hover:text-primary transition-colors";
  };

  return (
    <nav className="navbar safe-area-top">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Nav */}
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <img src={'/final.png'} alt="peve" className="w-8 h-8 md:w-12 md:h-12" />
              <button onClick={() => navigate('/home')} className="text-xl md:text-2xl font-bold brand-peve">peve</button>
            </div>
            <div className="hidden lg:flex gap-6">
              <button 
                onClick={() => navigate('/home')} 
                className={getNavButtonClass('home')}
              >
                Explore
              </button>
              <button 
                onClick={() => navigate('/ideas')} 
                className={getNavButtonClass('ideas')}
              >
                Ideas
              </button>
              <button 
                onClick={() => navigate('/projects')} 
                className={getNavButtonClass('projects')}
              >
                Projects
              </button>
              <button 
                onClick={() => navigate('/codetalks')} 
                className={getNavButtonClass('codetalks')}
              >
                CodeTalks
              </button>
              <button 
                onClick={() => navigate('/leaderboard')} 
                className={getNavButtonClass('leaderboard')}
              >
                Leaderboard
              </button>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
            <SearchBar />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors touch-target">
              <Bell className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
            </button>
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="p-1 rounded-lg hover:bg-primary/10 transition-colors touch-target"
              >
                {user ? (
                  <Avatar
                    username={user.username || user.name || 'User'}
                    avatarStyle={user.avatarStyle || 'botttsNeutral'}
                    size={28}
                    className="border-2 border-transparent hover:border-primary/20 md:w-8 md:h-8"
                  />
                ) : (
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">?</span>
                  </div>
                )}
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-36 md:w-40 rounded-xl glass border border-border p-2 z-50">
                  <button 
                    onClick={() => { navigate('/profile'); setShowProfileDropdown(false); }} 
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10 touch-friendly"
                  >
                    Profile
                  </button>
                  <button 
                    onClick={() => { localStorage.removeItem('peve_token'); navigate('/login'); setShowProfileDropdown(false); }} 
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10 touch-friendly"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="md:hidden mt-3">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
}
