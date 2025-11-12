import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, MessageSquare, ExternalLink } from "lucide-react";
import VoiceAgent from "@/components/VoiceAgent";
import type { Researcher } from "@/types";
import { useToast } from "@/hooks/use-toast";

const ResearcherProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [researcher, setResearcher] = useState<Researcher | null>(null);
  const [hasRequested, setHasRequested] = useState(false);

  useEffect(() => {
    // Mock: In real app, fetch from API using id
    const mockResearcher: Researcher = {
      id: id || "1",
      name: "Dr. Alfonso Fasano",
      institution: "Toronto Western Hospital",
      specialty: "Movement Disorders",
      location: "Toronto, Canada",
      matchScore: 95,
      publications: 234,
      researchInterests: ["Deep Brain Stimulation", "Parkinson's Disease", "Movement Disorders"],
      bio: "Dr. Fasano is a leading expert in movement disorders and deep brain stimulation therapy. His research focuses on improving outcomes for patients with Parkinson's disease and related conditions.",
      email: "alfonso.fasano@uhn.ca",
      recentPublications: [
        {
          id: "1",
          title: "Advances in Deep Brain Stimulation for Parkinson's Disease: A Comprehensive Review",
          authors: "Fasano A, Lang AE, et al.",
          journal: "Nature Neuroscience",
          date: "2025-01",
          url: "https://scholar.google.com"
        },
        {
          id: "2",
          title: "Long-term Outcomes of DBS Therapy in Movement Disorders",
          authors: "Fasano A, Munhoz RP, et al.",
          journal: "The Lancet Neurology",
          date: "2024-12",
          url: "https://scholar.google.com"
        }
      ],
      clinicalTrials: [
        {
          id: "NCT05123456",
          title: "Deep Brain Stimulation for Advanced Parkinson's Disease",
          status: "Recruiting",
          phase: "Phase 3",
          location: "Toronto, Canada",
          condition: "Parkinson's Disease",
          description: "This study evaluates the efficacy of deep brain stimulation in patients with advanced Parkinson's disease.",
          url: "https://clinicaltrials.gov"
        }
      ]
    };
    setResearcher(mockResearcher);
  }, [id]);

  const handleCollaborationRequest = () => {
    setHasRequested(true);
    toast({
      title: "Request Sent",
      description: "Your collaboration request has been sent. You'll be notified when it's accepted.",
    });
  };

  const handleMessage = () => {
    toast({
      title: "Messaging Available",
      description: "Start a conversation with this researcher.",
    });
    // Navigate to messaging page when implemented
  };

  if (!researcher) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Profile Header */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-4xl font-bold">
              {researcher.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{researcher.name}</h1>
                  <p className="text-lg text-muted-foreground mb-1">{researcher.institution}</p>
                  <p className="text-muted-foreground">{researcher.location}</p>
                </div>
                {researcher.matchScore && (
                  <Badge className="text-lg px-4 py-2 bg-primary/10 text-primary">
                    {researcher.matchScore}% Match
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {researcher.researchInterests?.map((interest, idx) => (
                  <Badge key={idx} variant="secondary">{interest}</Badge>
                ))}
              </div>

              {researcher.bio && (
                <p className="text-muted-foreground mb-4">{researcher.bio}</p>
              )}

              <div className="flex gap-3">
                {!hasRequested ? (
                  <Button onClick={handleCollaborationRequest}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Request Collaboration
                  </Button>
                ) : (
                  <Button onClick={handleMessage}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                )}
                {researcher.email && (
                  <Button variant="outline" asChild>
                    <a href={`mailto:${researcher.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="publications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="publications">
              Publications ({researcher.recentPublications?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="trials">
              Clinical Trials ({researcher.clinicalTrials?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="publications" className="space-y-4">
            {researcher.recentPublications?.map((pub) => (
              <Card key={pub.id} className="p-6 hover:shadow-medium transition-shadow">
                <h3 className="text-lg font-semibold mb-2">{pub.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{pub.authors}</p>
                <p className="text-sm text-muted-foreground mb-3">
                  {pub.journal} • {pub.date}
                </p>
                {pub.url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={pub.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Publication
                    </a>
                  </Button>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="trials" className="space-y-4">
            {researcher.clinicalTrials?.map((trial) => (
              <Card key={trial.id} className="p-6 hover:shadow-medium transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold flex-1">{trial.title}</h3>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{trial.status}</Badge>
                    <Badge variant="outline">{trial.phase}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">ID: {trial.id}</p>
                <p className="text-sm mb-3">{trial.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{trial.location}</span>
                  {trial.url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={trial.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on ClinicalTrials.gov
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <VoiceAgent />
    </div>
  );
};

export default ResearcherProfileView;
