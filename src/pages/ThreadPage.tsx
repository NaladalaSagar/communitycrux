
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Comment from "@/components/thread/Comment";
import VoteButtons from "@/components/ui/VoteButtons";
import { ArrowLeft, MessageSquare, Flag, Share, Calendar } from "lucide-react";
import { getCommentsByThreadId, getThreadById } from "@/lib/mockData";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const ThreadPage = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const [thread, setThread] = useState(getThreadById(threadId));
  const [comments, setComments] = useState(getCommentsByThreadId(threadId || ""));
  const [commentContent, setCommentContent] = useState("");
  
  const handleAddComment = () => {
    if (!commentContent.trim()) return;
    
    // Mock adding a comment
    toast.success("Comment added successfully");
    setCommentContent("");
  };
  
  const handleShare = () => {
    // Mock share functionality
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };
  
  const handleReport = () => {
    // Mock report functionality
    toast.success("Thread reported");
  };
  
  if (!thread) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Thread not found</h1>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="p-0 h-6">
            <Link to={`/category/${thread.categoryId}`}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to {thread.categoryId}
            </Link>
          </Button>
        </div>
        
        {/* Thread content */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden mb-8 shadow-soft animate-fade-in">
          <div className="flex">
            {/* Vote column */}
            <div className="bg-secondary/50 p-6 flex flex-col items-center justify-start gap-2 min-w-[70px]">
              <VoteButtons 
                upvotes={thread.upvotes} 
                downvotes={thread.downvotes}
                size="lg"
              />
            </div>
            
            {/* Content */}
            <div className="flex-grow p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {thread.isPinned && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0 border-accent/50 text-accent">
                    Pinned
                  </Badge>
                )}
                
                {thread.tags && thread.tags.length > 0 && thread.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-2xl font-bold mb-6">{thread.title}</h1>
              
              <div className="prose max-w-none mb-6">
                <p>{thread.content}</p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={thread.author.avatar} />
                    <AvatarFallback>{thread.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {thread.author.name}
                      {thread.author.role === "admin" && (
                        <span className="ml-2 bg-accent/10 text-accent text-xs px-1.5 py-0.5 rounded">
                          Admin
                        </span>
                      )}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {formatDistanceToNow(thread.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-accent"
                    onClick={handleShare}
                  >
                    <Share className="h-4 w-4 mr-1" /> Share
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-destructive"
                    onClick={handleReport}
                  >
                    <Flag className="h-4 w-4 mr-1" /> Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Comments */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <MessageSquare className="h-5 w-5 mr-2" />
            <h2 className="text-xl font-semibold">
              {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
            </h2>
          </div>
          
          {/* Comment form */}
          <div className="bg-card rounded-xl border border-border/50 p-6 mb-8 animate-slide-in">
            <h3 className="font-medium mb-3">Add a comment</h3>
            <Textarea
              placeholder="Write your comment here..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="min-h-32 mb-4 bg-background border-border/50 resize-none"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleAddComment}
                disabled={!commentContent.trim()}
              >
                Post Comment
              </Button>
            </div>
          </div>
          
          {/* Comments list */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThreadPage;
