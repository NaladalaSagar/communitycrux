
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThreadCard from "@/components/thread/ThreadCard";
import { MessageSquare, TrendingUp, Clock, Plus, Search } from "lucide-react";
import { threads } from "@/lib/mockData";

const RecentDiscussionsSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtering for the future (currently filters only unanswered)
  const filteredThreads = threads.filter((thread) =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-semibold tracking-tight animate-slide-in">Latest Discussions</h2>
          <div className="flex items-center">
            <div className="relative mr-4 flex-grow md:w-64 animate-slide-in" style={{ animationDelay: "0.1s" }}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search discussions..."
                className="pl-9 pr-4 py-2 h-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button className="bg-accent hover:bg-accent/90 animate-slide-in" style={{ animationDelay: "0.2s" }} asChild>
              <Link to="/create-thread" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" /> New Thread
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="recent" className="w-full animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="recent" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" /> Recent
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" /> Popular
              </TabsTrigger>
              <TabsTrigger value="unanswered" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" /> Unanswered
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="recent" className="space-y-4 mt-0 animate-fade-in">
            {filteredThreads.slice(0, 5).map((thread) => (
              <ThreadCard key={thread.id} thread={thread} showCategory={true} />
            ))}
            <div className="flex justify-center mt-8">
              <Button variant="outline" asChild className="animate-scale-in">
                <Link to="/recent">View more discussions</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-4 mt-0 animate-fade-in">
            {threads
              .slice()
              .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
              .slice(0, 5)
              .map((thread) => (
                <ThreadCard key={thread.id} thread={thread} showCategory={true} />
              ))}
            <div className="flex justify-center mt-8">
              <Button variant="outline" asChild className="animate-scale-in">
                <Link to="/popular">View more popular discussions</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="unanswered" className="space-y-4 mt-0 animate-fade-in">
            {threads
              .filter((thread) => thread.commentCount === 0)
              .slice(0, 5)
              .map((thread) => (
                <ThreadCard key={thread.id} thread={thread} showCategory={true} />
              ))}
            <div className="flex justify-center mt-8">
              <Button variant="outline" asChild className="animate-scale-in">
                <Link to="/unanswered">View more unanswered discussions</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default RecentDiscussionsSection;
