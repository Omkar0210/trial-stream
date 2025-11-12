import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Microscope } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
            Cura<span className="text-primary">Link</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Connecting patients and researchers to discover clinical trials, publications, and health experts
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simplifying medical research collaboration, one connection at a time
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div 
            onClick={() => navigate("/patient/onboarding")}
            className="group cursor-pointer"
          >
            <div className="bg-card rounded-2xl p-8 sm:p-10 shadow-soft hover:shadow-medium transition-all duration-300 border-2 border-transparent hover:border-primary">
              <div className="bg-gradient-primary w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">For Patients</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Find the right experts, clinical trials, and research publications for your condition. Get personalized recommendations and connect with top researchers.
              </p>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                I am a Patient or Caregiver
              </Button>
            </div>
          </div>

          <div 
            onClick={() => navigate("/researcher/onboarding")}
            className="group cursor-pointer"
          >
            <div className="bg-card rounded-2xl p-8 sm:p-10 shadow-soft hover:shadow-medium transition-all duration-300 border-2 border-transparent hover:border-primary">
              <div className="bg-gradient-primary w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Microscope className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">For Researchers</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Discover potential collaborators, manage clinical trials, and engage with the research community. Stay updated with the latest publications in your field.
              </p>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                I am a Researcher
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button className="text-primary hover:underline font-medium">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;