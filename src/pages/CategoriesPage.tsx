
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { categories } from '@/lib/mockData';
import CategoryCard from '@/components/home/CategoryCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Filter, Search, TrendingUp, Clock, BookOpen, Briefcase, Globe, MessageSquare, BarChart3, Lightbulb } from 'lucide-react';

const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Filter categories based on search and filter
  const filterCategories = () => {
    let filteredCategories = [...categories];
    
    // Apply search filter
    if (searchQuery) {
      filteredCategories = filteredCategories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedFilter !== 'all') {
      filteredCategories = filteredCategories.filter(category => category.id === selectedFilter);
    }
    
    return filteredCategories;
  };
  
  // Sort categories by thread count (popular)
  const getPopularCategories = () => {
    return [...filterCategories()].sort((a, b) => b.threadCount - a.threadCount);
  };
  
  // Recent categories (simulating with a random order for this example)
  const getRecentCategories = () => {
    return [...filterCategories()].sort(() => Math.random() - 0.5);
  };
  
  const filteredCategories = filterCategories();
  const popularCategories = getPopularCategories();
  const recentCategories = getRecentCategories();
  
  // Category types for the filter
  const categoryTypes = [
    { id: 'all', name: 'All Categories', icon: <Filter className="h-4 w-4" /> },
    { id: 'general', name: 'General Discussion', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'data-analysis', name: 'Data Analysis', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'professional', name: 'Professional Development', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'product-ideas', name: 'Product Ideas', icon: <Lightbulb className="h-4 w-4" /> },
    { id: 'learning', name: 'Learning Resources', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'global-insights', name: 'Global Insights', icon: <Globe className="h-4 w-4" /> },
  ];

  return (
    <Layout>
      {/* Banner with Image */}
      <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=4076&q=80" 
          alt="Categories banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Browse Categories
          </h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground">Browse through our community categories and join the discussions.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Search and filter */}
          <div className="w-full md:w-1/4">
            <div className="bg-card rounded-lg border border-border p-4 mb-4">
              <h3 className="font-medium mb-3">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-medium mb-3">Filter Categories</h3>
              <Accordion type="single" collapsible defaultValue="category-types">
                <AccordionItem value="category-types">
                  <AccordionTrigger className="py-2">Category Types</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {categoryTypes.map((type) => (
                        <div
                          key={type.id}
                          className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-muted ${
                            selectedFilter === type.id ? 'bg-muted font-medium' : ''
                          }`}
                          onClick={() => setSelectedFilter(type.id)}
                        >
                          <span className="mr-2">{type.icon}</span>
                          <span>{type.name}</span>
                          {type.id !== 'all' && (
                            <span className="ml-auto text-xs text-muted-foreground">
                              {categories.filter(c => c.id === type.id).length > 0 ? 
                                categories.filter(c => c.id === type.id)[0].threadCount : 0}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          
          {/* Categories list */}
          <div className="w-full md:w-3/4">
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" /> All
                </TabsTrigger>
                <TabsTrigger value="popular" className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" /> Popular
                </TabsTrigger>
                <TabsTrigger value="recent" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" /> Recent
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                {filteredCategories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCategories.map((category) => (
                      <CategoryCard key={category.id} category={category} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No categories found</h3>
                    <p className="text-muted-foreground">
                      Try a different search term
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="popular" className="mt-0">
                {popularCategories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {popularCategories.map((category) => (
                      <CategoryCard key={category.id} category={category} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No categories found</h3>
                    <p className="text-muted-foreground">
                      Try a different search term
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recent" className="mt-0">
                {recentCategories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentCategories.map((category) => (
                      <CategoryCard key={category.id} category={category} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No categories found</h3>
                    <p className="text-muted-foreground">
                      Try a different search term
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage;
