export type FAQItem = {
  id: string;
  section_id: string;
  question: string;
  answer: string;
  position: number;
  created_at: string;
  updated_at: string;
};

export type FAQItemWithSection = FAQItem & {
  sections?: {
    id: string;
    title: string | null;
    type: string;
  } | null;
};
