import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { GlowButton } from '@/components/ui/glow-button';
import { NetworkBackground } from '@/components/NetworkBackground';
import hiveLogo from '@/assets/hive-logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Show loading transition with quote
    const quote = "With great peers come great projects.";
    console.log(quote);
    
    // Navigate to home after short delay
    setTimeout(() => {
      navigate('/home');
    }, 1500);
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
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <motion.img
              src={hiveLogo}
              alt="Peve Hive Logo"
              className="w-32 h-32 animate-rotate-slow"
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
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">Peve</h1>
          <p className="text-muted-foreground">
            Before code, there's chaos… and Peve.
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
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12"
              />
            </div>

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
    </div>
  );
}
