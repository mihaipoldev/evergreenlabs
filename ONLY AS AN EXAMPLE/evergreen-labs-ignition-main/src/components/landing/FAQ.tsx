import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How long does it take to implement an automation system?',
    answer: 'Most projects are completed within 2-4 weeks, depending on complexity. Simple automations can be live in as little as 5 days, while more complex AI systems may take 4-6 weeks for full deployment.',
  },
  {
    question: 'What kind of ROI can I expect?',
    answer: 'Our clients typically see 3-5x ROI within the first 90 days. This comes from time savings, increased lead quality, and improved conversion rates. We track and report on all key metrics throughout our engagement.',
  },
  {
    question: 'Do I need technical expertise to work with EvergreenLabs?',
    answer: 'Not at all. We handle all the technical implementation and provide comprehensive training. Our systems are designed to be user-friendly, and we offer ongoing support to ensure you get maximum value.',
  },
  {
    question: 'What tools and platforms do you integrate with?',
    answer: 'We integrate with 200+ tools including Salesforce, HubSpot, Slack, Notion, Google Workspace, Microsoft 365, and most major CRM, marketing, and productivity platforms.',
  },
  {
    question: 'What happens after the initial implementation?',
    answer: 'We provide ongoing optimization and support. This includes regular performance reviews, system updates, and strategic recommendations to help you scale. Many clients choose to expand their automation stack over time.',
  },
  {
    question: 'Is my data secure with your systems?',
    answer: 'Absolutely. We use enterprise-grade encryption, SOC 2 compliant processes, and follow strict data handling protocols. Your data never leaves your authorized systems without explicit permission.',
  },
];

export const FAQ = () => {
  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4">
            Frequently asked <span className="text-gradient">questions</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card/50 data-[state=open]:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
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
