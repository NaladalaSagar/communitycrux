
import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VoteButtonsProps {
  upvotes: number;
  downvotes: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const VoteButtons = ({ upvotes, downvotes, size = "md", className }: VoteButtonsProps) => {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [score, setScore] = useState(upvotes - downvotes);
  
  const handleUpvote = () => {
    if (vote === "up") {
      // Remove upvote
      setVote(null);
      setScore(score - 1);
      toast.info("Upvote removed");
    } else {
      // Add upvote (and remove downvote if exists)
      const prevVote = vote;
      setVote("up");
      setScore(prevVote === "down" ? score + 2 : score + 1);
      toast.success("Upvoted successfully");
    }
  };
  
  const handleDownvote = () => {
    if (vote === "down") {
      // Remove downvote
      setVote(null);
      setScore(score + 1);
      toast.info("Downvote removed");
    } else {
      // Add downvote (and remove upvote if exists)
      const prevVote = vote;
      setVote("down");
      setScore(prevVote === "up" ? score - 2 : score - 1);
      toast.success("Downvoted successfully");
    }
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
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <button 
        className={cn(
          "rounded-full transition-colors transform hover:scale-110",
          buttonSizeClasses[size],
          vote === "up" ? "bg-accent/20 text-accent" : "hover:bg-accent/10 text-muted-foreground hover:text-accent"
        )}
        onClick={handleUpvote}
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
          vote === "down" ? "bg-destructive/20 text-destructive" : "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
        )}
        onClick={handleDownvote}
      >
        <ArrowDown className={iconSizeClasses[size]} />
      </button>
    </div>
  );
};

export default VoteButtons;
