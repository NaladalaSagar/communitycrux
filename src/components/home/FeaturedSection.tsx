
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ExpandableFeaturedThread from "@/components/home/ExpandableFeaturedThread";
import { getFeaturedThreads } from "@/lib/mockData";

const FeaturedSection = () => {
  const featuredThreads = getFeaturedThreads();
  if (featuredThreads.length === 0) return null;

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight animate-slide-in">Featured Discussions</h2>
          <Button variant="ghost" size="sm" asChild className="animate-slide-in" style={{ animationDelay: "0.1s" }}>
            <Link to="/featured" className="text-muted-foreground hover:text-accent">
              View all
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredThreads.slice(0, 3).map((thread, i) => (
            <div key={thread.id} className="animate-slide-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <ExpandableFeaturedThread thread={thread} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
