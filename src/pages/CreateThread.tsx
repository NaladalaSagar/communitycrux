
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/lib/mockData";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "@/components/auth/AuthModal";

const CreateThread = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categoryFromUrl || "");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  useEffect(() => {
    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    }
    
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, [categoryFromUrl]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    if (!title.trim() || !content.trim() || !category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to create a thread");
        setIsSubmitting(false);
        return;
      }
      
      // Convert comma-separated tags to array
      const tagsArray = tags
        ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '').slice(0, 5)
        : [];
      
      // Insert thread into Supabase
      const { data, error } = await supabase
        .from('threads')
        .insert({
          title,
          content,
          author_id: session.user.id,
          category_id: category,
          tags: tagsArray,
          is_pinned: false
        })
        .select('id')
        .single();
      
      if (error) {
        console.error("Error creating thread:", error);
        toast.error("Failed to create thread");
        setIsSubmitting(false);
        return;
      }
      
      setIsSubmitting(false);
      toast.success("Thread created successfully");
      
      // Navigate to the new thread page
      navigate(`/thread/${data.id}`);
    } catch (error) {
      console.error("Error creating thread:", error);
      toast.error("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="p-0 h-6">
            <Link to={category ? `/category/${category}` : "/"}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Link>
          </Button>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Create New Thread</h1>
          
          <div className="bg-card rounded-xl border border-border/50 p-6 shadow-soft animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title"
                  className="bg-background border-border/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="bg-background border-border/50">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="text-base">
                  Content <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thread content here..."
                  className="min-h-[200px] bg-background border-border/50 resize-none"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-base">
                  Tags <span className="text-xs text-muted-foreground">(optional, comma separated)</span>
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. question, help, discussion"
                  className="bg-background border-border/50"
                />
                <p className="text-xs text-muted-foreground">
                  Add up to 5 tags to categorize your thread
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !title || !content || !category}>
                  {isSubmitting ? "Creating..." : "Create Thread"}
                </Button>
              </div>
            </form>
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

export default CreateThread;
