import { motion } from 'framer-motion';
import { Zap, Target, TrendingUp, Shield, Clock, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning-Fast Automation',
    description: 'Deploy AI systems in days, not months',
  },
  {
    icon: Target,
    title: 'Precision Targeting',
    description: 'Reach the right prospects at the right time',
  },
  {
    icon: TrendingUp,
    title: 'Scalable Growth',
    description: 'Systems that grow with your business',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption and compliance',
  },
  {
    icon: Clock,
    title: '24/7 Operations',
    description: 'Automated workflows that never sleep',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    description: 'Actionable data to drive decisions',
  },
];

export const Value = () => {
  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              Why EvergreenLabs
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 leading-tight">
              The automation partner that{' '}
              <span className="text-gradient">actually delivers</span>
            </h2>
            <p className="text-muted-foreground text-lg mt-6 leading-relaxed">
              We're not just another agency. We build custom AI and automation systems 
              that transform how your business operates — from lead generation to 
              customer success.
            </p>
          </motion.div>

          {/* Right Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
