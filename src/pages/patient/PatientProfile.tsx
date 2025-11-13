import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { NavigationDrawer } from "@/components/NavigationDrawer";
import { VapiVoiceAssistant } from "@/components/VapiVoiceAssistant";
import { AIChatAssistant } from "@/components/AIChatAssistant";
import { useToast } from "@/hooks/use-toast";

const PatientProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("patientData");
    return saved ? JSON.parse(saved) : {
      name: "",
      disease: "",
      location: ""
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("patientData", JSON.stringify(formData));
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
    navigate("/patient/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <NavigationDrawer userType="patient" />
      <header className="bg-card border-b shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/patient/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disease">Condition of Interest *</Label>
              <Input
                id="disease"
                value={formData.disease}
                onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                placeholder="e.g., Parkinson's disease, Breast Cancer, ADHD"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Toronto, Canada"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/patient/dashboard")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <VapiVoiceAssistant />
      <AIChatAssistant />
    </div>
  );
};

export default PatientProfile;
