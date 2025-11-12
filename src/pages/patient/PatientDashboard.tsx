import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, User, FileText, FlaskConical, 
  MessageSquare, Heart, LogOut, Menu
} from "lucide-react";
import VoiceAgent from "@/components/VoiceAgent";

interface PatientData {
  name: string;
  disease: string;
  location: string;
}

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "patient") {
      navigate("/");
      return;
    }

    const data = localStorage.getItem("patientData");
    if (data) {
      setPatientData(JSON.parse(data));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!patientData) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              Cura<span className="text-primary">Link</span>
            </h1>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-muted-foreground">
                Welcome, {patientData.name}
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
                {patientData.name}
              </h2>
              <p className="text-primary-foreground/90 mb-1">
                <strong>Condition:</strong> {patientData.disease}
              </p>
              <p className="text-primary-foreground/90">
                <strong>Location:</strong> {patientData.location}
              </p>
            </div>
            <Button 
              variant="secondary" 
              onClick={() => navigate("/patient/profile")}
              className="bg-white/20 hover:bg-white/30 text-primary-foreground border-white/30"
            >
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Search Bar */}
        <Card className="p-4 mb-8 shadow-soft">
          <div className="flex gap-2">
            <Input
              placeholder={`Search for researchers, publications, or trials related to ${patientData.disease}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => navigate(`/patient/search?q=${searchQuery}`)}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="experts" className="flex items-center gap-2 py-3">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Experts</span>
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
              <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer" onClick={() => setActiveTab("experts")}>
                <div className="flex items-center justify-between mb-4">
                  <User className="w-8 h-8 text-primary" />
                  <Badge variant="secondary">12 New</Badge>
                </div>
                <h3 className="text-2xl font-bold mb-2">Top Experts</h3>
                <p className="text-muted-foreground">Discover leading researchers in your field</p>
              </Card>

              <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer" onClick={() => setActiveTab("trials")}>
                <div className="flex items-center justify-between mb-4">
                  <FlaskConical className="w-8 h-8 text-primary" />
                  <Badge variant="secondary">8 Active</Badge>
                </div>
                <h3 className="text-2xl font-bold mb-2">Clinical Trials</h3>
                <p className="text-muted-foreground">Find relevant trials near you</p>
              </Card>

              <Card className="p-6 hover:shadow-medium transition-shadow cursor-pointer" onClick={() => setActiveTab("publications")}>
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                  <Badge variant="secondary">24 Recent</Badge>
                </div>
                <h3 className="text-2xl font-bold mb-2">Publications</h3>
                <p className="text-muted-foreground">Latest research in your area</p>
              </Card>
            </div>

            {/* Recommended Experts */}
            <div>
              <h3 className="text-xl font-bold mb-4">Recommended Experts</h3>
              <div className="grid gap-4">
                {[
                  { name: "Dr. Alfonso Fasano", institution: "Toronto Western Hospital", match: 95, specialty: "Movement Disorders" },
                  { name: "Dr. Renato Munhoz", institution: "Toronto Western Hospital", match: 92, specialty: "Parkinson's Disease" },
                  { name: "Dr. Anthony Lang", institution: "Toronto Western Hospital", match: 88, specialty: "Neurology" },
                ].map((expert, idx) => (
                  <Card key={idx} className="p-6 hover:shadow-medium transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold">{expert.name}</h4>
                          <Badge className="bg-primary/10 text-primary">{expert.match}% Match</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{expert.institution}</p>
                        <p className="text-sm text-muted-foreground">{expert.specialty}</p>
                      </div>
                      <Button size="sm" onClick={() => navigate(`/researcher/${expert.name.toLowerCase().replace(/\s+/g, '-')}`)}>
                        View Profile
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experts">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Health Experts</h3>
              <p className="text-muted-foreground">Find leading researchers and specialists in your area of interest.</p>
            </Card>
          </TabsContent>

          <TabsContent value="trials">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Clinical Trials</h3>
              <p className="text-muted-foreground">Discover active clinical trials you may be eligible for.</p>
            </Card>
          </TabsContent>

          <TabsContent value="publications">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Research Publications</h3>
              <p className="text-muted-foreground">Browse the latest research papers and studies.</p>
            </Card>
          </TabsContent>

          <TabsContent value="forums">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Discussion Forums</h3>
              <p className="text-muted-foreground">Connect with the community and ask questions.</p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="fixed bottom-6 left-6 z-40">
          <Button
            onClick={() => navigate("/patient/favorites")}
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

export default PatientDashboard;