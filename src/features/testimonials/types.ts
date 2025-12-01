export type Testimonial = {
  id: string;
  section_id: string;
  author_name: string;
  author_role: string | null;
  company_name: string | null;
  quote: string;
  video_url: string | null;
  avatar_url: string | null;
  approved: boolean;
  position: number;
  created_at: string;
  updated_at: string;
};

export type TestimonialWithSection = Testimonial & {
  sections?: {
    id: string;
    title: string | null;
    type: string;
  } | null;
};
