
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, Bell, MessageSquare, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock auth state

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 w-full",
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-soft border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl font-semibold flex items-center space-x-2 text-primary"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="hidden sm:inline-block transition-all">CommunityHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors">
            Home
          </Link>
          <Link to="/categories" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors">
            Categories
          </Link>
          <Link to="/popular" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors">
            Popular
          </Link>
          <Link to="/recent" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary transition-colors">
            Recent
          </Link>
        </nav>

        {/* Search bar and actions */}
        <div className="flex items-center space-x-2">
          <div className={cn(
            "relative transition-all duration-300 overflow-hidden",
            isSearchOpen ? "w-full md:w-64" : "w-8"
          )}>
            {isSearchOpen ? (
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 h-9 rounded-full bg-secondary/80 border-none focus-visible:ring-accent"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 rounded-full hover:bg-secondary/80 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent"></span>
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all">
                    <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="User avatar" />
                    <AvatarFallback>AM</AvatarFallback>
                  </Avatar>
                </SheetTrigger>
                <SheetContent>
                  <div className="pt-6 pb-4 flex flex-col items-center">
                    <Avatar className="h-16 w-16 mb-3">
                      <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="User avatar" />
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold">Alex Morgan</h3>
                    <p className="text-sm text-muted-foreground">alex@example.com</p>
                  </div>
                  <nav className="space-y-1 mt-4">
                    <Link to="/profile" className="flex items-center space-x-2 px-4 py-3 rounded-md hover:bg-secondary transition-colors">
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                      <span>Profile</span>
                    </Link>
                    <Link to="/settings" className="flex items-center space-x-2 px-4 py-3 rounded-md hover:bg-secondary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-muted-foreground">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </Link>
                    <button className="w-full flex items-center space-x-2 px-4 py-3 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-muted-foreground">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => setIsAuthenticated(true)} // Mock login for demo
              >
                Log In
              </Button>
              <Button 
                className="bg-accent hover:bg-accent/90"
                size="sm"
                onClick={() => setIsAuthenticated(true)} // Mock login for demo
              >
                Sign Up
              </Button>
            </div>
          )}
          
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link to="/" className="px-3 py-2 text-lg hover:bg-secondary rounded-md transition-colors">
                  Home
                </Link>
                <Link to="/categories" className="px-3 py-2 text-lg hover:bg-secondary rounded-md transition-colors">
                  Categories
                </Link>
                <Link to="/popular" className="px-3 py-2 text-lg hover:bg-secondary rounded-md transition-colors">
                  Popular
                </Link>
                <Link to="/recent" className="px-3 py-2 text-lg hover:bg-secondary rounded-md transition-colors">
                  Recent
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
