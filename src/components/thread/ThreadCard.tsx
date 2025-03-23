
import { Link } from "react-router-dom";
import { Calendar, MessageCircle, ArrowUp, ArrowDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Thread } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";

interface ThreadCardProps {
  thread: Thread;
  showCategory?: boolean;
}

const ThreadCard = ({ thread, showCategory = false }: ThreadCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-soft group">
      <div className="flex">
        {/* Vote column */}
        <div className="bg-secondary/50 p-4 flex flex-col items-center justify-start gap-1 min-w-[60px]">
          <button className="rounded-full p-1 hover:bg-background transition-colors">
            <ArrowUp className="h-5 w-5 text-muted-foreground hover:text-accent transition-colors" />
          </button>
          <span className="font-medium text-sm">{thread.upvotes - thread.downvotes}</span>
          <button className="rounded-full p-1 hover:bg-background transition-colors">
            <ArrowDown className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
          </button>
        </div>
        
        {/* Content */}
        <Link to={`/thread/${thread.id}`} className="flex-grow p-4">
          <div className="flex flex-col h-full">
            {/* Title and tags */}
            <div className="mb-2">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {thread.isPinned && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0 border-accent/50 text-accent">
                    Pinned
                  </Badge>
                )}
                {showCategory && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {thread.categoryId}
                  </Badge>
                )}
                {thread.tags && thread.tags.length > 0 && thread.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="font-medium text-lg group-hover:text-accent transition-colors">
                {thread.title}
              </h3>
            </div>
            
            {/* Preview text */}
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
              {thread.content}
            </p>
            
            {/* Author and metadata */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center space-x-3">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={thread.author.avatar} />
                  <AvatarFallback>{thread.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  by <span className="font-medium text-primary">{thread.author.name}</span>
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs">
                    {formatDistanceToNow(thread.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span className="text-xs">{thread.commentCount}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ThreadCard;
