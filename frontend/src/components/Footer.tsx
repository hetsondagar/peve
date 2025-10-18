import { motion } from 'framer-motion';
import { Github, Linkedin, Heart, Coffee, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-t border-primary/10 safe-area-bottom">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          {/* Main Footer Content */}
          <div className="space-y-2">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center gap-2 mb-1"
            >
              <img src={'/final.png'} alt="peve" className="w-4 h-4" />
              <span className="text-lg font-bold gradient-text brand-peve">peve</span>
            </motion.div>
            
            <p className="text-muted-foreground text-xs max-w-4xl mx-auto">
              Built with <Heart className="w-3 h-3 inline text-red-500 mx-1" />, 
              lots of <Coffee className="w-3 h-3 inline text-amber-600 mx-1" />, 
              and a sprinkle of <Code className="w-3 h-3 inline text-primary mx-1" /> magic
            </p>
          </div>

          {/* Developer Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-3 max-w-2xl mx-auto"
          >
            <div className="space-y-2">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-foreground mb-1 brand-peve">
                  Crafted by <span className="text-primary font-bold">Het Sondagar</span> 🧙‍♂️
                </h3>
                <p className="text-xs text-muted-foreground">
                  When I'm not debugging the universe, I'm probably debugging my code
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-3">
                <motion.a
                  href="https://github.com/hetsondagar"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-2 py-1 bg-card border border-primary/20 rounded-md hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 touch-target"
                >
                  <Github className="w-3 h-3 text-foreground" />
                  <span className="text-xs font-medium">GitHub</span>
                </motion.a>
                
                <motion.a
                  href="https://www.linkedin.com/in/het-sondagar-433095284/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 px-2 py-1 bg-card border border-primary/20 rounded-md hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 touch-target"
                >
                  <Linkedin className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium">LinkedIn</span>
                </motion.a>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  P.S. If you find any bugs, they're probably features in disguise 🐛✨
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bottom Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-2 border-t border-primary/10"
          >
            <p className="text-xs text-muted-foreground">
              © 2025 <span className="brand-peve font-semibold">peve</span>. Made with 💻 and a healthy dose of caffeine. 
              <span className="text-primary/60 block mt-1">
                "Code is poetry written in logic" - Some wise developer probably
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
