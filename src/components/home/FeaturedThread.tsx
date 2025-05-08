
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "@/components/auth/AuthModal";

interface FeaturedThreadProps {
  thread: {
    id: string;
    title: string;
    content: string;
    author_id: string;
    created_at: string;
    tags?: string[];
    author?: {
      username?: string;
      avatar_url?: string;
    };
  };
}

const FeaturedThread = ({ thread: initialThread }: FeaturedThreadProps) => {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [voteState, setVoteState] = useState<"up" | "down" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      if (data.session) {
        // Check if user has already voted on this thread
        const { data: voteData, error } = await supabase
          .from("votes")
          .select("vote_type")
          .eq("entity_id", initialThread.id)
          .eq("entity_type", "thread")
          .eq("user_id", data.session.user.id)
          .maybeSingle();
          
        if (!error && voteData) {
          setVoteState(voteData.vote_type as "up" | "down");
        }
      }
    };
    
    checkAuth();
    
    // Get vote counts
    const fetchVoteAndCommentCounts = async () => {
      const { data: voteData, error: voteError } = await supabase.rpc('get_vote_count', {
        entity_id: initialThread.id,
        entity_type: 'thread'
      });
      
      if (!voteError && voteData) {
        setUpvotes(voteData.upvotes || 0);
        setDownvotes(voteData.downvotes || 0);
      }
      
      // Get comment count
      const { data: commentCountData, error: commentCountError } = await supabase.rpc('get_comment_count', {
        thread_id: initialThread.id
      });
      
      if (!commentCountError) {
        setCommentCount(commentCountData || 0);
      }
    };
    
    fetchVoteAndCommentCounts();
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
  const authorName = initialThread.author?.username || "Anonymous";
  const authorAvatar = initialThread.author?.avatar_url || `https://avatar.vercel.sh/${authorName}.png`;
  const createdAt = new Date(initialThread.created_at);
  
  return (
    <>
      <Link 
        to={`/thread/${initialThread.id}`} 
        className="group block"
      >
        <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 group-hover:shadow-medium group-hover:translate-y-[-2px]">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              {initialThread.tags && initialThread.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  {initialThread.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
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
            
            <p className="text-muted-foreground line-clamp-2 mb-6">
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
                    {formatDistanceToNow(createdAt, { addSuffix: true })}
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
              </div>
            </div>
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
    </>
  );
};

export default FeaturedThread;
