import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does it take to get started?",
    answer:
      "Most clients are fully onboarded within 1-2 weeks. We handle all the technical setup, integrations, and initial configuration. You'll start seeing outreach activity within days of kickoff.",
  },
  {
    question: "What kind of results can I expect?",
    answer:
      "Our clients typically see 30-50 qualified meetings per month within 60 days. Results depend on your ICP, offer, and market — but we've consistently delivered 5-10x ROI for B2B companies with proven product-market fit.",
  },
  {
    question: "Do I need any technical expertise?",
    answer:
      "Zero technical knowledge required. We build, manage, and optimize everything. You'll have a dashboard to track results, but we handle all the automation, AI, and infrastructure behind the scenes.",
  },
  {
    question: "What tools and platforms do you use?",
    answer:
      "We primarily build on n8n for automation workflows, Supabase for database infrastructure, and various AI models for personalization. We also integrate with your existing CRM, email providers, and sales tools.",
  },
  {
    question: "What's included in your pricing?",
    answer:
      "Our packages include full system setup, ongoing optimization, dedicated support, and all tool costs. No hidden fees. We also offer performance-based pricing for qualified clients.",
  },
  {
    question: "Can you integrate with our existing tools?",
    answer:
      "Absolutely. We've integrated with hundreds of tools including Salesforce, HubSpot, Pipedrive, Slack, Notion, and most major business platforms. If there's an API, we can connect it.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/10 blur-[150px]" />
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
            FAQ
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
          >
            Common{" "}
            <span className="gradient-text">questions</span>
          </motion.h2>
        </div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="relative group rounded-xl border border-glass-border/30 bg-card/50 backdrop-blur-sm overflow-hidden data-[state=open]:border-primary/30 transition-colors duration-300"
              >
                {/* Gradient left border on active */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-aqua to-primary opacity-0 group-data-[state=open]:opacity-100 transition-opacity duration-300" />

                {/* Glow effect when open */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-data-[state=open]:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <AccordionTrigger className="px-6 py-5 text-left text-foreground font-medium hover:text-primary transition-colors [&[data-state=open]>svg]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
