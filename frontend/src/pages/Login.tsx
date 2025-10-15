import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { GlowButton } from '@/components/ui/glow-button';
import { NetworkBackground } from '@/components/NetworkBackground';
import { apiFetch, setAuthTokens } from '@/lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
        setAuthTokens(res.data.token, res.data.refreshToken);
      } else {
        const res = await apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ username, name: username, email, password }) });
        setAuthTokens(res.data.token, res.data.refreshToken);
      }
      navigate('/home');
    } catch (err) {
      console.error(err);
    }
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
          className="flex justify-center mb-4"
        >
          <div className="relative">
            <motion.img
              src={'/final.png'}
              alt="peve hive logo"
              className="w-40 h-40 animate-rotate-slow"
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
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold brand-peve">peve</h1>
          <p className="text-muted-foreground">
            Before code, there's chaos… and peve.
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
            {!isLogin && (
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12"
                />
              </div>
            )}
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
