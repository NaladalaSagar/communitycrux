
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import ExpandableFeaturedThread from "@/components/home/ExpandableFeaturedThread";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { getFeaturedThreads } from "@/lib/mockData";

const FeaturedThreadsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const allFeaturedThreads = getFeaturedThreads();
  
  // Filter threads based on search query
  const filteredThreads = allFeaturedThreads.filter(thread =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* Banner */}
      <section className="relative py-16 overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-background/5 -z-10"></div>
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Featured Discussions
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore the most noteworthy discussions selected by our community moderators. These threads showcase valuable insights and engaging conversations.
          </p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-8">
        <div className="container px-4 mx-auto">
          {/* Search box */}
          <div className="mb-8 max-w-md animate-slide-in" style={{ animationDelay: "0.1s" }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search featured discussions..."
                className="pl-9 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Featured threads grid */}
          {filteredThreads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in" style={{ animationDelay: "0.2s" }}>
              {filteredThreads.map((thread, index) => (
                <div key={thread.id} className="animate-slide-in" style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}>
                  <ExpandableFeaturedThread thread={thread} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured discussions found matching your search.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default FeaturedThreadsPage;
