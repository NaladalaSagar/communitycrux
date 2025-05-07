
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface BackButtonProps {
  fallbackPath?: string;
  label?: string;
  className?: string;
}

const BackButton = ({
  fallbackPath = "/",
  label = "Back",
  className = "",
}: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if we have history to go back to
    setCanGoBack(window.history.length > 2);
  }, [location]);

  const handleGoBack = () => {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <Button
      variant="default"
      className={`group flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md transition-all ${className}`}
      onClick={handleGoBack}
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:scale-110" />
      <span>{label}</span>
    </Button>
  );
};

export default BackButton;
