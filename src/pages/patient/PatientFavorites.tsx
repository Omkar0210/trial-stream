import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { getFavorites, searchResearchers, searchPublications, searchClinicalTrials } from "@/services/api";
import type { Researcher, Publication, ClinicalTrial } from "@/types";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { VapiVoiceAssistant } from "@/components/VapiVoiceAssistant";
import { AIChatAssistant } from "@/components/AIChatAssistant";
import { useToast } from "@/hooks/use-toast";

const PatientFavorites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [researchers, setResearchers] = useState<Researcher[]>([]);
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

    setResearchers(allResearchers.filter(r => favorites.researchers.includes(r.id)));
    setPublications(allPublications.filter(p => favorites.publications.includes(p.id)));
    setTrials(allTrials.filter(t => favorites.trials.includes(t.id)));
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const generateSummary = () => {
    const selectedResearchers = researchers.filter(r => selectedItems.includes(r.id));
    const selectedPublications = publications.filter(p => selectedItems.includes(p.id));
    const selectedTrials = trials.filter(t => selectedItems.includes(t.id));

    let summary = "CuraLink - Medical Research Summary\n\n";
    
    if (selectedResearchers.length > 0) {
      summary += "HEALTH EXPERTS\n" + "=".repeat(50) + "\n\n";
      selectedResearchers.forEach(r => {
        summary += `${r.name}\n`;
        summary += `Institution: ${r.institution}\n`;
        summary += `Specialty: ${r.specialty}\n`;
        summary += `Location: ${r.location}\n\n`;
      });
    }

    if (selectedPublications.length > 0) {
      summary += "\nRELEVANT PUBLICATIONS\n" + "=".repeat(50) + "\n\n";
      selectedPublications.forEach(p => {
        summary += `${p.title}\n`;
        summary += `${p.authors}\n`;
        summary += `${p.journal}, ${p.date}\n\n`;
      });
    }

    if (selectedTrials.length > 0) {
      summary += "\nCLINICAL TRIALS\n" + "=".repeat(50) + "\n\n";
      selectedTrials.forEach(t => {
        summary += `${t.title}\n`;
        summary += `ID: ${t.id}\n`;
        summary += `Status: ${t.status} | Phase: ${t.phase}\n`;
        summary += `Location: ${t.location}\n\n`;
      });
    }

    // Create download
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "medical-research-summary.txt";
    a.click();

    toast({
      title: "Summary Generated",
      description: "Your medical research summary has been downloaded. Share this with your doctor!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <NavigationDrawer userType="patient" />
      <header className="bg-card border-b shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/patient/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">
                My Favorites
              </h1>
            </div>
            <Button 
              onClick={generateSummary} 
              disabled={selectedItems.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Generate Summary
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 mb-6 bg-accent">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Create a Summary for Your Doctor</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Select the experts, publications, and clinical trials you want to discuss with your healthcare provider. 
                We'll generate a comprehensive summary document you can take to your appointment.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> Check the boxes next to items you want to include in your summary.
              </p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="collaborations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="collaborations">
              Potential Collaborations ({researchers.length})
            </TabsTrigger>
            <TabsTrigger value="reading">
              Reading List ({publications.length})
            </TabsTrigger>
            <TabsTrigger value="trials">
              Interesting Trials ({trials.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collaborations" className="space-y-4">
            {researchers.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No favorite researchers yet. Start exploring!</p>
              </Card>
            ) : (
              researchers.map((researcher) => (
                <Card key={researcher.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedItems.includes(researcher.id)}
                      onCheckedChange={() => toggleSelection(researcher.id)}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{researcher.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{researcher.institution}</p>
                      <p className="text-sm text-muted-foreground">{researcher.specialty}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="reading" className="space-y-4">
            {publications.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No favorite publications yet. Start exploring!</p>
              </Card>
            ) : (
              publications.map((pub) => (
                <Card key={pub.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedItems.includes(pub.id)}
                      onCheckedChange={() => toggleSelection(pub.id)}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{pub.title}</h3>
                      <p className="text-sm text-muted-foreground">{pub.authors}</p>
                      <p className="text-sm text-muted-foreground">{pub.journal}, {pub.date}</p>
                    </div>
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
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedItems.includes(trial.id)}
                      onCheckedChange={() => toggleSelection(trial.id)}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{trial.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">ID: {trial.id}</p>
                      <p className="text-sm text-muted-foreground">{trial.status} • {trial.phase} • {trial.location}</p>
                    </div>
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

export default PatientFavorites;