export type Section = {
  id: string;
  page_id: string;
  type: string;
  title: string | null;
  subtitle: string | null;
  content: any | null;
  position: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export type SectionWithPage = Section & {
  pages?: {
    id: string;
    slug: string;
    title: string;
  } | null;
};
