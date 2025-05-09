import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import VoteButtons from "../ui/VoteButtons";
import { MessageSquare, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AuthModal from "@/components/auth/AuthModal";

interface CommentProps {
  comment: any;
  threadId: string;
  isNested?: boolean;
  onCommentAdded: () => void;
}

const Comment = ({ comment, threadId, isNested = false, onCommentAdded }: CommentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check if user is authenticated
  useState(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
  });
  
  const handleReply = async () => {
    if (!replyContent.trim()) return;
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to reply");
        setIsSubmitting(false);
        return;
      }
      
      const { error } = await supabase
        .from("comments")
        .insert({
          content: replyContent,
          thread_id: threadId,
          parent_id: comment.id,
          author_id: session.user.id,
          is_answer: false
        });
      
      if (error) {
        console.error("Error adding reply:", error);
        toast.error("Failed to add reply");
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Reply added successfully");
      setReplyContent("");
      setIsReplying(false);
      onCommentAdded(); // Refresh comments
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in handleReply:", error);
      toast.error("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };
  
  return (
    <div 
      className={`relative ${isNested ? "ml-8 mt-4" : "mt-6"} ${
        comment.isAnswer ? "border-l-4 border-accent pl-4" : ""
      }`}
    >
      <div className="flex">
        {/* Vote column */}
        <div className="mr-4 flex flex-col items-center mt-1">
          <VoteButtons 
            upvotes={comment.upvotes} 
            downvotes={comment.downvotes}
            entityId={comment.id}
            entityType="comment" 
            size="sm" 
          />
        </div>
        
        {/* Comment content */}
        <div className="flex-1">
          {/* Comment header */}
          <div className="flex items-center mb-2">
            <Avatar className="h-7 w-7 mr-2">
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex flex-wrap items-center gap-x-2">
              <span className="font-medium text-sm">{comment.author.name}</span>
              
              {comment.author.role === "admin" && (
                <span className="bg-accent/10 text-accent text-xs px-1.5 py-0.5 rounded">
                  Admin
                </span>
              )}
              
              {comment.author.role === "moderator" && (
                <span className="bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded">
                  Mod
                </span>
              )}
              
              {comment.isAnswer && (
                <span className="flex items-center text-xs text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                  <Check className="h-3 w-3 mr-1" /> Best Answer
                </span>
              )}
              
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>
          
          {/* Comment body */}
          <div className="text-sm mb-3">
            <p>{comment.content}</p>
          </div>
          
          {/* Comment actions */}
          <div className="flex items-center space-x-2 mb-4">
            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              <MessageSquare className="h-3 w-3 mr-1" /> 
              Reply
            </button>
          </div>
          
          {/* Reply form */}
          {isReplying && (
            <div className="mb-4 bg-secondary/50 p-3 rounded-lg animate-scale-in">
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-24 mb-2 bg-card border-border/50 resize-none"
              />
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsReplying(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyContent.trim() || isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post Reply"}
                </Button>
              </div>
            </div>
          )}
          
          {/* Nested comments */}
          {comment.children && comment.children.length > 0 && (
            <div className="space-y-2">
              {comment.children.map((child: any) => (
                <Comment 
                  key={child.id} 
                  comment={child} 
                  threadId={threadId}
                  isNested={true} 
                  onCommentAdded={onCommentAdded}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          trigger={<></>}
          defaultTab="login" 
          onSuccess={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};

export default Comment;
