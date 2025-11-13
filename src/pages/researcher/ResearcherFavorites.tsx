import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getFavorites, searchResearchers, searchPublications, searchClinicalTrials, toggleFavorite } from "@/services/api";
import type { Researcher, Publication, ClinicalTrial } from "@/types";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { VapiVoiceAssistant } from "@/components/VapiVoiceAssistant";
import { AIChatAssistant } from "@/components/AIChatAssistant";

const ResearcherFavorites = () => {
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState<Researcher[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [trials, setTrials] = useState<ClinicalTrial[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favorites = getFavorites();
    
    // In a real app, this would fetch the actual data for favorited items
    const allResearchers = await searchResearchers("");
    const allPublications = await searchPublications("");
    const allTrials = await searchClinicalTrials("");

    setCollaborators(allResearchers.filter(r => favorites.researchers.includes(r.id)));
    setPublications(allPublications.filter(p => favorites.publications.includes(p.id)));
    setTrials(allTrials.filter(t => favorites.trials.includes(t.id)));
  };

  const handleRemoveFavorite = (type: "researchers" | "publications" | "trials", id: string) => {
    toggleFavorite(type, id);
    loadFavorites();
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
              My Favorites
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="collaborators" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="collaborators">
              Potential Collaborations ({collaborators.length})
            </TabsTrigger>
            <TabsTrigger value="publications">
              Reading List ({publications.length})
            </TabsTrigger>
            <TabsTrigger value="trials">
              Interesting Trials ({trials.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collaborators" className="space-y-4">
            {collaborators.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No favorite collaborators yet. Start exploring!</p>
              </Card>
            ) : (
              collaborators.map((collab) => (
                <Card key={collab.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{collab.name}</h3>
                        <Badge className="bg-primary/10 text-primary">{collab.matchScore}% Match</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{collab.institution}</p>
                      <p className="text-sm text-muted-foreground mb-2">{collab.specialty}</p>
                      <div className="flex flex-wrap gap-2">
                        {collab.researchInterests?.slice(0, 3).map((interest, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{interest}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFavorite("researchers", collab.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="publications" className="space-y-4">
            {publications.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No favorite publications yet. Start exploring!</p>
              </Card>
            ) : (
              publications.map((pub) => (
                <Card key={pub.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{pub.title}</h3>
                      <p className="text-sm text-muted-foreground">{pub.authors}</p>
                      <p className="text-sm text-muted-foreground">{pub.journal}, {pub.date}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFavorite("publications", pub.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="trials" className="space-y-4">
            {trials.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No favorite trials yet. Start exploring!</p>
              </Card>
            ) : (
              trials.map((trial) => (
                <Card key={trial.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{trial.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">ID: {trial.id}</p>
                      <div className="flex gap-2 items-center">
                        <Badge variant="secondary">{trial.status}</Badge>
                        <Badge variant="outline">{trial.phase}</Badge>
                        <span className="text-sm text-muted-foreground">{trial.location}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFavorite("trials", trial.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <VapiVoiceAssistant />
      <AIChatAssistant />
    </div>
  );
};

export default ResearcherFavorites;