
import { Link } from "react-router-dom";
import { Calendar, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Thread } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FeaturedThreadProps {
  thread: Thread;
}

const FeaturedThread = ({ thread: initialThread }: FeaturedThreadProps) => {
  const [thread, setThread] = useState(initialThread);
  const [voteState, setVoteState] = useState<"up" | "down" | null>(null);
  
  const handleVote = (type: "up" | "down", event: React.MouseEvent) => {
    // Prevent navigation when clicking on vote buttons
    event.preventDefault();
    event.stopPropagation();
    
    if (voteState === type) {
      // Remove vote
      setVoteState(null);
      setThread(prev => ({
        ...prev,
        [type === "up" ? "upvotes" : "downvotes"]: prev[type === "up" ? "upvotes" : "downvotes"] - 1
      }));
      toast.info(`${type === "up" ? "Upvote" : "Downvote"} removed`);
    } else {
      // Add new vote and remove opposite if exists
      if (voteState !== null) {
        // Remove existing vote first
        setThread(prev => ({
          ...prev,
          [voteState === "up" ? "upvotes" : "downvotes"]: prev[voteState === "up" ? "upvotes" : "downvotes"] - 1
        }));
      }
      
      // Add new vote
      setVoteState(type);
      setThread(prev => ({
        ...prev,
        [type === "up" ? "upvotes" : "downvotes"]: prev[type === "up" ? "upvotes" : "downvotes"] + 1
      }));
      
      toast.success(`${type === "up" ? "Upvoted" : "Downvoted"} successfully`);
    }
  };
  
  const voteCount = thread.upvotes - thread.downvotes;
  
  return (
    <Link 
      to={`/thread/${thread.id}`} 
      className="group block"
    >
      <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 group-hover:shadow-medium group-hover:translate-y-[-2px]">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            {thread.tags && thread.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                {thread.tags.map((tag, index) => (
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
            {thread.title}
          </h3>
          
          <p className="text-muted-foreground line-clamp-2 mb-6">
            {thread.content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={thread.author.avatar} />
                <AvatarFallback>{thread.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{thread.author.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">
                  {formatDistanceToNow(thread.createdAt, { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{thread.commentCount}</span>
              </div>
              
              {/* Vote buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => handleVote("up", e)}
                  className={cn(
                    "p-1 rounded-full transition-colors hover:bg-accent/10",
                    voteState === "up" ? "text-accent" : "text-muted-foreground hover:text-accent"
                  )}
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
                    voteState === "down" ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                  )}
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedThread;
