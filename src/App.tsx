import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import PatientOnboarding from "./pages/patient/PatientOnboarding";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientSearch from "./pages/patient/PatientSearch";
import PatientFavorites from "./pages/patient/PatientFavorites";
import PatientProfile from "./pages/patient/PatientProfile";
import ResearcherOnboarding from "./pages/researcher/ResearcherOnboarding";
import ResearcherDashboard from "./pages/researcher/ResearcherDashboard";
import ResearcherSearch from "./pages/researcher/ResearcherSearch";
import ResearcherFavorites from "./pages/researcher/ResearcherFavorites";
import ResearcherProfile from "./pages/researcher/ResearcherProfile";
import ResearcherProfileView from "./pages/shared/ResearcherProfileView";
import Forum from "./pages/shared/Forum";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/patient/onboarding" element={<PatientOnboarding />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/search" element={<PatientSearch />} />
          <Route path="/patient/favorites" element={<PatientFavorites />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
          <Route path="/researcher/onboarding" element={<ResearcherOnboarding />} />
          <Route path="/researcher/dashboard" element={<ResearcherDashboard />} />
          <Route path="/researcher/search" element={<ResearcherSearch />} />
          <Route path="/researcher/favorites" element={<ResearcherFavorites />} />
          <Route path="/researcher/profile" element={<ResearcherProfile />} />
          <Route path="/researcher/:id" element={<ResearcherProfileView />} />
          <Route path="/forum" element={<Forum />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
