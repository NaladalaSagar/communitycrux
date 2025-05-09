
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, MessageCircle, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Thread } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "@/components/auth/AuthModal";

interface ExpandableFeaturedThreadProps {
  thread: Thread | {
    id: string;
    title: string;
    content: string;
    author?: {
      id: string;
      name?: string;
      username?: string;
      avatar?: string;
      avatar_url?: string;
    };
    author_id?: string;
    upvotes?: number;
    downvotes?: number;
    commentCount?: number;
    createdAt?: Date;
    created_at?: string;
    tags?: string[];
  };
}

const ExpandableFeaturedThread = ({ thread: initialThread }: ExpandableFeaturedThreadProps) => {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [voteState, setVoteState] = useState<"up" | "down" | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if using Supabase data (has author_id instead of author object)
  const isSupabaseData = 'author_id' in initialThread;
  
  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      if (data.session) {
        // Check if user has already voted on this thread
        const { data: voteData } = await supabase
          .from("votes")
          .select()
          .eq("entity_id", initialThread.id)
          .eq("entity_type", "thread")
          .eq("user_id", data.session.user.id)
          .maybeSingle();
          
        if (voteData) {
          setVoteState(voteData.vote_type as "up" | "down");
        }
      }
    };
    
    checkAuth();
    
    // Get vote and comment counts
    const fetchCounts = async () => {
      // Get vote counts
      const { data: voteData, error: voteError } = await supabase.rpc('get_vote_count', {
        entity_id: initialThread.id,
        entity_type: 'thread'
      });
      
      if (!voteError && voteData) {
        const voteCountData = voteData as { upvotes: number; downvotes: number };
        setUpvotes(voteCountData.upvotes || 0);
        setDownvotes(voteCountData.downvotes || 0);
      } else if (initialThread.upvotes !== undefined && initialThread.downvotes !== undefined) {
        setUpvotes(initialThread.upvotes);
        setDownvotes(initialThread.downvotes);
      }
      
      // Get comment count
      const { data: commentCountData, error: commentCountError } = await supabase.rpc('get_comment_count', {
        thread_id: initialThread.id
      });
      
      if (!commentCountError) {
        setCommentCount(commentCountData || 0);
      } else if (initialThread.commentCount !== undefined) {
        setCommentCount(initialThread.commentCount);
      }
    };
    
    fetchCounts();
  }, [initialThread.id]);
  
  const handleVote = async (type: "up" | "down", event: React.MouseEvent) => {
    // Prevent navigation when clicking on vote buttons
    event.preventDefault();
    event.stopPropagation();
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to vote");
        setIsLoading(false);
        return;
      }
      
      if (voteState === type) {
        // Remove vote
        const { error } = await supabase
          .from("votes")
          .delete()
          .eq("entity_id", initialThread.id)
          .eq("entity_type", "thread")
          .eq("user_id", session.user.id);
        
        if (error) {
          toast.error("Failed to remove vote");
          console.error("Error removing vote:", error);
          setIsLoading(false);
          return;
        }
        
        setVoteState(null);
        if (type === "up") {
          setUpvotes(prev => prev - 1);
        } else {
          setDownvotes(prev => prev - 1);
        }
        toast.info(`${type === "up" ? "Upvote" : "Downvote"} removed`);
      } else {
        // Add new vote and remove opposite if exists
        if (voteState !== null) {
          // First remove the existing vote
          await supabase
            .from("votes")
            .delete()
            .eq("entity_id", initialThread.id)
            .eq("entity_type", "thread")
            .eq("user_id", session.user.id);
            
          // Update local state
          if (voteState === "up") {
            setUpvotes(prev => prev - 1);
          } else {
            setDownvotes(prev => prev - 1);
          }
        }
        
        // Add the new vote
        const { error } = await supabase
          .from("votes")
          .insert({
            entity_id: initialThread.id,
            entity_type: "thread",
            user_id: session.user.id,
            vote_type: type
          });
        
        if (error) {
          toast.error("Failed to submit vote");
          console.error("Error submitting vote:", error);
          setIsLoading(false);
          return;
        }
        
        setVoteState(type);
        if (type === "up") {
          setUpvotes(prev => prev + 1);
        } else {
          setDownvotes(prev => prev + 1);
        }
        toast.success(`${type === "up" ? "Upvoted" : "Downvoted"} successfully`);
      }
    } catch (error) {
      console.error("Error in handleVote:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  
  const voteCount = upvotes - downvotes;
  
  // Get author info depending on data source
  const authorName = isSupabaseData 
    ? initialThread.author?.username || "Anonymous" 
    : initialThread.author?.name || "Anonymous";
    
  const authorAvatar = isSupabaseData
    ? initialThread.author?.avatar_url || `https://avatar.vercel.sh/${authorName}.png`
    : initialThread.author?.avatar || `https://avatar.vercel.sh/${authorName}.png`;
    
  const createdAt = new Date(isSupabaseData ? initialThread.created_at || '' : initialThread.createdAt || '');

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };
  
  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={setIsExpanded}
      className="group block"
    >
      <Link 
        to={`/thread/${initialThread.id}`} 
        onClick={(e) => e.target === e.currentTarget && e.preventDefault()}
        className="block"
      >
        <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 group-hover:shadow-medium group-hover:translate-y-[-2px]">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              {initialThread.tags && initialThread.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  {initialThread.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground animate-fade-in"
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
              {initialThread.title}
            </h3>
            
            <CollapsibleContent className="overflow-hidden">
              <div className="animate-slide-in mb-4">
                <p className="text-muted-foreground mb-4">
                  {initialThread.content}
                </p>
              </div>
            </CollapsibleContent>
            
            <p className={cn(
              "text-muted-foreground transition-all duration-300",
              isExpanded ? "hidden" : "line-clamp-2 mb-6"
            )}>
              {initialThread.content}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={authorAvatar} />
                  <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{authorName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">
                    {!isNaN(createdAt.getTime()) ? formatDistanceToNow(createdAt, { addSuffix: true }) : 'Recently'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">{commentCount}</span>
                </div>
                
                {/* Vote buttons */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleVote("up", e)}
                    className={cn(
                      "p-1 rounded-full transition-colors hover:bg-accent/10",
                      voteState === "up" ? "text-accent" : "text-muted-foreground hover:text-accent",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isLoading}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                  <span className={cn(
                    "text-xs font-medium",
                    voteCount > 0 ? "text-accent" : voteCount < 0 ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {voteCount}
                  </span>
                  <button 
                    onClick={(e) => handleVote("down", e)}
                    className={cn(
                      "p-1 rounded-full transition-colors hover:bg-destructive/10",
                      voteState === "down" ? "text-destructive" : "text-muted-foreground hover:text-destructive",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isLoading}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Expand/collapse button */}
                <CollapsibleTrigger asChild onClick={toggleExpand}>
                  <Button variant="ghost" size="sm" className="p-1 h-auto">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            
            {isExpanded && (
              <div className="mt-6 animate-fade-in">
                <Button 
                  size="sm" 
                  className="bg-accent hover:bg-accent/90 animate-slide-in"
                  asChild
                >
                  <Link to={`/thread/${initialThread.id}`}>Read full thread</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </Link>
      
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          trigger={<></>}
          defaultTab="login" 
          onSuccess={() => setShowAuthModal(false)}
        />
      )}
    </Collapsible>
  );
};

export default ExpandableFeaturedThread;
