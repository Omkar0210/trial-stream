export interface Researcher {
  id: string;
  name: string;
  institution: string;
  specialty: string;
  location: string;
  matchScore?: number;
  publications?: number;
  researchInterests?: string[];
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  date: string;
  abstract?: string;
  url?: string;
}

export interface ClinicalTrial {
  id: string;
  title: string;
  status: string;
  phase: string;
  location: string;
  condition: string;
  description: string;
  eligibility?: string;
  url?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  category: string;
  author: string;
  authorType: "patient" | "researcher";
  content: string;
  replies: number;
  date: string;
}