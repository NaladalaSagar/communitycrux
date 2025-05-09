
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ExpandableFeaturedThread from "@/components/home/ExpandableFeaturedThread";
import { supabase } from "@/integrations/supabase/client";

const FeaturedSection = () => {
  const [featuredThreads, setFeaturedThreads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedThreads = async () => {
      try {
        // Fetch pinned threads first
        const { data: pinnedThreads, error: pinnedError } = await supabase
          .from("threads")
          .select(`
            *,
            author:author_id (
              id,
              username,
              avatar_url
            )
          `)
          .eq("is_pinned", true)
          .order("created_at", { ascending: false })
          .limit(3);
        
        if (pinnedError) {
          console.error("Error fetching pinned threads:", pinnedError);
          setIsLoading(false);
          return;
        }
        
        // If we don't have enough pinned threads, fetch most upvoted threads
        if (!pinnedThreads || pinnedThreads.length < 3) {
          // Get all threads
          const { data: allThreads, error: allThreadsError } = await supabase
            .from("threads")
            .select(`
              *,
              author:author_id (
                id,
                username,
                avatar_url
              )
            `);
            
          if (allThreadsError) {
            console.error("Error fetching all threads:", allThreadsError);
            setFeaturedThreads(pinnedThreads || []);
            setIsLoading(false);
            return;
          }
          
          // Get vote counts for each thread
          const threadsWithVotes = await Promise.all((allThreads || []).map(async (thread) => {
            const { data: voteData, error: voteError } = await supabase.rpc('get_vote_count', {
              entity_id: thread.id,
              entity_type: 'thread'
            });
            
            if (!voteError && voteData) {
              const voteCountData = voteData as { upvotes: number; downvotes: number };
              return { 
                ...thread, 
                upvotes: voteCountData.upvotes || 0, 
                downvotes: voteCountData.downvotes || 0 
              };
            }
            return thread;
          }));
          
          // Sort by popularity (upvotes - downvotes)
          const sortedThreads = threadsWithVotes.sort((a, b) => 
            ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0))
          );
          
          // Combine pinned + popular threads, removing duplicates
          const pinnedIds = (pinnedThreads || []).map(t => t.id);
          const popularNotPinned = sortedThreads.filter(t => !pinnedIds.includes(t.id));
          
          // Take enough popular threads to have 3 total
          const needed = Math.max(0, 3 - (pinnedThreads?.length || 0));
          const combined = [...(pinnedThreads || []), ...popularNotPinned.slice(0, needed)];
          
          setFeaturedThreads(combined);
        } else {
          setFeaturedThreads(pinnedThreads);
        }
      } catch (error) {
        console.error("Error in fetchFeaturedThreads:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedThreads();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold tracking-tight animate-slide-in">Featured Discussions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="bg-card/80 rounded-xl border border-border/50 animate-pulse h-56"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredThreads.length === 0) {
    return (
      <section className="py-16 bg-secondary/30">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Featured Discussions</h2>
          <p className="text-muted-foreground mb-8">No featured discussions yet.</p>
          <div className="flex justify-center">
            <Button onClick={() => (window as any).populateDatabase()} className="animate-pulse">
              Click to Populate Database
            </Button>
          </div>
        </div>
      </section>
    );
  }

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
