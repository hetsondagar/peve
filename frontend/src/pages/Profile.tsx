import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { NetworkBackground } from '@/components/NetworkBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GlowButton } from '@/components/ui/glow-button';
import { Input } from '@/components/ui/input';
import { Trophy, Lightbulb, Rocket, Users, Settings, X, Plus, Edit3, UserCheck, MessageCircle, Heart, Bookmark, Github, MessageSquare, Linkedin, Award, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TECH_SKILLS, ALL_SKILLS } from '@/data/skills';
import CompatibilityWizard from '@/components/CompatibilityWizard';
import MyRequests from '@/components/MyRequests';
import EditProfileModal from '@/components/EditProfileModal';
import Avatar from '@/components/Avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiFetch } from '@/lib/api';


export default function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [loading, setLoading] = useState(true);
  const [editingSkills, setEditingSkills] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [userIdeas, setUserIdeas] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [likedItems, setLikedItems] = useState<any[]>([]);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [showCompatibilityWizard, setShowCompatibilityWizard] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [compatibilityProfile, setCompatibilityProfile] = useState<any>(null);
  const [userRank, setUserRank] = useState<any>(null);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [badgeStats, setBadgeStats] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Determine if this is own profile or viewing another user's profile
        const isViewingOtherProfile = userId && userId !== 'me';
        setIsOwnProfile(!isViewingOtherProfile);
        
        // Fetch user profile
        const endpoint = isViewingOtherProfile ? `/api/users/${userId}` : '/api/auth/me';
        console.log('Fetching user data from endpoint:', endpoint);
        const userResponse = await apiFetch(endpoint);
        
        const userData = userResponse.data;
        console.log('User data received:', userData);
        console.log('User skills:', userData.skills);
        console.log('User response success:', userResponse.success);
        
        if (!userData) {
          console.error('No user data received from API');
          return;
        }
        
        setUser(userData);
        setSelectedSkills(userData.skills || []);

        // Fetch user's projects
        const projectsResponse = await apiFetch('/api/projects');
        const userProjects = projectsResponse.data.items.filter((project: any) => 
          project.author?._id === userData._id || project.author === userData._id
        );
        setUserProjects(userProjects);


        // Fetch user's ideas
        const ideasResponse = await apiFetch('/api/ideas');
        const userIdeas = ideasResponse.data.items.filter((idea: any) => 
          idea.author?._id === userData._id || idea.author === userData._id
        );
        setUserIdeas(userIdeas);

        // Fetch compatibility profile and badges
        if (!isViewingOtherProfile) {
          try {
            const compatibilityResponse = await apiFetch('/api/compatibility/profile');
            setCompatibilityProfile(compatibilityResponse.data.compatibilityProfile);
          } catch (error) {
            console.error('Failed to fetch compatibility profile:', error);
          }

          // Fetch user's liked and saved items (only for own profile)
          try {
            const [likesResponse, savesResponse] = await Promise.all([
              apiFetch('/api/interactions/likes'),
              apiFetch('/api/interactions/saves')
            ]);
            
            console.log('Likes response:', likesResponse);
            console.log('Saves response:', savesResponse);
            
            if (likesResponse.success && likesResponse.data) {
              setLikedItems(likesResponse.data);
            }
            if (savesResponse.success && savesResponse.data) {
              setSavedItems(savesResponse.data);
            }
          } catch (error) {
            console.error('Failed to fetch interactions:', error);
          }
        } else {
          try {
            const compatibilityResponse = await apiFetch(`/api/compatibility/profile/${userData._id}`);
            setCompatibilityProfile(compatibilityResponse.data.compatibilityProfile);
          } catch (error) {
            console.error('Failed to fetch other user compatibility profile:', error);
          }
          try {
            const badgesResponse = await apiFetch(`/api/badges/user/${userData._id}`);
            setUserBadges(badgesResponse.data || []);
          } catch (error) {
            console.error('Failed to fetch other user badges:', error);
          }
        }

        // Fetch user's rank and badges (only for own profile)
        if (!isViewingOtherProfile) {
          try {
            const [rankResponse, badgesResponse, badgeStatsResponse] = await Promise.all([
              apiFetch('/api/leaderboard/rank'),
              apiFetch('/api/badges/user'),
              apiFetch('/api/badges/stats')
            ]);
            
            console.log('Rank response:', rankResponse);
            console.log('Badges response:', badgesResponse);
            console.log('Badge stats response:', badgeStatsResponse);
            
            if (rankResponse.success && rankResponse.data) {
              setUserRank(rankResponse.data);
            }
            if (badgesResponse.success && badgesResponse.data) {
              setUserBadges(badgesResponse.data);
            }
            if (badgeStatsResponse.success && badgeStatsResponse.data) {
              setBadgeStats(badgeStatsResponse.data);
            }
          } catch (error) {
            console.error('Failed to fetch rank and badges:', error);
          }
        }

        // Generate achievements based on user stats
        const userStats = userData.stats || {};
        const generatedAchievements = [];
        
        if (userStats.projectsUploaded > 0) {
          generatedAchievements.push({
            year: new Date().getFullYear(),
            month: new Date().toLocaleDateString('en-US', { month: 'short' }),
            title: 'Project Creator',
            description: `Created ${userStats.projectsUploaded} project${userStats.projectsUploaded > 1 ? 's' : ''}`,
            icon: Rocket,
            color: 'primary'
          });
        }
        
        if (userStats.ideasPosted > 0) {
          generatedAchievements.push({
            year: new Date().getFullYear(),
            month: new Date().toLocaleDateString('en-US', { month: 'short' }),
            title: 'Idea Pioneer',
            description: `Shared ${userStats.ideasPosted} idea${userStats.ideasPosted > 1 ? 's' : ''} with the hive`,
            icon: Lightbulb,
            color: 'secondary'
          });
        }
        
        if (userStats.collaborationsJoined > 0) {
          generatedAchievements.push({
            year: new Date().getFullYear(),
            month: new Date().toLocaleDateString('en-US', { month: 'short' }),
            title: 'Team Player',
            description: `Joined ${userStats.collaborationsJoined} collaboration${userStats.collaborationsJoined > 1 ? 's' : ''}`,
            icon: Users,
            color: 'accent'
          });
        }
        
        if (userStats.likesReceived > 10) {
          generatedAchievements.push({
            year: new Date().getFullYear(),
            month: new Date().toLocaleDateString('en-US', { month: 'short' }),
            title: 'Popular Creator',
            description: `Received ${userStats.likesReceived} likes from peers`,
            icon: Trophy,
            color: 'primary'
          });
        }
        
        setAchievements(generatedAchievements);

      } catch (error) {
        console.error('Failed to fetch user data:', error);
        console.error('Error details:', error);
        // Set a default user object to prevent the component from breaking
        setUser({
          username: 'Unknown User',
          name: 'Unknown User',
          role: 'Developer',
          skills: [],
          bio: 'User not found',
          avatarStyle: 'botttsNeutral'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleCompatibilityComplete = async () => {
    setShowCompatibilityWizard(false);
    
    // Refresh compatibility profile
    try {
      const compatibilityResponse = await apiFetch('/api/compatibility/profile');
      setCompatibilityProfile(compatibilityResponse.data.compatibilityProfile);
    } catch (error) {
      console.error('Failed to fetch updated compatibility profile:', error);
    }
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

  const saveSkills = async () => {
    try {
      await apiFetch('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ skills: selectedSkills })
      });
      setEditingSkills(false);
      // Update user state
      setUser({ ...user, skills: selectedSkills });
    } catch (error) {
      console.error('Failed to save skills:', error);
    }
  };

  const handleProfileUpdate = (updatedUser: any) => {
    setUser(updatedUser);
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

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <NetworkBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NetworkBackground />
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <img src={'/final.png'} alt="peve" className="w-12 h-12" />
              <button onClick={() => navigate('/home')} className="text-2xl font-bold brand-peve">peve</button>
            </div>
            <div className="hidden md:flex gap-6">
              <button onClick={() => navigate('/home')} className="text-muted-foreground hover:text-primary transition-colors">Explore</button>
              <button onClick={() => navigate('/codetalks')} className="text-muted-foreground hover:text-primary transition-colors">CodeTalks</button>
              <button onClick={() => navigate('/profile')} className="text-primary">Profile</button>
            </div>
          </div>
          <div className="text-3xl">👤</div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Profile Header - Show when viewing someone else's profile */}
        {!isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <div className="h-6 w-px bg-border"></div>
                <div className="flex items-center gap-3">
                  <Avatar 
                    username={user?.username || 'user'} 
                    avatarStyle={user?.avatarStyle || 'botttsNeutral'} 
                    size={40} 
                  />
                  <div>
                    <h1 className="text-2xl font-bold gradient-text">{user?.username || 'User'}</h1>
                    <p className="text-sm text-muted-foreground">Viewing {user?.name || user?.role || 'Developer'}'s profile</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="glass border-primary/20 glow-turquoise text-center">
                <CardContent className="p-6 space-y-4">
                  <Avatar 
                    username={user?.username || 'user'} 
                    avatarStyle={user?.avatarStyle || 'botttsNeutral'} 
                    size={96} 
                    className="mx-auto"
                  />
                  <div>
                    <h2 className="text-xl font-bold"><span className="gradient-text">{user?.username || 'User'}</span></h2>
                    <p className="text-sm text-muted-foreground">{user?.name || user?.role || 'Developer'}</p>
                  </div>
                  {userRank ? (
                    <Badge className="bg-primary/20 text-primary">
                      <Trophy className="w-3 h-3 mr-1" />
                      Rank #{userRank.rank}
                    </Badge>
                  ) : userBadges.length > 0 ? (
                    <Badge className="bg-primary/20 text-primary">
                      <Award className="w-3 h-3 mr-1" />
                      {userBadges[0].name}
                    </Badge>
                  ) : (
                    <Badge className="bg-primary/20 text-primary">
                      <Trophy className="w-3 h-3 mr-1" />
                      New Member
                    </Badge>
                  )}
                  <div className="pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Projects</span>
                      <span className="text-foreground font-semibold">{user?.stats?.projectsUploaded || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ideas</span>
                      <span className="text-foreground font-semibold">{user?.stats?.ideasPosted || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connections</span>
                      <span className="text-foreground font-semibold">{user?.followers?.length || 0}</span>
                    </div>
                  </div>

                  {/* Logout Button - Only for own profile */}
                  {isOwnProfile && (
                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={() => {
                          localStorage.removeItem('peve_token');
                          navigate('/login');
                        }}
                        className="w-full px-4 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  )}

                  {/* Badges Section */}
                  {userBadges.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-border">
                      <h3 className="text-sm font-semibold text-foreground">Badges Earned</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {userBadges.slice(0, 6).map((badge, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                            <span className="text-lg">{badge.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-foreground truncate">
                                {badge.name}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {badge.pointsAwarded} pts
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {userBadges.length > 6 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{userBadges.length - 6} more badges
                        </div>
                      )}
                      {badgeStats && (
                        <div className="text-xs text-muted-foreground text-center">
                          {badgeStats.earnedBadges}/{badgeStats.totalBadges} badges earned
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contact Information */}
                  {(user?.githubUsername || user?.discordUsername || user?.linkedinUrl) && (
                    <div className="space-y-3 pt-4 border-t border-border">
                      <h3 className="text-sm font-semibold text-foreground">Contact Information</h3>
                      {user?.githubUsername && (
                        <div className="flex items-center gap-2 text-sm">
                          <Github className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">GitHub:</span>
                          <a 
                            href={`https://github.com/${user.githubUsername}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {user.githubUsername}
                          </a>
                        </div>
                      )}
                      {user?.discordUsername && (
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Discord:</span>
                          <span className="text-foreground">{user.discordUsername}</span>
                        </div>
                      )}
                      {user?.linkedinUrl && (
                        <div className="flex items-center gap-2 text-sm">
                          <Linkedin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">LinkedIn:</span>
                          <a 
                            href={user.linkedinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                          >
                            View Profile
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Edit Profile Button - Only for own profile */}
                  {isOwnProfile && (
                    <GlowButton 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setShowEditProfile(true)}
                    >
                      <Settings className="w-4 h-4" />
                      Edit Profile
                    </GlowButton>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills Management */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Skills</CardTitle>
                    {/* Edit Skills Button - Only for own profile */}
                    {isOwnProfile && (
                      <button
                        onClick={() => setEditingSkills(!editingSkills)}
                        className="p-1 hover:bg-primary/10 rounded transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Current Skills */}
                  <div className="flex flex-wrap gap-2">
                    {user?.skills?.map((skill: string) => (
                      <Badge key={skill} variant="teal" className="flex items-center gap-1">
                        {skill}
                        {editingSkills && isOwnProfile && (
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                    {(!user?.skills || user.skills.length === 0) && (
                      <p className="text-sm text-muted-foreground">
                        {isOwnProfile ? "No skills added yet. Click edit to add skills!" : "No skills added yet."}
                      </p>
                    )}
                  </div>

                  {/* Add Skills - Only for own profile */}
                  {editingSkills && isOwnProfile && (
                    <div className="space-y-2">
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
                          className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-8 text-sm"
                        />
                        
                        {/* Skills Dropdown */}
                        {showSkillDropdown && skillSearch && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 max-h-32 overflow-y-auto">
                            {filteredSkills.length > 0 ? (
                              filteredSkills.map((skill) => (
                                <button
                                  key={skill}
                                  type="button"
                                  onClick={() => addSkill(skill)}
                                  className="w-full text-left px-3 py-1 hover:bg-primary/10 transition-colors text-xs"
                                >
                                  {skill}
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-1 text-xs text-muted-foreground">
                                No skills found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <GlowButton size="sm" onClick={saveSkills} className="flex-1">
                          Save
                        </GlowButton>
                        <GlowButton size="sm" variant="outline" onClick={() => setEditingSkills(false)}>
                          Cancel
                        </GlowButton>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Compatibility Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Compatibility Settings
                    </CardTitle>
                    {isOwnProfile && (
                      <GlowButton
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCompatibilityWizard(true)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </GlowButton>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {compatibilityProfile ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Skills & Roles</h4>
                        <div className="flex flex-wrap gap-1">
                          {compatibilityProfile.skills?.slice(0, 3).map((skill: string) => (
                            <Badge key={skill} variant="teal" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {compatibilityProfile.skills?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{compatibilityProfile.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Availability</h4>
                        <p className="text-xs text-muted-foreground">
                          {compatibilityProfile.availabilityHours} hours/week • {compatibilityProfile.preferredWorkHours}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Work Style</h4>
                        <p className="text-xs text-muted-foreground">
                          {compatibilityProfile.workStyle?.teamPreference} • {compatibilityProfile.workStyle?.pace}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <UserCheck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">
                        {isOwnProfile 
                          ? "Complete your compatibility profile to find better matches"
                          : "Compatibility profile not set up yet"
                        }
                      </p>
                      {isOwnProfile && (
                        <GlowButton
                          size="sm"
                          onClick={() => setShowCompatibilityWizard(true)}
                        >
                          Setup Profile
                        </GlowButton>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

          </div>

          {/* Center - Main Content with Tabs */}
          <div className={`${isOwnProfile ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold mb-2">
                <span className="gradient-text">
                  {isOwnProfile ? 'My Profile' : `${user?.username || 'User'}'s Profile`}
                </span>
              </h1>
              <p className="text-muted-foreground">
                {isOwnProfile 
                  ? 'Manage your profile, view achievements, and track your progress'
                  : `Explore ${user?.name || user?.username || 'this user'}'s projects, ideas, and achievements`
                }
              </p>
            </motion.div>

            <Tabs defaultValue="achievements" className="w-full">
              <TabsList className={`grid w-full ${isOwnProfile ? 'grid-cols-3' : 'grid-cols-3'}`}>
                <TabsTrigger value="achievements" className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Achievements
                </TabsTrigger>
                {isOwnProfile ? (
                  <TabsTrigger value="requests" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    My Requests
                  </TabsTrigger>
                ) : (
                  <TabsTrigger value="projects" className="flex items-center gap-2">
                    <Rocket className="w-4 h-4" />
                    Projects & Ideas
                  </TabsTrigger>
                )}
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="achievements" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-2xl font-bold mb-6"><span className="gradient-text">Achievements</span> Timeline</h2>
                  
                  <div className="relative">
                    {/* Vertical glowing line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent opacity-50" />
                    
                    <div className="space-y-8">
                      {achievements.map((achievement, index) => {
                        const IconComponent = achievement.icon;
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className="relative pl-16"
                          >
                            {/* Icon Node */}
                            <div className={`absolute left-0 w-12 h-12 rounded-full bg-${achievement.color} flex items-center justify-center glow-turquoise`}>
                              <IconComponent className="w-6 h-6 text-primary-foreground" />
                            </div>

                            <Card className="glass border-border hover-glow cursor-pointer group">
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-lg font-semibold text-foreground">
                                    {achievement.title}
                                  </h3>
                                  <Badge variant="outline" className="text-xs">{achievement.month} {achievement.year}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {isOwnProfile && (
                <TabsContent value="requests" className="space-y-6">
                  <MyRequests />
                </TabsContent>
              )}

              {!isOwnProfile && (
                <TabsContent value="projects" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">
                      <span className="gradient-text">{user?.username || 'User'}'s</span> Projects & Ideas
                    </h2>
                    
                    {/* Projects Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-primary" />
                        Projects ({userProjects.length})
                      </h3>
                      {userProjects.length > 0 ? (
                        <div className="grid gap-4">
                          {userProjects.slice(0, 3).map((project) => (
                            <Card key={project._id} className="glass border-border hover:border-primary/20 transition-colors">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-foreground mb-1">{project.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">{project.tagline}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Heart className="w-3 h-3" />
                                        {project.metrics?.likes || 0}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <MessageCircle className="w-3 h-3" />
                                        {project.metrics?.comments || 0}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        {project.metrics?.views || 0}
                                      </span>
                                    </div>
                                  </div>
                                  <GlowButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/projects/${project._id}`)}
                                  >
                                    View
                                  </GlowButton>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {userProjects.length > 3 && (
                            <div className="text-center">
                              <GlowButton 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/projects?author=${user?._id || userId}`)}
                              >
                                View All {userProjects.length} Projects
                              </GlowButton>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Rocket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No projects yet</p>
                        </div>
                      )}
                    </div>

                    {/* Ideas Section */}
                    <div className="space-y-4 pt-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        Ideas ({userIdeas.length})
                      </h3>
                      {userIdeas.length > 0 ? (
                        <div className="grid gap-4">
                          {userIdeas.slice(0, 3).map((idea) => (
                            <Card key={idea._id} className="glass border-border hover:border-primary/20 transition-colors">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-foreground mb-1">{idea.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">{idea.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Heart className="w-3 h-3" />
                                        {idea.metrics?.likes || 0}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <MessageCircle className="w-3 h-3" />
                                        {idea.metrics?.comments || 0}
                                      </span>
                                    </div>
                                  </div>
                                  <GlowButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/ideaboard`)}
                                  >
                                    View
                                  </GlowButton>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {userIdeas.length > 3 && (
                            <div className="text-center">
                              <GlowButton variant="outline" size="sm">
                                View All {userIdeas.length} Ideas
                              </GlowButton>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No ideas yet</p>
                        </div>
                      )}
                    </div>

                  </motion.div>
                </TabsContent>
              )}

              <TabsContent value="activity" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-2xl font-bold mb-6">
                    <span className="gradient-text">
                      {isOwnProfile ? 'Recent' : `${user?.username || 'User'}'s Recent`}
                    </span> Activity
                  </h2>
                  
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile 
                        ? 'Your recent collaboration and project activity will appear here'
                        : `${user?.name || user?.username || 'This user'} hasn't been active recently`
                      }
                    </p>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Projects & Ideas - Only for own profile */
          }
          {isOwnProfile && (
            <div className="lg:col-span-1 space-y-6">
            {/* My Projects - Only for own profile */}
            {isOwnProfile && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="glass border-border">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-accent" />
                      My Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {userProjects.map((project, i) => (
                      <div key={i} className="p-3 rounded-xl bg-card-secondary hover:bg-primary/5 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-foreground">{project.title}</div>
                          <Badge className={`text-xs ${
                            project.status === 'completed' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                          }`}>
                            {project.status === 'completed' ? 'Live' : project.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {(project.techStack || []).slice(0, 3).map((tech: string, j: number) => (
                            <span key={j} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                              {tech}
                            </span>
                          ))}
                          {(project.techStack || []).length > 3 && (
                            <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                              +{(project.techStack || []).length - 3}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            <span>{project.metrics?.likes || 0} likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{project.metrics?.comments || 0} comments</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{project.metrics?.views || 0} views</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Collaborations section removed */}

            {/* My Ideas - Only for own profile */}
            {isOwnProfile && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass border-border">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-secondary" />
                      My Ideas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {userIdeas.map((idea, i) => (
                      <div key={i} className="p-3 rounded-xl bg-card-secondary hover:bg-primary/5 transition-colors cursor-pointer">
                        <div className="text-sm font-semibold text-foreground mb-1">{idea.title}</div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            <span>{idea.likes || 0} likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{idea.commentCount || 0} comments</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{idea.views || 0} views</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Liked Items - Only for own profile */}
            {isOwnProfile && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    Liked Items ({likedItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {likedItems.length > 0 ? (
                    likedItems.slice(0, 5).map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-card-secondary hover:bg-primary/5 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-foreground">
                            {item.targetId?.title || item.targetId?.question || item.targetId?.name || 'Untitled'}
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {item.targetType}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {item.targetId?.description || item.targetId?.content || item.targetId?.summary || 'No description available'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No liked items yet</p>
                      <p className="text-xs mt-1">Like projects, ideas, or comments to see them here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              </motion.div>
            )}

            {/* Saved Items - Only for own profile */}
            {isOwnProfile && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-blue-500" />
                    Saved Items ({savedItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {savedItems.length > 0 ? (
                    savedItems.slice(0, 5).map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-card-secondary hover:bg-primary/5 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-foreground">
                            {item.targetId?.title || item.targetId?.question || item.targetId?.name || 'Untitled'}
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {item.targetType}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {item.targetId?.description || item.targetId?.content || item.targetId?.summary || 'No description available'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No saved items yet</p>
                      <p className="text-xs mt-1">Save projects, ideas, or comments to see them here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              </motion.div>
            )}
            </div>
          )}
        </div>
      </div>

      {/* Compatibility Setup Wizard - Only for own profile */}
      {isOwnProfile && (
        <CompatibilityWizard
          isOpen={showCompatibilityWizard}
          onClose={() => setShowCompatibilityWizard(false)}
          onComplete={handleCompatibilityComplete}
        />
      )}

      {/* Edit Profile Modal - Only for own profile */}
      {isOwnProfile && (
        <EditProfileModal
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          currentUser={user}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}
