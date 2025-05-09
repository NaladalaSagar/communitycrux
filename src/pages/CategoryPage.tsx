
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ThreadCard from "@/components/thread/ThreadCard";
import AuthModal from "@/components/auth/AuthModal";
import { Search, Plus, Clock, TrendingUp, Database } from "lucide-react";
import { categories } from "@/lib/mockData";
import CategoryIcon from "@/components/ui/CategoryIcon";
import BackButton from "@/components/navigation/BackButton";
import { supabase } from "@/integrations/supabase/client";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState(categories.find(c => c.id === categoryId));
  const [threads, setThreads] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    if (categoryId) {
      setCategory(categories.find(c => c.id === categoryId));
      loadThreads();
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
  }, [categoryId]);
  
  const loadThreads = async () => {
    if (!categoryId) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("threads")
        .select(`
          *,
          author:author_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq("category_id", categoryId);
      
      if (error) {
        console.error("Error fetching threads:", error);
        setIsLoading(false);
        return;
      }
      
      setThreads(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error in loadThreads:", error);
      setIsLoading(false);
    }
  };
  
  // Sort threads based on selected option
  const sortThreads = (unsortedThreads: any[]) => {
    if (sortBy === 'recent') {
      return [...unsortedThreads].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === 'popular') {
      // We need to add vote counts to perform this sort correctly
      return unsortedThreads;
    } else {
      return unsortedThreads;
    }
  };
  
  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <BackButton fallbackPath="/categories" label="Back to Categories" />
        </div>
      </Layout>
    );
  }
  
  // Filter and sort threads
  const filteredThreads = sortThreads(threads)
    .filter(thread => {
      if (!searchQuery) return true;
      return (
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  
  return (
    <Layout>
      {/* Banner with Image */}
      <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3882&q=80" 
          alt="Forum banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Community Forum
          </h1>
        </div>
      </div>
      
      {/* Header */}
      <div className="bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-2">
            <BackButton fallbackPath="/categories" label="Categories" className="mr-2" />
          </div>
          <div className="flex items-center mb-2">
            <div className={`inline-flex items-center justify-center rounded-lg p-2 mr-4 ${category.color}`}>
              <CategoryIcon iconName={category.icon} />
            </div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
          </div>
          <p className="text-muted-foreground mb-6 ml-16">{category.description}</p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filteredThreads.length}</span> threads in this category
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <Button className="bg-accent hover:bg-accent/90" asChild>
                  <Link to={`/create-thread?category=${category.id}`} className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" /> New Thread
                  </Link>
                </Button>
              ) : (
                <AuthModal 
                  trigger={<Button className="bg-accent hover:bg-accent/90">Sign In to Post</Button>}
                  defaultTab="login"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Threads list */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search in this category..."
              className="pl-9 pr-4 py-2 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" /> Most Recent
                  </SelectItem>
                  <SelectItem value="popular" className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" /> Most Popular
                  </SelectItem>
                  <SelectItem value="comments" className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                    Most Comments
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading threads...</p>
          </div>
        ) : filteredThreads.length > 0 ? (
          <div className="space-y-4 animate-fade-in">
            {filteredThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No threads found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? "Try a different search query or" : "Be the first to"} start a discussion in this category
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4">
              {!searchQuery && (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 mb-4"
                  onClick={() => (window as any).populateDatabase()}
                >
                  <Database className="h-4 w-4" /> Populate Database with Mock Data
                </Button>
              )}
              
              {isAuthenticated ? (
                <Button asChild>
                  <Link to={`/create-thread?category=${category.id}`} className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" /> Create New Thread
                  </Link>
                </Button>
              ) : (
                <AuthModal 
                  trigger={<Button>Sign In to Create Thread</Button>}
                  defaultTab="login"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
