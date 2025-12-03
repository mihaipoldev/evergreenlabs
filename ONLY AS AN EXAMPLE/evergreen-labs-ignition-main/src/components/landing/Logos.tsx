import { motion } from 'framer-motion';

const logos = [
  { name: 'TechCorp', initials: 'TC' },
  { name: 'InnovateLabs', initials: 'IL' },
  { name: 'DataFlow', initials: 'DF' },
  { name: 'CloudScale', initials: 'CS' },
  { name: 'AIVentures', initials: 'AV' },
  { name: 'AutomateX', initials: 'AX' },
];

export const Logos = () => {
  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mb-10 uppercase tracking-wider"
        >
          Trusted by innovative companies
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
        >
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-all duration-300 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-muted-foreground font-semibold text-sm">{logo.initials}</span>
              </div>
              <span className="text-muted-foreground font-medium hidden sm:inline">{logo.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
