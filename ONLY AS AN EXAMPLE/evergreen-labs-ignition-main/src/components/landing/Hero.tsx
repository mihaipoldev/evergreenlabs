import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      
      {/* Animated Glow Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm text-muted-foreground">AI-Powered Automation Agency</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
        >
          Automate Your Growth
          <br />
          <span className="text-gradient">Scale Without Limits</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
        >
          We build intelligent automation systems that transform how businesses operate. 
          From AI workflows to custom integrations — we make your tech work for you.
        </motion.p>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative max-w-4xl mx-auto mb-12"
        >
          <motion.div
            className="relative rounded-2xl overflow-hidden border border-border bg-card aspect-video group cursor-pointer"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-2 border-primary rounded-2xl glow-blue pointer-events-none" />
            
            {/* Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary to-card flex items-center justify-center">
              <motion.div
                className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50"
                whileHover={{ scale: 1.1 }}
                animate={{ boxShadow: ['0 0 20px hsl(217 91% 60% / 0.3)', '0 0 40px hsl(217 91% 60% / 0.5)', '0 0 20px hsl(217 91% 60% / 0.3)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Play className="w-8 h-8 text-primary fill-primary ml-1" />
              </motion.div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            className="h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground flex-1 w-full"
          />
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium whitespace-nowrap w-full sm:w-auto">
              Request My Free Strategy Call
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust Indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-sm text-muted-foreground mt-6"
        >
          ✓ No credit card required • ✓ 30-min strategy session • ✓ 100% free
        </motion.p>
      </div>
    </section>
  );
};
