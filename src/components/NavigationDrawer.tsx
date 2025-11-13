import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Home, LayoutDashboard, Users, TestTube, FileText, MessageSquare, Heart, User, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface NavigationDrawerProps {
  userType: "patient" | "researcher";
}

export const NavigationDrawer = ({ userType }: NavigationDrawerProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  const handleAccountTypeChange = () => {
    const newType = userType === "patient" ? "researcher" : "patient";
    navigate(`/${newType}/onboarding`);
    setOpen(false);
  };

  const patientLinks = [
    { icon: Home, label: "Home", path: "/" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/patient/dashboard" },
    { icon: Users, label: "Find Experts", path: "/patient/search" },
    { icon: TestTube, label: "Clinical Trials", path: "/patient/search" },
    { icon: FileText, label: "Publications", path: "/patient/search" },
    { icon: MessageSquare, label: "Forums", path: "/forum" },
    { icon: Heart, label: "Favourites", path: "/patient/favorites" },
    { icon: User, label: "My Profile", path: "/patient/profile" },
  ];

  const researcherLinks = [
    { icon: Home, label: "Home", path: "/" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/researcher/dashboard" },
    { icon: Users, label: "Find Collaborations", path: "/researcher/search" },
    { icon: TestTube, label: "Clinical Trials", path: "/researcher/search" },
    { icon: FileText, label: "Publications", path: "/researcher/search" },
    { icon: MessageSquare, label: "Forums", path: "/forum" },
    { icon: Heart, label: "Favourites", path: "/researcher/favorites" },
    { icon: User, label: "My Profile", path: "/researcher/profile" },
  ];

  const links = userType === "patient" ? patientLinks : researcherLinks;

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 bg-card/80 backdrop-blur-sm hover:bg-card">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-foreground">
              Cura<span className="text-primary">Link</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1 capitalize">
              {userType} Account
            </p>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavigate(link.path)}
                  className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary border-r-2 border-primary"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleAccountTypeChange}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Change Account Type
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
