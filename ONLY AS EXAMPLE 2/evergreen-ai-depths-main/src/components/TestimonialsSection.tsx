import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Play, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const y3 = useTransform(scrollYProgress, [0, 1], [30, -60]);

  return (
    <section id="testimonials" ref={sectionRef} className="relative py-24 overflow-hidden">
      {/* Neon accent dots */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-primary/30 blur-[80px]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-1/4 right-20 w-24 h-24 rounded-full bg-aqua/30 blur-[60px]"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-electric-glow/40 blur-[40px]"
      />

      <div className="container relative z-10 px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-primary font-mono text-sm tracking-wider uppercase mb-4"
          >
            Client Results
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
          >
            Trusted by{" "}
            <span className="gradient-text">growth-focused</span> teams
          </motion.h2>
        </div>

        {/* Floating stack layout */}
        <div className="relative max-w-5xl mx-auto min-h-[600px]">
          {/* Video testimonial 1 */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotate: -3 }}
            whileInView={{ opacity: 1, x: 0, rotate: -3 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ y: y1 }}
            className="absolute top-0 left-0 w-full md:w-[55%]"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer">
              {/* Glass background */}
              <div className="absolute inset-0 bg-glass/50 backdrop-blur-xl border border-glass-border/40 rounded-2xl" />
              
              {/* Inner video area */}
              <div className="absolute inset-3 rounded-xl bg-navy overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-light to-navy-deep" />
                
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center shadow-glow"
                  >
                    <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                  </motion.div>
                </div>

                {/* Name tag */}
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-glass/60 backdrop-blur-md border border-glass-border/30">
                  <p className="text-xs font-medium text-foreground">Sarah Chen</p>
                  <p className="text-xs text-muted-foreground">CEO, TechScale</p>
                </div>
              </div>

              {/* Blur edge effect */}
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_60px_20px_hsl(var(--navy-deep)/0.5)] pointer-events-none" />
            </div>
          </motion.div>

          {/* Quote card - intersecting */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ y: y2 }}
            className="absolute top-[30%] left-[15%] right-[5%] md:left-[35%] md:right-auto md:w-[50%] z-10"
          >
            <div className="relative p-8 rounded-2xl bg-glass/60 backdrop-blur-xl border border-glass-border/40 shadow-float">
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Quote className="w-5 h-5 text-primary-foreground" />
              </div>

              <blockquote className="text-lg md:text-xl text-foreground font-medium leading-relaxed mb-6 pl-4">
                "EvergreenLabs built our entire outbound system in 2 weeks. We went from 0 to 50 meetings/month. 
                The ROI was obvious within the first month."
              </blockquote>

              <div className="flex items-center gap-4 pl-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-aqua flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">MR</span>
                </div>
                <div>
                  <p className="text-foreground font-semibold">Marcus Rodriguez</p>
                  <p className="text-muted-foreground text-sm">Founder, GrowthOps Agency</p>
                </div>
              </div>

              {/* Gradient accent line */}
              <div className="absolute left-0 top-8 bottom-8 w-1 rounded-full bg-gradient-to-b from-primary via-aqua to-primary" />
            </div>
          </motion.div>

          {/* Video testimonial 2 */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ y: y3 }}
            className="absolute bottom-0 right-0 w-full md:w-[45%]"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer">
              {/* Glass background */}
              <div className="absolute inset-0 bg-glass/50 backdrop-blur-xl border border-glass-border/40 rounded-2xl" />
              
              {/* Inner video area */}
              <div className="absolute inset-3 rounded-xl bg-navy overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-deep" />
                
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 rounded-full bg-aqua/80 backdrop-blur-sm flex items-center justify-center shadow-glow-aqua"
                  >
                    <Play className="w-5 h-5 text-accent-foreground ml-0.5" fill="currentColor" />
                  </motion.div>
                </div>

                {/* Name tag */}
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-glass/60 backdrop-blur-md border border-glass-border/30">
                  <p className="text-xs font-medium text-foreground">David Park</p>
                  <p className="text-xs text-muted-foreground">CRO, SaaSFlow</p>
                </div>
              </div>

              {/* Blur edge effect */}
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_60px_20px_hsl(var(--navy-deep)/0.5)] pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
