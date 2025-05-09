
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoryCard from "@/components/home/CategoryCard";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { categories } from "@/lib/mockData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CategoriesSection = () => {
  const [threadCount, setThreadCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchThreadCount = async () => {
      try {
        const { count, error } = await supabase
          .from("threads")
          .select("*", { count: 'exact', head: true });
          
        if (!error) {
          setThreadCount(count);
        }
      } catch (error) {
        console.error("Error checking thread count:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchThreadCount();
  }, []);
  
  const handlePopulateDatabase = async () => {
    if (window && (window as any).populateDatabase) {
      toast.info("Populating database with mock data...");
      try {
        await (window as any).populateDatabase();
      } catch (error) {
        console.error("Error populating database:", error);
      }
    } else {
      toast.error("Database population utility not available");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold animate-slide-in">Popular Categories</h2>
        <Link to="/categories" className="text-accent hover:underline flex items-center animate-slide-in" style={{ animationDelay: "0.1s" }}>
          View All Categories 
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <div key={i} className="bg-card/80 rounded-lg border border-border/50 animate-pulse h-36"></div>
          ))}
        </div>
      ) : threadCount === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No discussion data found</h3>
          <p className="text-muted-foreground mb-6">
            Populate the database with sample discussions to get started
          </p>
          <Button 
            className="flex items-center gap-2 animate-pulse"
            onClick={handlePopulateDatabase}
          >
            <Database className="h-4 w-4" /> Populate Database
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((category, i) => (
            <div key={category.id} className="animate-slide-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesSection;
