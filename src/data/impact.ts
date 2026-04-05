export const impactStats = {
  studentsReached: 2840,
  eventsHosted: 96,
  volunteerHours: 12400,
};

export type Review = {
  id: string;
  quote: string;
  name: string;
  role: "Student" | "Parent" | "Educator";
};

export const reviews: Review[] = [
  {
    id: "r1",
    quote:
      "My daughter finally saw herself as an engineer. The mentors met every student where they were—no gatekeeping, just curiosity.",
    name: "Jordan M.",
    role: "Parent",
  },
  {
    id: "r2",
    quote:
      "The workshops feel like real labs, not worksheets. I built a portfolio piece I actually want to show colleges.",
    name: "Alex R.",
    role: "Student",
  },
  {
    id: "r3",
    quote:
      "Inclusive, rigorous, and joyful. We partner because the programs align with what industry needs: collaborative problem solvers.",
    name: "Dr. Samira Okonkwo",
    role: "Educator",
  },
];
