import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { apiFetch } from '@/lib/api';
import UsernameTag from '@/components/UsernameTag';

interface UsernameAutocompleteProps {
  onSelect: (username: string) => void;
  onRemove?: (username: string) => void;
  selectedUsernames: string[];
  placeholder?: string;
  disabled?: boolean;
}

interface UsernameOption {
  username: string;
  name: string;
  displayName: string;
}

export default function UsernameAutocomplete({ 
  onSelect,
  onRemove,
  selectedUsernames, 
  placeholder = "Search usernames...",
  disabled = false 
}: UsernameAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<UsernameOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setHasSearched(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    debounceRef.current = setTimeout(async () => {
      try {
        console.log('Searching usernames for query:', query);
        const response = await apiFetch(`/api/users/search-usernames?q=${encodeURIComponent(query)}&limit=10`);
        
        console.log('Username search response:', response);
        
        if (response.success) {
          // Filter out already selected usernames
          const filteredSuggestions = response.data.usernames.filter(
            (user: UsernameOption) => !selectedUsernames.includes(user.username)
          );
          console.log('Filtered suggestions:', filteredSuggestions);
          setSuggestions(filteredSuggestions);
          setIsOpen(true);
          setHasSearched(true);
          setError('');
        } else {
          console.error('Username search failed:', response);
          setError('Failed to search usernames');
          setSuggestions([]);
          setIsOpen(false);
          setHasSearched(true);
        }
      } catch (err) {
        console.error('Username search error:', err);
        setError('Failed to search usernames');
        setSuggestions([]);
        setIsOpen(false);
        setHasSearched(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, selectedUsernames]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (username: string) => {
    onSelect(username);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0 || (hasSearched && suggestions.length === 0 && !loading)) {
              setIsOpen(true);
            }
          }}
          disabled={disabled}
          className="pl-10 pr-4 bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-10"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-500 flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isOpen && (suggestions.length > 0 || (hasSearched && suggestions.length === 0 && !loading)) && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-card border border-primary/20 rounded-xl shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.length > 0 ? (
              suggestions.map((user) => (
                <div
                  key={user.username}
                  onClick={() => handleSelect(user.username)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">
                      {user.name || user.username}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      @{user.username}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">
                    Username not available
                  </div>
                  <div className="text-sm text-muted-foreground">
                    No users found matching "{query}"
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected usernames */}
      {selectedUsernames.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedUsernames.map((username) => (
            <UsernameTag
              key={username}
              username={username}
              onRemove={onRemove ? () => onRemove(username) : undefined}
              showRemove={!!onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
