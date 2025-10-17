import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Rocket, Lightbulb, User, Calendar, Tag } from 'lucide-react';
import { NetworkBackground } from '@/components/NetworkBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GlowButton } from '@/components/ui/glow-button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiFetch } from '@/lib/api';
import SearchBar from '@/components/SearchBar';
import UsernameLink from '@/components/UsernameLink';
import Avatar from '@/components/Avatar';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      const response = await apiFetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=20`);
      
      if (response.success) {
        setResults(response.data.results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setSearchParams({ q: searchQuery });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const ProjectCard = ({ project }: { project: any }) => (
    <Card className="glass border-border hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => navigate(`/projects/${project._id}`)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-foreground truncate">
              {project.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>
          <Rocket className="w-5 h-5 text-primary flex-shrink-0 ml-2" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            {project.author?._id ? (
              <UsernameLink
                username={project.author.username || 'Unknown'}
                userId={project.author._id}
                className="text-sm"
              />
            ) : (
              <span className="text-muted-foreground">Unknown</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{formatDate(project.createdAt)}</span>
          </div>
        </div>
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {project.tags.slice(0, 3).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const IdeaCard = ({ idea }: { idea: any }) => (
    <Card className="glass border-border hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => navigate(`/ideas/${idea._id}`)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-foreground truncate">
              {idea.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {idea.description}
            </p>
          </div>
          <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 ml-2" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            {idea.author?._id ? (
              <UsernameLink
                username={idea.author.username || 'Unknown'}
                userId={idea.author._id}
                className="text-sm"
              />
            ) : (
              <span className="text-muted-foreground">Unknown</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{formatDate(idea.createdAt)}</span>
          </div>
        </div>
        {idea.category && (
          <div className="flex items-center gap-2 mt-3">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <Badge variant="secondary" className="text-xs">
              {idea.category}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const UserCard = ({ user }: { user: any }) => (
    <Card className="glass border-border hover:border-primary/30 transition-colors cursor-pointer"
          onClick={() => navigate(`/profile/${user._id}`)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar 
            username={user.username || 'user'} 
            avatarStyle={user.avatarStyle || 'botttsNeutral'} 
            size={48} 
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">{user.username}</h3>
              <User className="w-4 h-4 text-teal-500" />
            </div>
            <p className="text-sm text-muted-foreground truncate">{user.name}</p>
            {user.bio && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{user.bio}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {user.skills && user.skills.slice(0, 2).map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {user.role && (
                <Badge variant="outline" className="text-xs">
                  {user.role}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NetworkBackground />
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Nav */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <img src={'/final.png'} alt="peve" className="w-12 h-12" />
                <button onClick={() => navigate('/home')} className="text-2xl font-bold brand-peve">peve</button>
              </div>
              <div className="hidden md:flex gap-6">
                <button onClick={() => navigate('/home')} className="text-muted-foreground hover:text-primary transition-colors">Explore</button>
                <button onClick={() => navigate('/ideas')} className="text-muted-foreground hover:text-primary transition-colors">Ideas</button>
                <button onClick={() => navigate('/projects')} className="text-muted-foreground hover:text-primary transition-colors">Projects</button>
                <button onClick={() => navigate('/codetalks')} className="text-muted-foreground hover:text-primary transition-colors">CodeTalks</button>
                <button onClick={() => navigate('/leaderboard')} className="text-muted-foreground hover:text-primary transition-colors">Leaderboard</button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <SearchBar />
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              <GlowButton onClick={() => navigate('/profile')} size="sm">
                Profile
              </GlowButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-muted-foreground">
              Results for "<span className="text-primary font-medium">{query}</span>"
            </p>
          )}
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <SearchBar 
            placeholder="Search projects, ideas, peers..."
            className="max-w-2xl"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Searching...</span>
          </div>
        ) : results ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">
                All ({results.total})
              </TabsTrigger>
              <TabsTrigger value="projects">
                Projects ({results.projects?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="ideas">
                Ideas ({results.ideas?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="users">
                Users ({results.users?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {/* Projects */}
              {results.projects && results.projects.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-primary" />
                    Projects ({results.projects.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.projects.map((project: any) => (
                      <ProjectCard key={project._id} project={project} />
                    ))}
                  </div>
                </div>
              )}

              {/* Ideas */}
              {results.ideas && results.ideas.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Ideas ({results.ideas.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.ideas.map((idea: any) => (
                      <IdeaCard key={idea._id} idea={idea} />
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {results.users && results.users.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-teal-500" />
                    Users ({results.users.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.users.map((user: any) => (
                      <UserCard key={user._id} user={user} />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects">
              {results.projects && results.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.projects.map((project: any) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Rocket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No projects found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ideas">
              {results.ideas && results.ideas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.ideas.map((idea: any) => (
                    <IdeaCard key={idea._id} idea={idea} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No ideas found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="users">
              {results.users && results.users.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.users.map((user: any) => (
                    <UserCard key={user._id} user={user} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No users found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Enter a search term to find projects, ideas, and users</p>
          </div>
        )}
      </div>
    </div>
  );
}
