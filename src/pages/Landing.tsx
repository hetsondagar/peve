import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/navigation/Navbar";
import { ArrowRight, Sparkles, Users, Zap, Shield, Globe, Brain } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description: "Advanced algorithms connect you with the perfect collaborators and opportunities."
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Join thousands of professionals from around the world sharing knowledge and expertise."
    },
    {
      icon: Zap,
      title: "Real-time Collaboration",
      description: "Work together seamlessly with integrated tools and instant communication."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security and privacy controls."
    },
    {
      icon: Globe,
      title: "Cross-Platform",
      description: "Access Peve from anywhere, on any device, with full synchronization."
    },
    {
      icon: Sparkles,
      title: "Gamified Experience",
      description: "Earn badges, level up, and unlock achievements as you grow your network."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer",
      content: "Peve transformed how I connect with other designers. The AI matching is incredibly accurate.",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Software Engineer",
      content: "Found my co-founder through Peve. The platform's insights are game-changing.",
      avatar: "MR"
    },
    {
      name: "Dr. Elena Vasquez",
      role: "Research Scientist",
      content: "The collaboration tools on Peve are unmatched. Perfect for cross-disciplinary work.",
      avatar: "EV"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center pt-20"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 15, 23, 0.8), rgba(15, 15, 23, 0.8)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text leading-tight">
              Connect. Create. Collaborate.
            </h1>
            <p className="text-xl md:text-2xl text-foreground-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
              Join the next generation platform where innovation meets collaboration. 
              Discover your perfect match in the world of creativity and technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button variant="hero" size="hero" className="group">
                Get Started Today
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-foreground-secondary">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">50K+</div>
                <div className="text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">15K+</div>
                <div className="text-sm">Projects Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">98%</div>
                <div className="text-sm">Match Success</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating absolute top-1/4 left-1/4 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
          <div className="floating absolute top-3/4 right-1/4 w-32 h-32 bg-secondary/20 rounded-full blur-xl" style={{animationDelay: '2s'}}></div>
          <div className="floating absolute top-1/2 right-1/3 w-16 h-16 bg-accent/20 rounded-full blur-xl" style={{animationDelay: '4s'}}></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-secondary">
              Powerful Features
            </h2>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              Everything you need to build meaningful connections and create amazing projects together.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <GlassCard 
                key={feature.title} 
                className="text-center animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
                hover={true}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-primary rounded-large flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">{feature.title}</h3>
                <p className="text-foreground-secondary leading-relaxed">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-background-secondary/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              What Our Users Say
            </h2>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              Join thousands of professionals who've transformed their careers with Peve.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <GlassCard 
                key={testimonial.name} 
                className="animate-slide-up"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-foreground font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-foreground-secondary">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-foreground-secondary leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto text-center">
          <GlassCard className="max-w-4xl mx-auto text-center glow-primary">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Ready to Transform Your Network?
            </h2>
            <p className="text-xl text-foreground-secondary mb-8 max-w-2xl mx-auto">
              Join Peve today and discover a world of unlimited possibilities. 
              Your next breakthrough collaboration is just one connection away.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="hero" size="hero" className="group">
                Start Your Journey
                <Sparkles className="ml-2 group-hover:rotate-12 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
            
            <p className="text-sm text-foreground-secondary mt-6">
              Free to join • No credit card required • Cancel anytime
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-8 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold gradient-text">Peve</h3>
              <div className="hidden md:flex gap-6">
                <a href="#" className="text-foreground-secondary hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="text-foreground-secondary hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="text-foreground-secondary hover:text-foreground transition-colors">Support</a>
              </div>
            </div>
            
            <div className="text-foreground-secondary">
              © 2024 Peve. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}