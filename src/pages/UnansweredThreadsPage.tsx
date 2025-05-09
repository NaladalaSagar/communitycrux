
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import ThreadCard from "@/components/thread/ThreadCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Thread } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const UnansweredThreadsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const threadsPerPage = 10;
  
  useEffect(() => {
    const fetchThreads = async () => {
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
          `);
          
        if (error) {
          console.error("Error fetching threads:", error);
          setIsLoading(false);
          return;
        }
        
        // We'll filter to get threads with no comments
        const unansweredThreads = await Promise.all(data.map(async (thread) => {
          const { data: commentCount, error: commentError } = await supabase.rpc('get_comment_count', {
            thread_id: thread.id
          });
          
          return { 
            ...thread, 
            commentCount: commentError ? 0 : commentCount 
          };
        }));
        
        // Filter to threads with no comments
        const noCommentThreads = unansweredThreads.filter(thread => thread.commentCount === 0);
        
        setThreads(noCommentThreads);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in fetchThreads:", error);
        setIsLoading(false);
      }
    };
    
    fetchThreads();
  }, []);
  
  // Filter threads based on search query
  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Paginate the results
  const indexOfLastThread = currentPage * threadsPerPage;
  const indexOfFirstThread = indexOfLastThread - threadsPerPage;
  const currentThreads = filteredThreads.slice(indexOfFirstThread, indexOfLastThread);
  const totalPages = Math.ceil(filteredThreads.length / threadsPerPage);

  return (
    <Layout>
      {/* Banner */}
      <section className="relative py-16 overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-background/5 -z-10"></div>
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Unanswered Discussions
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            These discussions haven't received any responses yet. Be the first to join the conversation and share your insights.
          </p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-8">
        <div className="container px-4 mx-auto">
          {/* Search box */}
          <div className="mb-8 max-w-md animate-slide-in" style={{ animationDelay: "0.1s" }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search unanswered discussions..."
                className="pl-9 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Thread list */}
          <div className="space-y-4 animate-slide-in" style={{ animationDelay: "0.2s" }}>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading discussions...</p>
              </div>
            ) : currentThreads.length > 0 ? (
              currentThreads.map((thread, index) => (
                <div key={thread.id} className="animate-slide-in" style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}>
                  <ThreadCard 
                    thread={thread}
                    showCategory={true} 
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No unanswered discussions found matching your search.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredThreads.length > threadsPerPage && (
            <div className="mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    // Show current page, and 2 pages before and after
                    if (
                      i + 1 === 1 || 
                      i + 1 === totalPages || 
                      (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            isActive={currentPage === i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      (i + 1 === currentPage - 2 && currentPage > 3) || 
                      (i + 1 === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return <PaginationItem key={i}><PaginationEllipsis /></PaginationItem>;
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default UnansweredThreadsPage;
