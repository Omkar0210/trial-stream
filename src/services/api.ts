import type { Researcher, Publication, ClinicalTrial } from "@/types";

// Mock API service - In production, these would call real APIs
export const searchResearchers = async (query: string, disease?: string, location?: string): Promise<Researcher[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data - would be replaced with real PubMed/Scholar API calls
  const mockResearchers: Researcher[] = [
    {
      id: "1",
      name: "Dr. Alfonso Fasano",
      institution: "Toronto Western Hospital",
      specialty: "Movement Disorders",
      location: "Toronto, Canada",
      matchScore: 95,
      publications: 234,
      researchInterests: ["Deep Brain Stimulation", "Parkinson's Disease", "Movement Disorders"]
    },
    {
      id: "2",
      name: "Dr. Renato Munhoz",
      institution: "Toronto Western Hospital",
      specialty: "Parkinson's Disease",
      location: "Toronto, Canada",
      matchScore: 92,
      publications: 189,
      researchInterests: ["Parkinson's Disease", "Neurology", "Clinical Trials"]
    },
    {
      id: "3",
      name: "Dr. Anthony Lang",
      institution: "Toronto Western Hospital",
      specialty: "Neurology",
      location: "Toronto, Canada",
      matchScore: 88,
      publications: 412,
      researchInterests: ["Movement Disorders", "Neurodegenerative Diseases"]
    },
  ];

  return mockResearchers.filter(r => 
    query ? r.name.toLowerCase().includes(query.toLowerCase()) || 
           r.specialty.toLowerCase().includes(query.toLowerCase()) : true
  );
};

export const searchPublications = async (query: string, disease?: string): Promise<Publication[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data - would be replaced with real PubMed API calls
  const mockPublications: Publication[] = [
    {
      id: "1",
      title: "Advances in Deep Brain Stimulation for Parkinson's Disease: A Comprehensive Review",
      authors: "Fasano A, Lang AE, et al.",
      journal: "Nature Neuroscience",
      date: "2025-01",
      abstract: "This comprehensive review examines recent advances in deep brain stimulation techniques for Parkinson's disease treatment...",
      url: "https://scholar.google.com"
    },
    {
      id: "2",
      title: "Long-term Outcomes of Movement Disorder Treatment in Clinical Practice",
      authors: "Munhoz RP, Teive HA, et al.",
      journal: "The Lancet Neurology",
      date: "2024-12",
      abstract: "A longitudinal study examining the long-term efficacy and safety of various movement disorder treatments...",
      url: "https://scholar.google.com"
    },
    {
      id: "3",
      title: "Stem Cell Therapy in Parkinson's Disease: Current State and Future Directions",
      authors: "Lang AE, Kalia LV, et al.",
      journal: "Cell Stem Cell",
      date: "2024-11",
      abstract: "An overview of current stem cell therapy approaches for Parkinson's disease and potential future developments...",
      url: "https://scholar.google.com"
    },
  ];

  return mockPublications.filter(p =>
    query ? p.title.toLowerCase().includes(query.toLowerCase()) ||
           p.abstract?.toLowerCase().includes(query.toLowerCase()) : true
  );
};

export const searchClinicalTrials = async (query: string, location?: string): Promise<ClinicalTrial[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data - would be replaced with real ClinicalTrials.gov API calls
  const mockTrials: ClinicalTrial[] = [
    {
      id: "NCT05123456",
      title: "Deep Brain Stimulation for Advanced Parkinson's Disease",
      status: "Recruiting",
      phase: "Phase 3",
      location: "Toronto, Canada",
      condition: "Parkinson's Disease",
      description: "This study evaluates the efficacy of deep brain stimulation in patients with advanced Parkinson's disease who have motor fluctuations.",
      eligibility: "Ages 18-75, diagnosed with Parkinson's disease for at least 5 years",
      url: "https://clinicaltrials.gov"
    },
    {
      id: "NCT05123457",
      title: "Novel Immunotherapy for Multiple System Atrophy",
      status: "Recruiting",
      phase: "Phase 2",
      location: "Toronto, Canada",
      condition: "Multiple System Atrophy",
      description: "A clinical trial investigating a new immunotherapy approach for treating multiple system atrophy.",
      eligibility: "Ages 40-80, diagnosed with MSA within the last 3 years",
      url: "https://clinicaltrials.gov"
    },
    {
      id: "NCT05123458",
      title: "Freezing of Gait Treatment Study in Parkinson's Patients",
      status: "Active, not recruiting",
      phase: "Phase 2",
      location: "Toronto, Canada",
      condition: "Parkinson's Disease",
      description: "Examining novel therapeutic approaches for freezing of gait in Parkinson's disease patients.",
      eligibility: "Ages 50-85, experiencing freezing of gait episodes",
      url: "https://clinicaltrials.gov"
    },
  ];

  return mockTrials.filter(t =>
    query ? t.title.toLowerCase().includes(query.toLowerCase()) ||
           t.description.toLowerCase().includes(query.toLowerCase()) ||
           t.condition.toLowerCase().includes(query.toLowerCase()) : true
  );
};

// Favorites management
export const getFavorites = (): { researchers: string[], publications: string[], trials: string[] } => {
  const favorites = localStorage.getItem("favorites");
  return favorites ? JSON.parse(favorites) : { researchers: [], publications: [], trials: [] };
};

export const toggleFavorite = (type: "researchers" | "publications" | "trials", id: string) => {
  const favorites = getFavorites();
  const index = favorites[type].indexOf(id);
  
  if (index > -1) {
    favorites[type].splice(index, 1);
  } else {
    favorites[type].push(id);
  }
  
  localStorage.setItem("favorites", JSON.stringify(favorites));
  return favorites;
};