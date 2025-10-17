import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, User, Lightbulb, Rocket } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  projects: any[];
  ideas: any[];
  users: any[];
  total: number;
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  placeholder = "Search projects, ideas, peers...", 
  className = "" 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search function with debouncing
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await apiFetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
        
        if (response.success) {
          setResults(response.data.results);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !results) return;

    const totalItems = (results.projects?.length || 0) + 
                      (results.ideas?.length || 0) + 
                      (results.users?.length || 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleItemClick(selectedIndex);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleItemClick = (index: number) => {
    if (!results) return;

    let currentIndex = 0;
    
    // Check projects
    if (results.projects && results.projects.length > 0) {
      if (index < results.projects.length) {
        const project = results.projects[index];
        navigate(`/projects/${project._id}`);
        setIsOpen(false);
        setQuery('');
        return;
      }
      currentIndex += results.projects.length;
    }

    // Check ideas
    if (results.ideas && results.ideas.length > 0) {
      if (index < currentIndex + results.ideas.length) {
        const idea = results.ideas[index - currentIndex];
        navigate(`/ideas/${idea._id}`);
        setIsOpen(false);
        setQuery('');
        return;
      }
      currentIndex += results.ideas.length;
    }

    // Check users
    if (results.users && results.users.length > 0) {
      if (index < currentIndex + results.users.length) {
        const user = results.users[index - currentIndex];
        navigate(`/profile/${user._id}`);
        setIsOpen(false);
        setQuery('');
        return;
      }
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Rocket className="w-4 h-4" />;
      case 'idea':
        return <Lightbulb className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className="pl-12 pr-10 bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-11"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults(null);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (results || loading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="bg-card border border-border shadow-lg max-h-96 overflow-y-auto">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Searching...</p>
                  </div>
                ) : results && results.total > 0 ? (
                  <div className="py-2">
                    {/* Projects */}
                    {results.projects && results.projects.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
                          Projects ({results.projects.length})
                        </div>
                        {results.projects.map((project, index) => (
                          <button
                            key={project._id}
                            onClick={() => handleItemClick(index)}
                            className={`w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors flex items-center gap-3 ${
                              selectedIndex === index ? 'bg-accent/50' : ''
                            }`}
                          >
                            <Rocket className="w-4 h-4 text-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{project.title}</p>
                              <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">{formatDate(project.createdAt)}</span>
                                {project.tags && project.tags.length > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {project.tags[0]}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Ideas */}
                    {results.ideas && results.ideas.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
                          Ideas ({results.ideas.length})
                        </div>
                        {results.ideas.map((idea, index) => (
                          <button
                            key={idea._id}
                            onClick={() => handleItemClick((results.projects?.length || 0) + index)}
                            className={`w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors flex items-center gap-3 ${
                              selectedIndex === (results.projects?.length || 0) + index ? 'bg-accent/50' : ''
                            }`}
                          >
                            <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{idea.title}</p>
                              <p className="text-sm text-muted-foreground truncate">{idea.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">{formatDate(idea.createdAt)}</span>
                                {idea.category && (
                                  <Badge variant="secondary" className="text-xs">
                                    {idea.category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Users */}
                    {results.users && results.users.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
                          Users ({results.users.length})
                        </div>
                        {results.users.map((user, index) => (
                          <button
                            key={user._id}
                            onClick={() => handleItemClick((results.projects?.length || 0) + (results.ideas?.length || 0) + index)}
                            className={`w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors flex items-center gap-3 ${
                              selectedIndex === (results.projects?.length || 0) + (results.ideas?.length || 0) + index ? 'bg-accent/50' : ''
                            }`}
                          >
                            <User className="w-4 h-4 text-teal-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{user.username}</p>
                              <p className="text-sm text-muted-foreground truncate">{user.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {user.skills && user.skills.length > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {user.skills[0]}
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {user.role || 'Developer'}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* View All Results */}
                    <div className="px-4 py-2 border-t border-border">
                      <button
                        onClick={() => {
                          navigate(`/search?q=${encodeURIComponent(query)}`);
                          setIsOpen(false);
                          setQuery('');
                        }}
                        className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        View all {results.total} results
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No results found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try different keywords</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
