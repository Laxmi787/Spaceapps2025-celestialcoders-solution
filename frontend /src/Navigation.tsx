import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Telescope } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌠</span>
            <span className="font-bold text-lg">Exoplanet Classifier</span>
          </div>
          
          <div className="flex gap-1">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300",
                isActive("/")
                  ? "bg-primary/20 text-primary font-medium"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/classifier"
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300",
                isActive("/classifier")
                  ? "bg-primary/20 text-primary font-medium"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Telescope className="w-4 h-4" />
              <span>Classifier</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
