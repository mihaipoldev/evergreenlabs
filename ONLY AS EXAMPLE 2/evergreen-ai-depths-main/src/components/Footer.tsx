import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 overflow-hidden">
      {/* Glowing separator */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-glass-border to-transparent" />
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        />
      </div>

      <div className="container relative z-10 px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">E</span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              Evergreen<span className="text-primary">Labs</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8">
            <a
              href="#services"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Services
            </a>
            <a
              href="#testimonials"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              FAQ
            </a>
          </nav>

          {/* Copyright */}
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">
              © {currentYear} EvergreenLabs
            </span>
            <div className="w-px h-4 bg-glass-border" />
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Terms
            </a>
          </div>
        </div>

        {/* Bottom glow accent */}
        <div className="flex justify-center mt-8">
          <motion.div
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-32 h-1 rounded-full bg-gradient-primary blur-sm"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
