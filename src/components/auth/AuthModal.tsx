
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AuthModalProps {
  trigger: React.ReactNode;
  defaultTab?: "login" | "register";
  onSuccess?: () => void;
}

const AuthModal = ({ trigger, defaultTab = "login", onSuccess }: AuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // NOTE: track session state
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Set up Supabase auth event listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session) {
          // Get user and store in localStorage
          syncUserProfileToLocalStorage(session.user.id);
          if (onSuccess) onSuccess();
          setOpen(false);
        }
      }
    );
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        syncUserProfileToLocalStorage(session.user.id);
        if (onSuccess) onSuccess();
        setOpen(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const syncUserProfileToLocalStorage = async (userId: string) => {
    // Fetch profile from Supabase
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      console.warn("Failed to fetch profile:", error.message);
      localStorage.removeItem("user");
      localStorage.setItem("isAuthenticated", "false");
      return;
    }
    if (data) {
      localStorage.setItem("user", JSON.stringify({
        name: data.username || "Unknown user",
        email: session?.user?.email || "",
        avatar: data.avatar_url || `https://i.pravatar.cc/150?u=${userId}`
      }));
      localStorage.setItem("isAuthenticated", "true");
    }
  };

  // Email/Password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setIsLoading(false);
      toast.error(error.message || "Login failed");
      return;
    }
    setIsLoading(false);
    toast.success("Logged in successfully");
    if (data.session?.user.id) {
      await syncUserProfileToLocalStorage(data.session?.user.id);
      if (onSuccess) onSuccess();
      setOpen(false);
    }
  };

  const handleTriggerClick = () => {
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => handleTriggerClick()}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-lg p-0 overflow-hidden">
        <DialogHeader className="pt-6 px-6 pb-2">
          <DialogTitle className="text-2xl font-semibold text-center">
            Welcome
          </DialogTitle>
        </DialogHeader>
        <TabsContent value="login" className="px-6 pb-6 mt-0">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="your.email@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <button
                  type="button"
                  className="text-xs text-accent hover:underline"
                  onClick={() => toast.info("Please contact admin for password reset.")}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </TabsContent>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
