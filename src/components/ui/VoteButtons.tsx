
import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VoteButtonsProps {
  upvotes: number;
  downvotes: number;
  entityId: string;
  entityType: "thread" | "comment";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const VoteButtons = ({ entityId, entityType, upvotes: initialUpvotes, downvotes: initialDownvotes, size = "md", className }: VoteButtonsProps) => {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      if (data.session) {
        // Check if user has already voted on this entity
        const { data: voteData, error } = await supabase
          .from("votes")
          .select("vote_type")
          .eq("entity_id", entityId)
          .eq("entity_type", entityType)
          .eq("user_id", data.session.user.id)
          .maybeSingle();
          
        if (!error && voteData) {
          setVote(voteData.vote_type as "up" | "down");
        }
      }
    };
    
    checkAuth();
  }, [entityId, entityType]);
  
  const handleVote = async (voteType: "up" | "down") => {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please login to vote");
      return;
    }
    
    setIsLoading(true);
    
    if (vote === voteType) {
      // Remove vote
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("entity_id", entityId)
        .eq("entity_type", entityType)
        .eq("user_id", session.user.id);
      
      if (error) {
        toast.error("Failed to remove vote");
        console.error("Error removing vote:", error);
        setIsLoading(false);
        return;
      }
      
      setVote(null);
      if (voteType === "up") {
        setUpvotes(upvotes - 1);
      } else {
        setDownvotes(downvotes - 1);
      }
      toast.info(`${voteType === "up" ? "Upvote" : "Downvote"} removed`);
    } else {
      // Add or update vote
      if (vote) {
        // First remove the existing vote
        await supabase
          .from("votes")
          .delete()
          .eq("entity_id", entityId)
          .eq("entity_type", entityType)
          .eq("user_id", session.user.id);
          
        // Update local state
        if (vote === "up") {
          setUpvotes(upvotes - 1);
        } else {
          setDownvotes(downvotes - 1);
        }
      }
      
      // Add the new vote
      const { error } = await supabase
        .from("votes")
        .insert({
          entity_id: entityId,
          entity_type: entityType,
          user_id: session.user.id,
          vote_type: voteType
        });
      
      if (error) {
        toast.error("Failed to submit vote");
        console.error("Error submitting vote:", error);
        setIsLoading(false);
        return;
      }
      
      setVote(voteType);
      if (voteType === "up") {
        setUpvotes(upvotes + 1);
      } else {
        setDownvotes(downvotes + 1);
      }
      toast.success(`${voteType === "up" ? "Upvoted" : "Downvoted"} successfully`);
    }
    
    setIsLoading(false);
  };
  
  const buttonSizeClasses = {
    sm: "p-0.5",
    md: "p-1",
    lg: "p-1.5"
  };
  
  const iconSizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };
  
  const scoreSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };
  
  const score = upvotes - downvotes;
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <button 
        className={cn(
          "rounded-full transition-colors transform hover:scale-110",
          buttonSizeClasses[size],
          vote === "up" ? "bg-accent/20 text-accent" : "hover:bg-accent/10 text-muted-foreground hover:text-accent",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !isLoading && handleVote("up")}
        disabled={isLoading}
      >
        <ArrowUp className={iconSizeClasses[size]} />
      </button>
      
      <span className={cn("font-medium my-0.5", scoreSizeClasses[size])}>
        {score}
      </span>
      
      <button 
        className={cn(
          "rounded-full transition-colors transform hover:scale-110",
          buttonSizeClasses[size],
          vote === "down" ? "bg-destructive/20 text-destructive" : "hover:bg-destructive/10 text-muted-foreground hover:text-destructive",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !isLoading && handleVote("down")}
        disabled={isLoading}
      >
        <ArrowDown className={iconSizeClasses[size]} />
      </button>
    </div>
  );
};

export default VoteButtons;
