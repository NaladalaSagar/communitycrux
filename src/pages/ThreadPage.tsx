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
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "@/components/auth/AuthModal";
import { categories } from "@/lib/mockData";
import { Thread, UserProfile } from "@/types";

const ThreadPage = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const [thread, setThread] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    loadThread();
    loadComments();
    
    return () => subscription.unsubscribe();
  }, [threadId]);
  
  const loadThread = async () => {
    if (!threadId) return;
    
    try {
      // First, fetch basic thread data
      const { data: threadData, error } = await supabase
        .from("threads")
        .select(`*`)
        .eq("id", threadId)
        .single();
      
      if (error) {
        console.error("Error fetching thread:", error);
        setIsLoading(false);
        return;
      }
      
      // Then fetch author profile separately
      const { data: authorData, error: authorError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", threadData.author_id)
        .single();
      
      // Get vote counts
      const { data: voteData, error: voteError } = await supabase.rpc('get_vote_count', {
        entity_id: threadId,
        entity_type: 'thread'
      });
      
      if (!voteError && voteData) {
        // Parse the JSON result properly
        const voteCountData = voteData as { upvotes: number; downvotes: number };
        setUpvotes(voteCountData.upvotes || 0);
        setDownvotes(voteCountData.downvotes || 0);
      }
      
      // Get comment count
      const { data: commentCountData, error: commentCountError } = await supabase.rpc('get_comment_count', {
        thread_id: threadId
      });
      
      // Find the category info
      const categoryInfo = categories.find(c => c.id === threadData.category_id);
      
      // Set thread with all the data
      setThread({
        ...threadData,
        author: {
          ...authorData,
          name: authorData?.username || 'Anonymous',
          role: authorData?.bio?.includes('admin') ? 'admin' : 'user', // Add role based on bio content
          avatar: authorData?.avatar_url || `https://avatar.vercel.sh/${authorData?.username || 'anonymous'}.png`
        },
        categoryName: categoryInfo?.name || threadData.category_id,
        commentCount: !commentCountError ? commentCountData : 0,
        isPinned: threadData.is_pinned,
        createdAt: new Date(threadData.created_at)
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error in loadThread:", error);
      setIsLoading(false);
    }
  };
  
  const loadComments = async () => {
    if (!threadId) return;
    
    try {
      // First, fetch basic comments data
      const { data, error } = await supabase
        .from("comments")
        .select(`*`)
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
      
      if (error) {
        console.error("Error fetching comments:", error);
        return;
      }
      
      // Process and organize comments
      const processedComments = await Promise.all(data.map(async (comment) => {
        // Fetch author data separately
        const { data: authorData, error: authorError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", comment.author_id)
          .single();
        
        // Get vote counts for each comment
        const { data: voteData, error: voteError } = await supabase.rpc('get_vote_count', {
          entity_id: comment.id,
          entity_type: 'comment'
        });
        
        let commentUpvotes = 0;
        let commentDownvotes = 0;
        
        if (!voteError && voteData) {
          const voteCountData = voteData as { upvotes: number; downvotes: number };
          commentUpvotes = voteCountData.upvotes || 0;
          commentDownvotes = voteCountData.downvotes || 0;
        }
        
        return {
          ...comment,
          id: comment.id,
          content: comment.content,
          author: {
            ...authorData,
            name: authorData?.username || 'Anonymous',
            role: authorData?.bio?.includes('admin') ? 'admin' : 'user', // Add role based on bio content
            avatar: authorData?.avatar_url || `https://avatar.vercel.sh/${authorData?.username || 'anonymous'}.png`
          },
          upvotes: commentUpvotes,
          downvotes: commentDownvotes,
          isAnswer: comment.is_answer,
          createdAt: new Date(comment.created_at),
          parentId: comment.parent_id
        };
      }));
      
      // Organize comments into a tree structure
      const commentMap = new Map();
      const rootComments: any[] = [];
      
      processedComments.forEach(comment => {
        commentMap.set(comment.id, { ...comment, children: [] });
      });
      
      processedComments.forEach(comment => {
        if (comment.parentId) {
          const parent = commentMap.get(comment.parentId);
          if (parent) {
            parent.children.push(commentMap.get(comment.id));
          } else {
            rootComments.push(commentMap.get(comment.id));
          }
        } else {
          rootComments.push(commentMap.get(comment.id));
        }
      });
      
      setComments(rootComments);
    } catch (error) {
      console.error("Error in loadComments:", error);
    }
  };
  
  const handleAddComment = async () => {
    if (!commentContent.trim()) return;
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to comment");
        setIsSubmitting(false);
        return;
      }
      
      const { data, error } = await supabase
        .from("comments")
        .insert({
          content: commentContent,
          thread_id: threadId,
          author_id: session.user.id,
          is_answer: false
        });
      
      if (error) {
        console.error("Error adding comment:", error);
        toast.error("Failed to add comment");
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Comment added successfully");
      setCommentContent("");
      loadComments(); // Reload comments
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in handleAddComment:", error);
      toast.error("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };
  
  const handleReport = () => {
    toast.success("Thread reported");
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading thread...</p>
        </div>
      </Layout>
    );
  }
  
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
            <Link to={`/category/${thread.category_id}`}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to {thread.category_id}
            </Link>
          </Button>
        </div>
        
        {/* Thread content */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden mb-8 shadow-soft animate-fade-in">
          <div className="flex">
            {/* Vote column */}
            <div className="bg-secondary/50 p-6 flex flex-col items-center justify-start gap-2 min-w-[70px]">
              <VoteButtons 
                upvotes={upvotes} 
                downvotes={downvotes}
                entityId={thread.id}
                entityType="thread"
                size="lg"
              />
            </div>
            
            {/* Content */}
            <div className="flex-grow p-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {thread.is_pinned && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0 border-accent/50 text-accent">
                    Pinned
                  </Badge>
                )}
                
                {thread.tags && thread.tags.length > 0 && thread.tags.map((tag: string, index: number) => (
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
                disabled={!commentContent.trim() || isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
          
          {/* Comments list */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} threadId={threadId} onCommentAdded={loadComments} />
            ))}
          </div>
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
    </Layout>
  );
};

export default ThreadPage;
