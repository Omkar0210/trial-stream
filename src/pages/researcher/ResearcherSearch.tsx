import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Heart, ExternalLink, UserPlus } from "lucide-react";
import { searchResearchers, searchPublications, searchClinicalTrials, toggleFavorite, getFavorites } from "@/services/api";
import type { Researcher, Publication, ClinicalTrial } from "@/types";
import VoiceAgent from "@/components/VoiceAgent";
import { useToast } from "@/hooks/use-toast";

const ResearcherSearch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("collaborators");
  const [isLoading, setIsLoading] = useState(false);
  
  const [collaborators, setCollaborators] = useState<Researcher[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [trials, setTrials] = useState<ClinicalTrial[]>([]);
  const [favorites, setFavorites] = useState(getFavorites());

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const researcherData = JSON.parse(localStorage.getItem("researcherData") || "{}");
      
      const [collaboratorResults, publicationResults, trialResults] = await Promise.all([
        searchResearchers(searchQuery, researcherData.researchInterests, researcherData.location),
        searchPublications(searchQuery, researcherData.researchInterests),
        searchClinicalTrials(searchQuery, researcherData.location)
      ]);

      setCollaborators(collaboratorResults);
      setPublications(publicationResults);
      setTrials(trialResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = (type: "researchers" | "publications" | "trials", id: string) => {
    const newFavorites = toggleFavorite(type, id);
    setFavorites(newFavorites);
  };

  const handleRequestCollaboration = (researcher: Researcher) => {
    toast({
      title: "Collaboration Request Sent",
      description: `Your collaboration request has been sent to ${researcher.name}. They will be notified and can accept or decline.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/researcher/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">
              Cura<span className="text-primary">Link</span>
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="p-4 mb-8 shadow-soft">
          <div className="flex gap-2">
            <Input
              placeholder="Search for collaborators, publications, or clinical trials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="collaborators">
              Collaborators ({collaborators.length})
            </TabsTrigger>
            <TabsTrigger value="publications">
              Publications ({publications.length})
            </TabsTrigger>
            <TabsTrigger value="trials">
              Clinical Trials ({trials.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collaborators" className="space-y-4">
            {collaborators.map((collab) => (
              <Card key={collab.id} className="p-6 hover:shadow-medium transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{collab.name}</h3>
                      <Badge className="bg-primary/10 text-primary">
                        {collab.matchScore}% Match
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-1">{collab.institution}</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Specialty:</strong> {collab.specialty} • {collab.location}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {collab.researchInterests?.map((interest, idx) => (
                        <Badge key={idx} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {collab.publications} publications
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleFavorite("researchers", collab.id)}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.researchers.includes(collab.id)
                            ? "fill-primary text-primary"
                            : ""
                        }`}
                      />
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleRequestCollaboration(collab)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Request Collaboration
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="publications" className="space-y-4">
            {publications.map((pub) => (
              <Card key={pub.id} className="p-6 hover:shadow-medium transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{pub.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {pub.authors}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>{pub.journal}</strong> • {pub.date}
                    </p>
                    <p className="text-sm text-foreground/80 mb-3">{pub.abstract}</p>
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Read full paper <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFavorite("publications", pub.id)}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.publications.includes(pub.id)
                          ? "fill-primary text-primary"
                          : ""
                      }`}
                    />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="trials" className="space-y-4">
            {trials.map((trial) => (
              <Card key={trial.id} className="p-6 hover:shadow-medium transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{trial.title}</h3>
                      <Badge variant="secondary">{trial.status}</Badge>
                      <Badge variant="outline">{trial.phase}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>ID:</strong> {trial.id} • <strong>Location:</strong> {trial.location}
                    </p>
                    <p className="text-sm text-foreground/80 mb-3">{trial.description}</p>
                    <a
                      href={trial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View on ClinicalTrials.gov <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFavorite("trials", trial.id)}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.trials.includes(trial.id)
                          ? "fill-primary text-primary"
                          : ""
                      }`}
                    />
                  </Button>
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

export default ResearcherSearch;