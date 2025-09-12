import { Home, MapPin, Camera, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: MapPin, label: "Map", path: "/map" },
    { icon: Camera, label: "Report", path: "/report" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-civic z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            size="sm"
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
              isActive(item.path)
                ? "text-primary bg-primary/5"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <item.icon className={`h-5 w-5 ${isActive(item.path) ? "text-primary" : ""}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;