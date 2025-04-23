import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate?: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    email: "",
    avatar: "",
    bio: "",
    location: "",
    website: ""
  });

  useEffect(() => {
    async function fetchUserData() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user) {
        navigate("/");
        toast.error("Please log in to view your profile");
        return;
      }
      const user = sessionData.session.user;
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (userProfile) {
        setProfile({
          name: userProfile.username || "Unknown User",
          email: user.email,
          avatar: userProfile.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`,
          bio: userProfile.bio || "Tell us about yourself...",
          location: userProfile.location || "Your location",
          website: userProfile.website || "",
          joinDate: userProfile.created_at
            ? new Date(userProfile.created_at).toLocaleDateString()
            : new Date().toLocaleDateString(),
        });
        setFormData({
          name: userProfile.username || "",
          email: user.email,
          avatar: userProfile.avatar_url || "",
          bio: userProfile.bio || "",
          location: userProfile.location || "",
          website: userProfile.website || "",
          joinDate: userProfile.created_at
            ? new Date(userProfile.created_at).toLocaleDateString()
            : new Date().toLocaleDateString(),
        });
      }
    }
    fetchUserData();
  }, [navigate]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.user) {
      toast.error("Not authenticated");
      return;
    }
    const userId = sessionData.session.user.id;
    const { error } = await supabase
      .from("profiles")
      .update({
        username: formData.name,
        avatar_url: formData.avatar,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
      })
      .eq("id", userId);
    if (error) {
      toast.error("Failed to update profile");
      return;
    }
    toast.success("Profile updated successfully");
    setProfile({ ...formData, joinDate: profile?.joinDate || "" });
    setIsEditing(false);
    localStorage.setItem("user", JSON.stringify({
      name: formData.name,
      email: formData.email,
      avatar: formData.avatar
    }));
  };

  if (!profile) {
    return (
      <Layout>
        <div className="container px-4 py-8 flex justify-center">
          <div className="w-full max-w-4xl">
            <div className="h-64 animate-pulse bg-secondary rounded-lg"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-8 animate-fade-in">
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="relative">
            <div className="h-64 w-full bg-gradient-to-r from-primary/30 to-accent/30 rounded-t-xl"></div>
            
            <div className="absolute -bottom-16 left-8">
              <Avatar className="h-32 w-32 border-4 border-background animate-scale-in">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-3xl">
                  {profile.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="absolute -bottom-16 right-8">
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="shadow-sm"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>
          
          <div className="mt-20 px-8">
            <h1 className="text-3xl font-bold animate-slide-in" style={{ animationDelay: "0.1s" }}>
              {profile.name}
            </h1>
            <p className="text-muted-foreground mt-1 animate-slide-in" style={{ animationDelay: "0.2s" }}>
              {profile.email}
            </p>
            <div className="mt-4 animate-slide-in" style={{ animationDelay: "0.3s" }}>
              <p className="text-sm text-muted-foreground">
                Joined {profile.joinDate}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none px-8 pb-0">
              <TabsTrigger value="about" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">About</TabsTrigger>
              <TabsTrigger value="activity" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Activity</TabsTrigger>
              <TabsTrigger value="threads" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Threads</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="px-8 py-6 animate-fade-in">
              {isEditing ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Make changes to your profile here</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input 
                        id="bio" 
                        name="bio" 
                        value={formData.bio}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        name="location" 
                        value={formData.location}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input 
                        id="website" 
                        name="website" 
                        value={formData.website}
                        onChange={handleFormChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveProfile}>Save changes</Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="space-y-6">
                  <div className="animate-slide-in" style={{ animationDelay: "0.1s" }}>
                    <h3 className="text-lg font-medium">Bio</h3>
                    <p className="mt-2 text-muted-foreground">{profile.bio}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:space-x-12 space-y-4 sm:space-y-0 animate-slide-in" style={{ animationDelay: "0.2s" }}>
                    <div>
                      <h3 className="text-lg font-medium">Location</h3>
                      <p className="mt-2 text-muted-foreground">{profile.location}</p>
                    </div>
                    {profile.website && (
                      <div>
                        <h3 className="text-lg font-medium">Website</h3>
                        <a 
                          href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-2 text-primary hover:underline inline-block"
                        >
                          {profile.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="px-8 py-6 animate-fade-in">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Your recent activity will appear here.</p>
              </div>
            </TabsContent>

            <TabsContent value="threads" className="px-8 py-6 animate-fade-in">
              <div className="text-center py-12">
                <p className="text-muted-foreground">You haven't created any threads yet.</p>
                <Button 
                  onClick={() => navigate("/create-thread")} 
                  className="mt-4"
                >
                  Create Your First Thread
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
