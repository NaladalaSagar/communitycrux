
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Index from "./pages/Index";
import ThreadPage from "./pages/ThreadPage";
import CategoryPage from "./pages/CategoryPage";
import CategoriesPage from "./pages/CategoriesPage";
import CreateThread from "./pages/CreateThread";
import NotFound from "./pages/NotFound";
import PopularThreadsPage from "./pages/PopularThreadsPage";
import RecentThreadsPage from "./pages/RecentThreadsPage";
import FeaturedThreadsPage from "./pages/FeaturedThreadsPage";
import ProfilePage from "./pages/ProfilePage";
import UserThreadsPage from "./pages/UserThreadsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NotificationProvider>
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
            <Route path="/featured" element={<FeaturedThreadsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-threads" element={<UserThreadsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
