import { motion } from "framer-motion";
import { Play, Volume2 } from "lucide-react";
import { useState } from "react";

const VideoSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="w-[800px] h-[500px] rounded-full bg-primary/20 blur-[150px]"
        />
      </div>

      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section header */}
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-primary font-mono text-sm tracking-wider uppercase"
            >
              See It In Action
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-foreground mt-3"
            >
              Watch how we transform businesses
            </motion.h2>
          </div>

          {/* Video container */}
          <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer"
          >
            {/* Glassmorphism frame */}
            <div className="absolute inset-0 bg-glass/40 backdrop-blur-sm border border-glass-border/50 rounded-2xl" />

            {/* Shimmer overlay */}
            <div className="shimmer absolute inset-0 rounded-2xl" />

            {/* Neon border glow */}
            <motion.div
              animate={{
                opacity: isHovered ? 1 : 0.5,
                boxShadow: isHovered
                  ? "0 0 60px 10px hsl(217 91% 60% / 0.3), inset 0 0 60px 10px hsl(217 91% 60% / 0.1)"
                  : "0 0 40px 5px hsl(217 91% 60% / 0.15), inset 0 0 40px 5px hsl(217 91% 60% / 0.05)",
              }}
              className="absolute inset-0 rounded-2xl pointer-events-none"
            />

            {/* Video placeholder background */}
            <div className="absolute inset-4 rounded-xl bg-navy overflow-hidden">
              {/* Gradient mesh background */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy-light via-navy to-navy-deep" />
              
              {/* Animated mesh pattern */}
              <motion.div
                animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.3)_1px,transparent_1px)] bg-[size:30px_30px]"
              />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                    boxShadow: isHovered
                      ? "0 0 50px 15px hsl(217 91% 60% / 0.4)"
                      : "0 0 30px 10px hsl(217 91% 60% / 0.2)",
                  }}
                  className="relative w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center"
                >
                  <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                  
                  {/* Ripple effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1.5],
                      opacity: [0.5, 0, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-primary/30"
                  />
                </motion.div>
              </div>

              {/* Video controls bar */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex-1 h-1 bg-glass-border/50 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-gradient-primary rounded-full" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">3:24</span>
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Corner accents */}
            <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-primary/50 rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-aqua/50 rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-aqua/50 rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-primary/50 rounded-br-lg" />
          </motion.div>

          {/* Caption */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center text-muted-foreground text-sm mt-6"
          >
            Watch our 3-minute overview to see how we've helped businesses scale with AI automation
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
