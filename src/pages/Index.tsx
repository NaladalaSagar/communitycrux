import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryCard from "@/components/home/CategoryCard";
import FeaturedThread from "@/components/home/FeaturedThread";
import ThreadCard from "@/components/thread/ThreadCard";
import AuthModal from "@/components/auth/AuthModal";
import { MessageSquare, TrendingUp, Clock, Plus, Search } from "lucide-react";
import { categories, getFeaturedThreads, threads } from "@/lib/mockData";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const featuredThreads = getFeaturedThreads();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent -z-10"></div>
        <div className="container px-4 mx-auto text-center relative">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
              Welcome to <span className="text-accent">CommunityHub</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Join our thriving community to share knowledge, ask questions, and connect with like-minded individuals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <AuthModal 
                trigger={<Button size="lg" className="bg-accent hover:bg-accent/90 flex">Join the community</Button>}
                defaultTab="register"
              />
              <Button variant="outline" size="lg" asChild>
                <Link to="/categories">Browse topics</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Thread Section */}
      {featuredThreads.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold tracking-tight">Featured Discussions</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/featured" className="text-muted-foreground hover:text-accent">
                  View all
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredThreads.map((thread) => (
                <div key={thread.id} className="animate-slide-in" style={{ animationDelay: `${featuredThreads.indexOf(thread) * 0.1}s` }}>
                  <FeaturedThread thread={thread} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Popular Categories</h2>
          <Link to="/categories" className="text-accent hover:underline flex items-center">
            View All Categories 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((category, index) => (
            <div key={category.id} className="animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Discussions Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">Latest Discussions</h2>
            
            <div className="flex items-center">
              <div className="relative mr-4 flex-grow md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search discussions..."
                  className="pl-9 pr-4 py-2 h-9 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button className="bg-accent hover:bg-accent/90" asChild>
                <Link to="/create-thread" className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" /> New Thread
                </Link>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="recent" className="w-full">
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
              {threads.slice(0, 5).map((thread) => (
                <ThreadCard key={thread.id} thread={thread} showCategory={true} />
              ))}
              <div className="flex justify-center mt-8">
                <Button variant="outline" asChild>
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
                <Button variant="outline" asChild>
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
                <Button variant="outline" asChild>
                  <Link to="/unanswered">View more unanswered discussions</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="glass-effect rounded-2xl overflow-hidden">
            <div className="p-8 md:p-12 flex flex-col items-center text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to join the conversation?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl">
                Create an account today to start posting, commenting, and connecting with other members of our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <AuthModal 
                  trigger={
                    <Button size="lg" className="bg-accent hover:bg-accent/90">
                      Sign up now
                    </Button>
                  }
                  defaultTab="register"
                />
                <Button variant="outline" size="lg" asChild>
                  <Link to="/categories">
                    Explore first
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
