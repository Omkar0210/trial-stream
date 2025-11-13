import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Heart, ExternalLink, UserPlus, Loader2 } from "lucide-react";
import { searchResearchers, searchPublications, searchClinicalTrials, toggleFavorite, getFavorites } from "@/services/api";
import type { Researcher, Publication, ClinicalTrial } from "@/types";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { VapiVoiceAssistant } from "@/components/VapiVoiceAssistant";
import { AIChatAssistant } from "@/components/AIChatAssistant";
import { useToast } from "@/hooks/use-toast";
import { generateSimpleSummary, summarizeClinicalTrial } from "@/services/aiService";

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
  const [pubSummaries, setPubSummaries] = useState<Record<string, string>>({});
  const [trialSummaries, setTrialSummaries] = useState<Record<string, string>>({});
  const [loadingSummary, setLoadingSummary] = useState<string | null>(null);

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

  const handleGenerateSummary = async (type: "publication" | "trial", id: string, text: string) => {
    setLoadingSummary(id);
    try {
      const summary = type === "publication" 
        ? await generateSimpleSummary(text)
        : await summarizeClinicalTrial(text);
      
      if (type === "publication") {
        setPubSummaries(prev => ({ ...prev, [id]: summary }));
      } else {
        setTrialSummaries(prev => ({ ...prev, [id]: summary }));
      }
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setLoadingSummary(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <NavigationDrawer userType="researcher" />
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
                    <div className="bg-muted/50 p-3 rounded-lg mb-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Technical Abstract:</p>
                      <p className="text-sm text-foreground/80">{pub.abstract}</p>
                    </div>
                    {pubSummaries[pub.id] && (
                      <div className="bg-primary/5 p-3 rounded-lg mb-3">
                        <p className="text-xs font-semibold text-primary mb-1">AI-Generated Simple Summary:</p>
                        <p className="text-sm">{pubSummaries[pub.id]}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleGenerateSummary("publication", pub.id, pub.abstract || "")}
                        disabled={loadingSummary === pub.id || !!pubSummaries[pub.id]}
                      >
                        {loadingSummary === pub.id ? (
                          <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Generating...</>
                        ) : pubSummaries[pub.id] ? (
                          "Summary Generated"
                        ) : (
                          "Generate AI Summary"
                        )}
                      </Button>
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Read full paper <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
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
                    {trialSummaries[trial.id] && (
                      <div className="bg-primary/5 p-3 rounded-lg mb-3">
                        <p className="text-xs font-semibold text-primary mb-1">AI Summary:</p>
                        <p className="text-sm">{trialSummaries[trial.id]}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleGenerateSummary("trial", trial.id, trial.description)}
                        disabled={loadingSummary === trial.id || !!trialSummaries[trial.id]}
                      >
                        {loadingSummary === trial.id ? (
                          <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Generating...</>
                        ) : trialSummaries[trial.id] ? (
                          "Summary Generated"
                        ) : (
                          "Generate AI Summary"
                        )}
                      </Button>
                      <a
                        href={trial.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        View on ClinicalTrials.gov <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
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

      <VapiVoiceAssistant />
      <AIChatAssistant />
    </div>
  );
};

export default ResearcherSearch;