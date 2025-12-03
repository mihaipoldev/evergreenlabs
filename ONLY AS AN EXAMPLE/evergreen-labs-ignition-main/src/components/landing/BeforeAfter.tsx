import { motion } from 'framer-motion';
import { X, Check, ArrowRight } from 'lucide-react';

const beforeItems = [
  'Manual data entry across 5+ tools',
  'Missed follow-ups losing deals',
  'Hours spent on repetitive tasks',
  'Inconsistent lead qualification',
  'Scattered customer data',
  'Slow response times',
  'No visibility into pipeline',
  'Error-prone processes',
];

const afterItems = [
  { title: 'Unified Automation Hub', description: 'One system runs everything' },
  { title: 'AI-Powered Outreach', description: 'Personalized at scale' },
  { title: 'Smart Lead Scoring', description: 'Focus on high-intent prospects' },
  { title: 'Real-Time Analytics', description: 'Data-driven decisions' },
];

export const BeforeAfter = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            The Transformation
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4">
            From chaos to <span className="text-gradient">clarity</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border-glow rounded-2xl bg-card/50 backdrop-blur-sm overflow-hidden"
        >
          <div className="grid lg:grid-cols-2">
            {/* Before Section */}
            <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-border">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                  <X className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Before EvergreenLabs</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {beforeItems.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10"
                  >
                    <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* After Section */}
            <div className="p-8 lg:p-12 bg-primary/5">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">With EvergreenLabs</h3>
              </div>
              
              <div className="space-y-4">
                {afterItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card border border-primary/20 group hover:border-primary/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-medium">{item.title}</h4>
                      <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
