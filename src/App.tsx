
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ThreadPage from "./pages/ThreadPage";
import CategoryPage from "./pages/CategoryPage";
import CategoriesPage from "./pages/CategoriesPage";
import CreateThread from "./pages/CreateThread";
import NotFound from "./pages/NotFound";
import PopularThreadsPage from "./pages/PopularThreadsPage";
import RecentThreadsPage from "./pages/RecentThreadsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/thread/:threadId" element={<ThreadPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/create-thread" element={<CreateThread />} />
          <Route path="/popular" element={<PopularThreadsPage />} />
          <Route path="/recent" element={<RecentThreadsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
