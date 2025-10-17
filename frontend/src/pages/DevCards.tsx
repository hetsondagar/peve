import { useState } from 'react';
import { motion } from 'framer-motion';
import { NetworkBackground } from '@/components/NetworkBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlowButton } from '@/components/ui/glow-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Download, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const templates = [
  { id: 'classic', name: 'Classic', accent: 'primary' },
  { id: 'neon', name: 'Neon Glow', accent: 'secondary' },
  { id: 'hive', name: 'Hive Network', accent: 'accent' },
];

export default function DevCards() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [cardData, setCardData] = useState({
    name: 'Alex Developer',
    role: 'Full-Stack Engineer',
    projects: '8 Projects',
    github: 'github.com/alexdev',
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NetworkBackground />
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      
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
              <button onClick={() => navigate('/devcards')} className="text-primary">DevCards</button>
            </div>
          </div>
          <div className="text-3xl">👤</div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4"><span className="gradient-text">DevCard</span> Generator</h1>
          <p className="text-muted-foreground">Create beautiful cards for your portfolio</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Customization Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="glass border-border">
              <CardHeader>
                <CardTitle>Customize Your Card</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Template Selection */}
                <div className="space-y-3">
                  <Label>Choose Template</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedTemplate === template.id
                            ? 'border-primary bg-primary/10 glow-turquoise'
                            : 'border-border bg-card-secondary hover:border-primary/50'
                        }`}
                      >
                        <div className="text-sm font-semibold text-foreground">{template.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      className="bg-card-secondary border-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={cardData.role}
                      onChange={(e) => setCardData({ ...cardData, role: e.target.value })}
                      className="bg-card-secondary border-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Projects</Label>
                    <Input
                      value={cardData.projects}
                      onChange={(e) => setCardData({ ...cardData, projects: e.target.value })}
                      className="bg-card-secondary border-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>GitHub</Label>
                    <Input
                      value={cardData.github}
                      onChange={(e) => setCardData({ ...cardData, github: e.target.value })}
                      className="bg-card-secondary border-primary/20"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <GlowButton className="w-full">
                    <Download className="w-4 h-4" />
                    Download PNG
                  </GlowButton>
                  <GlowButton variant="outline" className="w-full">
                    <QrCode className="w-4 h-4" />
                    Generate QR Code
                  </GlowButton>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {/* DevCard Preview */}
                <motion.div
                  key={selectedTemplate}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`aspect-[1.6/1] rounded-2xl p-8 relative overflow-hidden ${
                    selectedTemplate === 'classic' ? 'bg-gradient-dark' :
                    selectedTemplate === 'neon' ? 'bg-gradient-accent' :
                    'bg-gradient-primary'
                  }`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{
                      backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }} />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-3xl border-2 border-primary">
                          👤
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{cardData.name}</h3>
                          <p className="text-white/80">{cardData.role}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-white/90 text-sm">{cardData.projects}</div>
                        <div className="text-white/70 text-xs">{cardData.github}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-white/60">peve hive</div>
                      <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                        <QrCode className="w-12 h-12 text-white/80" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
