
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { FileEdit, Trash2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { getRecentThreads } from "@/lib/mockData";

const UserThreadsPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userThreads, setUserThreads] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    // Check if user is authenticated
    const authState = localStorage.getItem("isAuthenticated");
    if (authState !== "true") {
      navigate("/");
      toast.error("Please log in to view your threads");
      return;
    }
    setIsAuthenticated(true);
    
    // In a real app, we would fetch user's threads from the backend
    // For this demo, we'll use the first 3 threads from the mock data
    const allThreads = getRecentThreads();
    const mockUserThreads = allThreads.slice(0, 3).map(thread => ({
      ...thread,
      isUserThread: true
    }));
    
    setUserThreads(mockUserThreads);
  }, [navigate]);
  
  const handleDeleteThread = (threadId: string) => {
    setUserThreads(userThreads.filter(thread => thread.id !== threadId));
    toast.success("Thread deleted successfully");
  };
  
  const filteredThreads = userThreads.filter(thread => 
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (!isAuthenticated) {
    return null; // We'll redirect in the useEffect
  }
  
  return (
    <Layout>
      <div className="container px-4 py-8 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 animate-slide-in" style={{ animationDelay: "0.1s" }}>
                My Threads
              </h1>
              <p className="text-muted-foreground animate-slide-in" style={{ animationDelay: "0.2s" }}>
                Manage all threads that you've created
              </p>
            </div>
            <Button 
              onClick={() => navigate("/create-thread")}
              className="animate-slide-in"
              style={{ animationDelay: "0.3s" }}
            >
              Create New Thread
            </Button>
          </div>
          
          <div className="mb-6 animate-slide-in" style={{ animationDelay: "0.2s" }}>
            <Input
              type="text"
              placeholder="Search your threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {filteredThreads.length > 0 ? (
            <div className="space-y-4">
              {filteredThreads.map((thread, index) => (
                <Card 
                  key={thread.id} 
                  className="overflow-hidden animate-slide-in hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="mb-1">
                          <Link to={`/thread/${thread.id}`} className="hover:text-primary transition-colors">
                            {thread.title}
                          </Link>
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="bg-secondary/50">
                            {thread.category}
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {thread.commentCount} comments
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => navigate(`/edit-thread/${thread.id}`)}
                        >
                          <FileEdit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteThread(thread.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="line-clamp-2 text-muted-foreground">
                      {thread.content}
                    </p>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground border-t pt-3">
                    Posted on {new Date(thread.createdAt).toLocaleDateString()}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border rounded-lg animate-fade-in">
              <h3 className="text-xl font-medium mb-2">No threads found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? 
                  "No threads match your search criteria." : 
                  "You haven't created any threads yet."}
              </p>
              <Button onClick={() => navigate("/create-thread")}>
                Create Your First Thread
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserThreadsPage;
