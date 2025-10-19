import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { GlowButton } from '@/components/ui/glow-button';
import { NetworkBackground } from '@/components/NetworkBackground';
import { apiFetch, setAuthTokens } from '@/lib/api';
import { TECH_SKILLS, ALL_SKILLS } from '@/data/skills';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import OnboardingModal from '@/components/OnboardingModal';
import ProfileCompletionModal from '@/components/ProfileCompletionModal';
import { startTokenRefresh } from '@/lib/tokenRefresh';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const validateUsername = (username: string) => {
    if (username.length < 3) return 'Username must be at least 3 characters long';
    if (username.length > 20) return 'Username cannot exceed 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return '';
  };

  const validateFullName = (fullName: string) => {
    if (!fullName.trim()) return 'Full name is required';
    if (fullName.length < 2) return 'Full name must be at least 2 characters long';
    if (fullName.length > 50) return 'Full name cannot exceed 50 characters';
    if (!/^[a-zA-Z\s]+$/.test(fullName)) return 'Full name can only contain letters and spaces';
    return '';
  };

  const checkUsernameAvailability = async (username: string) => {
    if (!username || validateUsername(username)) return;
    
    try {
      const response = await apiFetch(`/api/auth/check-username/${username}`);
      if (!response.data.available) {
        setUsernameError('Username is already taken');
      } else {
        setUsernameError('');
      }
    } catch (error) {
      console.error('Failed to check username availability:', error);
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    const validationError = validateUsername(value);
    setUsernameError(validationError);
  };

  // Debounced username availability check
  useEffect(() => {
    if (!username || validateUsername(username)) return;
    
    const timeoutId = setTimeout(() => {
      if (username.length >= 3) {
        checkUsernameAvailability(username);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    setFullNameError(validateFullName(value));
  };

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill) && selectedSkills.length < 10) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillSearch('');
    setShowSkillDropdown(false);
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const filteredSkills = ALL_SKILLS.filter(skill =>
    skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
    !selectedSkills.includes(skill)
  ).slice(0, 10);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSkillDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate required fields
    if (!isLogin) {
      if (!username || !fullName || !email || !password) {
        setError('Please fill in all required fields');
        return;
      }
      if (usernameError) {
        setError(usernameError);
        return;
      }
      if (fullNameError) {
        setError(fullNameError);
        return;
      }
    } else {
      if (!emailOrUsername || !password) {
        setError('Please fill in all required fields');
        return;
      }
    }
    
    try {
      if (isLogin) {
        console.log('Login attempt:', { emailOrUsername, password: '***' });
        const res = await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ emailOrUsername, password }) });
        setAuthTokens(res.data.token, res.data.refreshToken);
        startTokenRefresh(); // Start automatic token refresh
        
        // Check if onboarding is completed
        if (!res.data.user.onboardingCompleted) {
          setCurrentUser(res.data.user);
          setShowOnboarding(true);
          return;
        }
        
        // Check if profile is completed
        if (!res.data.user.profileComplete) {
          setCurrentUser(res.data.user);
          setShowProfileCompletion(true);
          return;
        }
      } else {
        const signupData = { username, name: fullName, email, password, skills: selectedSkills };
        console.log('Signup attempt:', { ...signupData, password: '***' });
        const res = await apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify(signupData) });
        setAuthTokens(res.data.token, res.data.refreshToken);
        startTokenRefresh(); // Start automatic token refresh
        
        // New users always need to complete onboarding
        setCurrentUser(res.data.user);
        setShowOnboarding(true);
        return;
      }
      navigate('/home');
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred');
    }
  };

  const handleOnboardingComplete = (updatedUser: any) => {
    setShowOnboarding(false);
    setCurrentUser(updatedUser);
    // Check if profile completion is needed after onboarding
    if (!updatedUser.profileComplete) {
      setShowProfileCompletion(true);
    } else {
      setCurrentUser(null);
      navigate('/home');
    }
  };

  const handleProfileCompletion = (updatedUser: any) => {
    setShowProfileCompletion(false);
    setCurrentUser(null);
    navigate('/home');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <NetworkBackground />
      
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo */
        }
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center mb-3"
        >
          <div className="relative mb-0.5">
            <motion.img
              src={'/final.png'}
              alt="peve hive logo"
              className="w-36 h-36"
              animate={{
                filter: [
                  'drop-shadow(0 0 20px rgba(0, 232, 232, 0.4))',
                  'drop-shadow(0 0 40px rgba(0, 232, 232, 0.6))',
                  'drop-shadow(0 0 20px rgba(0, 232, 232, 0.4))',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <h1 className="text-4xl font-bold brand-peve mb-1">peve</h1>
          <p className="text-lg bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent font-medium">
            your peers, your hive
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-8 space-y-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Username *"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className={`bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12 ${usernameError ? 'border-red-500' : ''}`}
                    required
                  />
                  {usernameError && (
                    <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Full Name *"
                    value={fullName}
                    onChange={(e) => handleFullNameChange(e.target.value)}
                    className={`bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12 ${fullNameError ? 'border-red-500' : ''}`}
                    required
                  />
                  {fullNameError && (
                    <p className="text-red-500 text-sm mt-1">{fullNameError}</p>
                  )}
                </div>
              </>
            )}
            <div className="space-y-2">
              <Input
                type={isLogin ? "text" : "email"}
                placeholder={isLogin ? "Email or Username *" : "Email *"}
                value={isLogin ? emailOrUsername : email}
                onChange={(e) => isLogin ? setEmailOrUsername(e.target.value) : setEmail(e.target.value)}
                className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12"
                required
              />
            </div>

            {!isLogin && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Skills (Optional)</label>
                
                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <Badge key={skill} variant="teal" className="flex items-center gap-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Skill Search */}
                <div className="relative" ref={dropdownRef}>
                  <Input
                    type="text"
                    placeholder="Search and add skills..."
                    value={skillSearch}
                    onChange={(e) => {
                      setSkillSearch(e.target.value);
                      setShowSkillDropdown(true);
                    }}
                    onFocus={() => setShowSkillDropdown(true)}
                    className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-10"
                  />
                  
                  {/* Skills Dropdown */}
                  {showSkillDropdown && skillSearch && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                      {filteredSkills.length > 0 ? (
                        filteredSkills.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => addSkill(skill)}
                            className="w-full text-left px-3 py-2 hover:bg-primary/10 transition-colors text-sm"
                          >
                            {skill}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          No skills found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Add up to 10 skills to help others find you for collaboration
                </p>
              </div>
            )}

            <GlowButton type="submit" className="w-full" size="lg">
              {isLogin ? 'Login to the Hive' : 'Create Hive Account'}
            </GlowButton>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin
                ? "Don't have an account? Create one"
                : 'Already have an account? Login'}
            </button>
          </div>
        </motion.div>

        {/* Footer Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-center text-xs text-muted-foreground/50 mt-8"
        >
          The hive awakens...
        </motion.p>
      </motion.div>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />
      
      <ProfileCompletionModal
        isOpen={showProfileCompletion}
        onComplete={handleProfileCompletion}
        currentUser={currentUser}
      />
    </div>
  );
}
