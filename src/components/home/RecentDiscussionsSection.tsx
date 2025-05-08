
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThreadCard from "@/components/thread/ThreadCard";
import { MessageSquare, TrendingUp, Clock, Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "@/components/auth/AuthModal";

const RecentDiscussionsSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [threads, setThreads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadThreads();
    
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const loadThreads = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("threads")
        .select(`
          *,
          author:author_id (
            id,
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) {
        console.error("Error fetching threads:", error);
        setIsLoading(false);
        return;
      }
      
      setThreads(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error in loadThreads:", error);
      setIsLoading(false);
    }
  };

  // Filtering threads based on search query
  const filteredThreads = threads.filter((thread) =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get threads with no comments for "unanswered" tab
  const unansweredThreads = threads.filter(async (thread) => {
    const { data, error } = await supabase.rpc('get_comment_count', {
      thread_id: thread.id
    });
    
    return !error && data === 0;
  });

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-semibold tracking-tight animate-slide-in">Latest Discussions</h2>
          <div className="flex items-center">
            <div className="relative mr-4 flex-grow md:w-64 animate-slide-in" style={{ animationDelay: "0.1s" }}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search discussions..."
                className="pl-9 pr-4 py-2 h-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isAuthenticated ? (
              <Button className="bg-accent hover:bg-accent/90 animate-slide-in" style={{ animationDelay: "0.2s" }} asChild>
                <Link to="/create-thread" className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" /> New Thread
                </Link>
              </Button>
            ) : (
              <AuthModal 
                trigger={
                  <Button className="bg-accent hover:bg-accent/90 animate-slide-in" style={{ animationDelay: "0.2s" }}>
                    Sign In to Post
                  </Button>
                }
                defaultTab="login"
              />
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading discussions...</p>
          </div>
        ) : (
          <Tabs defaultValue="recent" className="w-full animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex justify-center mb-6">
              <TabsList>
                <TabsTrigger value="recent" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" /> Recent
                </TabsTrigger>
                <TabsTrigger value="popular" className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" /> Popular
                </TabsTrigger>
                <TabsTrigger value="unanswered" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" /> Unanswered
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="recent" className="space-y-4 mt-0 animate-fade-in">
              {filteredThreads.slice(0, 5).map((thread) => (
                <ThreadCard key={thread.id} thread={thread} showCategory={true} />
              ))}
              <div className="flex justify-center mt-8">
                <Button variant="outline" asChild className="animate-scale-in">
                  <Link to="/recent">View more discussions</Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="popular" className="space-y-4 mt-0 animate-fade-in">
              {threads
                .slice(0, 5)
                .map((thread) => (
                  <ThreadCard key={thread.id} thread={thread} showCategory={true} />
                ))}
              <div className="flex justify-center mt-8">
                <Button variant="outline" asChild className="animate-scale-in">
                  <Link to="/popular">View more popular discussions</Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="unanswered" className="space-y-4 mt-0 animate-fade-in">
              {unansweredThreads
                .slice(0, 5)
                .map((thread) => (
                  <ThreadCard key={thread.id} thread={thread} showCategory={true} />
                ))}
              <div className="flex justify-center mt-8">
                <Button variant="outline" asChild className="animate-scale-in">
                  <Link to="/unanswered">View more unanswered discussions</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </section>
  );
};

export default RecentDiscussionsSection;
