import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Users, FileText, FlaskConical, 
  MessageSquare, Heart, LogOut
} from "lucide-react";
import VoiceAgent from "@/components/VoiceAgent";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { VapiVoiceAssistant } from "@/components/VapiVoiceAssistant";
import { AIChatAssistant } from "@/components/AIChatAssistant";

interface ResearcherData {
  name: string;
  institution: string;
  specialties: string;
  researchInterests: string;
  location: string;
}

const ResearcherDashboard = () => {
  const navigate = useNavigate();
  const [researcherData, setResearcherData] = useState<ResearcherData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "researcher") {
      navigate("/");
      return;
    }

    const data = localStorage.getItem("researcherData");
    if (data) {
      setResearcherData(JSON.parse(data));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!researcherData) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <NavigationDrawer userType="researcher" />
      <VapiVoiceAssistant />
      <AIChatAssistant />
      {/* Header */}
      <header className="bg-card border-b shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              Cura<span className="text-primary">Link</span>
            </h1>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-muted-foreground">
                {researcherData.name}
              </span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Banner */}
        <Card className="p-6 mb-8 bg-gradient-primary">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-primary-foreground mb-2">
                {researcherData.name}
              </h2>
              <p className="text-primary-foreground/90 mb-1">
                <strong>Institution:</strong> {researcherData.institution}
              </p>
              <p className="text-primary-foreground/90 mb-1">
                <strong>Specialties:</strong> {researcherData.specialties}
              </p>
              <p className="text-primary-foreground/90">
                <strong>Location:</strong> {researcherData.location}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                variant="secondary" 
                onClick={() => navigate("/researcher/profile")}
                className="bg-white/20 hover:bg-white/30 text-primary-foreground border-white/30"
              >
                Edit Profile
              </Button>
              <Badge variant="secondary" className="bg-green-500 text-white justify-center">
                Open for Collaboration
              </Badge>
            </div>
          </div>
        </Card>

        {/* Search Bar */}
        <Card className="p-4 mb-8 shadow-soft">
          <div className="flex gap-2">
            <Input
              placeholder="Search for collaborators, publications, or clinical trials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => navigate(`/researcher/search?q=${searchQuery}`)}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="collaborators" className="flex items-center gap-2 py-3">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Collaborators</span>
            </TabsTrigger>
            <TabsTrigger value="trials" className="flex items-center gap-2 py-3">
              <FlaskConical className="w-4 h-4" />
              <span className="hidden sm:inline">Trials</span>
            </TabsTrigger>
            <TabsTrigger value="publications" className="flex items-center gap-2 py-3">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Publications</span>
            </TabsTrigger>
            <TabsTrigger value="forums" className="flex items-center gap-2 py-3" onClick={() => navigate("/forum")}>
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Forums</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer" onClick={() => setActiveTab("collaborators")}>
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-primary" />
                  <Badge variant="secondary">8 New</Badge>
                </div>
                <h3 className="text-2xl font-bold mb-2">Collaborators</h3>
                <p className="text-muted-foreground">Connect with fellow researchers</p>
              </Card>

              <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer" onClick={() => setActiveTab("trials")}>
                <div className="flex items-center justify-between mb-4">
                  <FlaskConical className="w-8 h-8 text-primary" />
                  <Badge variant="secondary">3 Active</Badge>
                </div>
                <h3 className="text-2xl font-bold mb-2">Clinical Trials</h3>
                <p className="text-muted-foreground">Manage your research trials</p>
              </Card>

              <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer" onClick={() => setActiveTab("publications")}>
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                  <Badge variant="secondary">15 Recent</Badge>
                </div>
                <h3 className="text-2xl font-bold mb-2">Publications</h3>
                <p className="text-muted-foreground">Your research papers</p>
              </Card>
            </div>

            {/* Potential Collaborators */}
            <div>
              <h3 className="text-xl font-bold mb-4">Potential Collaborators</h3>
              <div className="grid gap-4">
                {[
                  { name: "Dr. Carolina Gorodetsky", institution: "Hospital for Sick Children", match: 94, specialty: "Pediatric Neurology" },
                  { name: "Dr. George Ibrahim", institution: "SickKids Hospital", match: 89, specialty: "Neurosurgery" },
                  { name: "Dr. Asif Doja", institution: "Children's Hospital of Eastern Ontario", match: 87, specialty: "Pediatric Neurology" },
                ].map((researcher, idx) => (
                  <Card key={idx} className="p-6 hover:shadow-medium transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold">{researcher.name}</h4>
                          <Badge className="bg-primary/10 text-primary">{researcher.match}% Match</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{researcher.institution}</p>
                        <p className="text-sm text-muted-foreground">{researcher.specialty}</p>
                      </div>
                      <Button size="sm">Request Collaboration</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Publications */}
            <div>
              <h3 className="text-xl font-bold mb-4">Recent Publications in Your Field</h3>
              <div className="grid gap-4">
                {[
                  { title: "Advances in Deep Brain Stimulation for Parkinson's Disease", journal: "Nature Neuroscience", date: "2025-01" },
                  { title: "Long-term Outcomes of Movement Disorder Treatment", journal: "The Lancet Neurology", date: "2024-12" },
                ].map((pub, idx) => (
                  <Card key={idx} className="p-4 hover:shadow-soft transition-shadow cursor-pointer">
                    <h4 className="font-semibold mb-1">{pub.title}</h4>
                    <p className="text-sm text-muted-foreground">{pub.journal} • {pub.date}</p>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="collaborators">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Find Collaborators</h3>
              <p className="text-muted-foreground">Connect with researchers in your field.</p>
            </Card>
          </TabsContent>

          <TabsContent value="trials">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Clinical Trials</h3>
              <p className="text-muted-foreground">Manage and discover clinical trials.</p>
            </Card>
          </TabsContent>

          <TabsContent value="publications">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Publications</h3>
              <p className="text-muted-foreground">Your publications and recent papers in your field.</p>
            </Card>
          </TabsContent>

          <TabsContent value="forums">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Forums</h3>
              <p className="text-muted-foreground">Engage with the research community.</p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="fixed bottom-6 left-6 z-40">
          <Button
            onClick={() => navigate("/researcher/favorites")}
            className="rounded-full shadow-medium"
            size="lg"
          >
            <Heart className="w-5 h-5 mr-2" />
            My Favorites
          </Button>
        </div>
      </div>

      <VoiceAgent />
    </div>
  );
};

export default ResearcherDashboard;