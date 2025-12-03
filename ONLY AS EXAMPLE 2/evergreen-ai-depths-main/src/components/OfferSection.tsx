import { motion } from "framer-motion";
import { 
  Mail, 
  Search, 
  Sparkles, 
  Inbox, 
  GitBranch, 
  Database, 
  BarChart3 
} from "lucide-react";

const offers = [
  {
    icon: Mail,
    title: "DFY Cold Outreach Systems",
    description: "Fully automated cold email campaigns that book meetings while you sleep.",
  },
  {
    icon: Search,
    title: "Lead Scraping + Enrichment",
    description: "Intelligent data collection and enrichment to build hyper-targeted prospect lists.",
  },
  {
    icon: Sparkles,
    title: "AI-Personalized Email Writing",
    description: "Dynamic AI copywriting that crafts unique messages for every single prospect.",
  },
  {
    icon: Inbox,
    title: "Inbox Setup + Deliverability",
    description: "Technical email infrastructure optimized for maximum inbox placement.",
  },
  {
    icon: GitBranch,
    title: "Custom n8n Automation Pipelines",
    description: "End-to-end workflow automation connecting all your tools and processes.",
  },
  {
    icon: Database,
    title: "Supabase Database Architecture",
    description: "Scalable data infrastructure designed for real-time operations and growth.",
  },
  {
    icon: BarChart3,
    title: "KPI Dashboards + Tracking",
    description: "Real-time visibility into every metric that matters for your business.",
  },
];

const OfferCard = ({ offer, index }: { offer: typeof offers[0]; index: number }) => {
  const Icon = offer.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative flex overflow-hidden rounded-2xl bg-card border border-glass-border/30 hover:border-primary/30 transition-all duration-500"
    >
      {/* Left gradient strip */}
      <div className="relative w-2 flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-aqua to-primary opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-primary via-aqua to-primary"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
          style={{ transformOrigin: "top" }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex items-start gap-4">
        {/* Icon container */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-glass/50 border border-glass-border/50 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-300">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {offer.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {offer.description}
          </p>
        </div>

        {/* Hover arrow */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-aqua/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

const OfferSection = () => {
  return (
    <section id="services" className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] -translate-y-1/2 -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] -translate-y-1/2 translate-x-1/2 rounded-full bg-aqua/10 blur-[120px]" />
      </div>

      <div className="container relative z-10 px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-primary font-mono text-sm tracking-wider uppercase mb-4"
          >
            What We Build
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            Your complete{" "}
            <span className="gradient-text">growth engine</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Everything you need to automate outbound, capture leads, and scale your business — 
            delivered and managed end-to-end.
          </motion.p>
        </div>

        {/* Offer cards grid */}
        <div className="max-w-4xl mx-auto space-y-4">
          {offers.map((offer, index) => (
            <OfferCard key={offer.title} offer={offer} index={index} />
          ))}
        </div>

        {/* Bottom accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-glass-border to-transparent" />
            <span>All systems built and maintained for you</span>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-glass-border to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OfferSection;
