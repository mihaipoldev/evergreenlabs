"use client";

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const testimonials = [
  {
    name: 'Ehab Darwish',
    role: 'Founder @ iSkala',
    headline: '2x MRR for outbound Agency',
    body: 'Scaling from $8K to $18K MRR in 2.5 months, refining offer structure, positioning, and adopting a new internal "Legen" approach.',
    date: 'Aug 21, 2025',
    avatar: 'ED',
    hasIcon: true,
  },
  {
    name: 'David Lichtenstein',
    role: 'CEO & Co-Founder',
    headline: 'Great value from arguably the top prospecting business on the planet',
    body: '',
    date: 'Jun 4, 2025',
    avatar: 'DL',
  },
  {
    name: 'Tash Muraldo',
    role: 'Founder - GTM Engineer',
    headline: 'This program helped me hone in on the challenges',
    body: 'That are happening with AI and outbound and how all these tools work in harmony with each other.',
    date: 'Jun 4, 2025',
    avatar: 'TM',
  },
  {
    name: 'Deisy Perez',
    role: 'Chief Strategy Officer at WarmUp',
    headline: 'Added 10 new clients over 3 months',
    body: 'And significantly improved service delivery quality. Comprehensive training on tools like Clay helped gain clients and deliver great results.',
    date: 'Aug 19, 2025',
    avatar: 'DP',
  },
  {
    name: 'Joel Kuusamo',
    role: 'Founder',
    headline: 'Great way to stay up to date on new trends',
    body: 'This has been a great way to stay up to date on new trends and innovations + the community is great for solving all kinds of problems from list building to agency management.',
    date: 'Jun 4, 2025',
    avatar: 'JK',
  },
  {
    name: 'Deisy Lewis',
    role: 'Chief Strategy Officer',
    headline: 'Comprehensive training on using tools like Clay',
    body: 'The comprehensive training on using tools like Clay has helped us gain 10 clients, and we\'ve been able to deliver great results for each of them.',
    date: 'Jun 4, 2025',
    avatar: 'DL',
  },
  {
    name: 'Justin Morgan',
    role: 'Founder & Head of Growth',
    headline: '4x return on investment within 3 months',
    body: 'Quadrupling investment and building infrastructure to scale my business and support others.',
    date: 'Aug 19, 2025',
    avatar: 'JM',
  },
  {
    name: 'Lazar Radivojevic',
    role: 'Founder',
    headline: '3x increase in MRR and scalable internal operations',
    body: 'Ready for growth. Highlights insights into agency management as useful and unexpected benefits.',
    date: 'Jun 4, 2025',
    avatar: 'LR',
  },
  {
    name: 'Rafael von Corvin',
    role: 'Outbound Sales Beratung & operativ...',
    headline: 'The biggest value in the program',
    body: 'Is that any bottleneck you encounter gets solved immediately.',
    date: 'Jun 4, 2025',
    avatar: 'RC',
  },
];

const StarRating = () => {
  return (
    <div className="flex gap-0.5 mb-3">
      {[...Array(5)].map((_, i) => (
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className="w-4 h-4 text-yellow-400"
        />
      ))}
    </div>
  );
};

const Avatar = ({ initials }: { initials: string }) => {
  return (
    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
      <span className="text-foreground font-semibold text-sm">{initials}</span>
    </div>
  );
};

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-32 relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
            Hear what others are saying
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="relative"
            >
              <div className="relative h-full rounded-xl border border-border bg-card p-6 flex flex-col">
                {/* Optional Icon in top-right */}
                {testimonial.hasIcon && (
                  <div className="absolute top-4 right-4 w-6 h-6 flex gap-0.5">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm" />
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-sm" />
                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-sm" />
                    <div className="w-2.5 h-2.5 bg-pink-500 rounded-sm" />
                  </div>
                )}

                {/* Header with Avatar and Name */}
                <div className="flex items-start gap-3 mb-4">
                  <Avatar initials={testimonial.avatar} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground font-semibold text-base leading-tight">
                      {testimonial.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-0.5">
                      {testimonial.role}
                    </p>
                </div>
                </div>
                
                {/* Star Rating */}
                <StarRating />

                {/* Headline */}
                <h4 className="text-foreground font-semibold text-base mb-3 leading-tight">
                  {testimonial.headline}
                </h4>

                {/* Body Text */}
                {testimonial.body && (
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                    {testimonial.body}
                  </p>
                )}

                {/* Date */}
                <p className="text-muted-foreground text-xs mt-auto">
                  {testimonial.date}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

