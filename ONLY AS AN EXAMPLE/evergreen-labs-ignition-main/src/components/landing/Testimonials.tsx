import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const testimonials = [
  { name: 'Sarah Chen', role: 'CEO, TechScale', gradient: 'from-primary/30 to-purple-500/30' },
  { name: 'Marcus Johnson', role: 'Founder, GrowthHQ', gradient: 'from-primary/30 to-cyan/30' },
  { name: 'Elena Rodriguez', role: 'COO, DataDriven', gradient: 'from-purple-500/30 to-primary/30' },
  { name: 'David Kim', role: 'VP Sales, CloudFirst', gradient: 'from-cyan/30 to-primary/30' },
  { name: 'Amanda Foster', role: 'Director, ScaleUp', gradient: 'from-primary/30 to-blue-400/30' },
  { name: 'James Wright', role: 'CTO, AutoFlow', gradient: 'from-blue-400/30 to-purple-500/30' },
  { name: 'Lisa Park', role: 'Head of Ops, NextGen', gradient: 'from-primary/30 to-cyan/30' },
  { name: 'Michael Torres', role: 'Founder, RevBoost', gradient: 'from-cyan/30 to-purple-500/30' },
  { name: 'Rachel Adams', role: 'CMO, LaunchPad', gradient: 'from-purple-500/30 to-primary/30' },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-20" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Stories of Success
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4">
            See what our clients <span className="text-gradient">achieved</span>
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
            Real results from real businesses that transformed their operations with EvergreenLabs
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group cursor-pointer"
            >
              <div className={`relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-br ${testimonial.gradient} border border-border hover:border-primary/50 transition-all duration-300`}>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-card/60 group-hover:bg-card/40 transition-colors duration-300" />
                
                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 border-2 border-primary/30 rounded-2xl" />
                </div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary/60 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    animate={{
                      boxShadow: ['0 0 15px hsl(217 91% 60% / 0.2)', '0 0 30px hsl(217 91% 60% / 0.4)', '0 0 15px hsl(217 91% 60% / 0.2)'],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Play className="w-6 h-6 text-primary fill-primary ml-0.5" />
                  </motion.div>
                </div>
                
                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-card/90 to-transparent">
                  <p className="text-foreground font-medium">{testimonial.name}</p>
                  <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
