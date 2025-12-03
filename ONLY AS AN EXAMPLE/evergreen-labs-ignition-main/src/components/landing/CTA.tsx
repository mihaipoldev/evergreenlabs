import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const teamMembers = [
  { name: 'Alex', color: 'bg-primary' },
  { name: 'Sam', color: 'bg-cyan' },
  { name: 'Jordan', color: 'bg-purple-500' },
  { name: 'Taylor', color: 'bg-blue-400' },
];

export const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial" />
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Team Avatars */}
          <div className="flex justify-center -space-x-3 mb-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`w-12 h-12 rounded-full ${member.color} border-4 border-background flex items-center justify-center text-white font-semibold text-sm`}
              >
                {member.name[0]}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="w-12 h-12 rounded-full bg-secondary border-4 border-background flex items-center justify-center text-muted-foreground font-semibold text-xs"
            >
              +12
            </motion.div>
          </div>

          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Ready to Transform?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Let's build your{' '}
            <span className="text-gradient">automation engine</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Book a free 30-minute strategy session with our team. We'll analyze your 
            current workflow and show you exactly how automation can transform your business.
          </p>

          {/* CTA Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-14 bg-secondary border-border text-foreground placeholder:text-muted-foreground flex-1 w-full text-base"
            />
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold whitespace-nowrap w-full sm:w-auto text-base">
                Book Free Strategy Call
              </Button>
            </motion.div>
          </motion.div>

          <p className="text-sm text-muted-foreground mt-6">
            No commitment required • Response within 24 hours
          </p>
        </motion.div>
      </div>
    </section>
  );
};
