/** Row from Supabase `tutors` table */
export type TutorRow = {
  id: string;
  name: string;
  bio: string;
  school?: string | null;
  grade?: string | null;
  subjects?: string | null;
};

/** Row from Supabase `founders` table */
export type FounderRow = {
  id: string;
  name: string;
  bio: string;
  school?: string | null;
  expertise?: string | null;
  photo_url?: string | null;
};

/** Row from Supabase `stats` table */
export type StatRow = {
  id: string;
  label: string;
  value: number;
};

/** Row from Supabase `testimonials` table */
export type TestimonialRow = {
  id: string;
  name: string;
  role: string;
  content: string;
  image_url?: string | null;
};
