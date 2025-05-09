
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
  const [popularThreads, setPopularThreads] = useState<any[]>([]);
  const [unansweredThreads, setUnansweredThreads] = useState<any[]>([]);
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
      // Get recent threads
      const { data: recentData, error: recentError } = await supabase
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
      
      if (recentError) {
        console.error("Error fetching threads:", recentError);
        setIsLoading(false);
        return;
      }
      
      setThreads(recentData || []);
      
      // Process threads to get popular and unanswered ones
      const threadsWithData = await Promise.all(recentData.map(async (thread) => {
        // Get vote counts
        const { data: voteData, error: voteError } = await supabase.rpc('get_vote_count', {
          entity_id: thread.id,
          entity_type: 'thread'
        });
        
        let upvotes = 0;
        let downvotes = 0;
        
        if (!voteError && voteData) {
          const voteCountData = voteData as { upvotes: number; downvotes: number };
          upvotes = voteCountData.upvotes || 0;
          downvotes = voteCountData.downvotes || 0;
        }
        
        // Get comment counts
        const { data: commentCount, error: commentError } = await supabase.rpc('get_comment_count', {
          thread_id: thread.id
        });
        
        return {
          ...thread,
          upvotes,
          downvotes,
          commentCount: commentError ? 0 : commentCount
        };
      }));
      
      // Set popular threads
      const sortedByPopularity = [...threadsWithData].sort((a, b) => 
        ((b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
      );
      setPopularThreads(sortedByPopularity);
      
      // Set unanswered threads
      const noComments = threadsWithData.filter(thread => thread.commentCount === 0);
      setUnansweredThreads(noComments);
      
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
  
  const filteredPopularThreads = popularThreads.filter((thread) =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredUnansweredThreads = unansweredThreads.filter((thread) =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              {filteredPopularThreads.slice(0, 5).map((thread) => (
                <ThreadCard key={thread.id} thread={thread} showCategory={true} />
              ))}
              <div className="flex justify-center mt-8">
                <Button variant="outline" asChild className="animate-scale-in">
                  <Link to="/popular">View more popular discussions</Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="unanswered" className="space-y-4 mt-0 animate-fade-in">
              {filteredUnansweredThreads.slice(0, 5).map((thread) => (
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
