
import { supabase } from "@/integrations/supabase/client";
import { threads as mockThreads, users as mockUsers } from "@/lib/mockData";

/**
 * This utility function populates the database with mock data for testing.
 * It's meant to be called from the browser console with:
 * 
 * import { populateDatabase } from "@/utils/populateDatabase";
 * await populateDatabase();
 */
export const populateDatabase = async () => {
  console.log("Starting database population...");
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.error("You must be logged in to populate the database");
    return;
  }
  
  try {
    // Check if there are already threads in the database
    const { data: existingThreads, error: threadsError } = await supabase
      .from("threads")
      .select("id")
      .limit(1);
      
    if (threadsError) {
      console.error("Error checking if threads exist:", threadsError);
      return;
    }
    
    if (existingThreads && existingThreads.length > 0) {
      console.log("Database already contains threads. No need to populate.");
      return;
    }
    
    // Create profiles for mock users
    console.log("Creating profiles for mock users...");
    for (const user of mockUsers) {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username: user.username || user.name,
          avatar_url: user.avatar || `https://avatar.vercel.sh/${user.name}.png`,
          bio: user.role === "admin" ? "Admin user" : user.role === "moderator" ? "Moderator" : "Regular user"
        });
        
      if (error) {
        console.error(`Error creating profile for ${user.name}:`, error);
      }
    }
    
    // Create threads
    console.log("Creating threads...");
    for (const thread of mockThreads) {
      const { error } = await supabase
        .from("threads")
        .insert({
          id: thread.id,
          title: thread.title,
          content: thread.content,
          author_id: thread.author.id,
          category_id: thread.categoryId,
          is_pinned: thread.isPinned || false,
          tags: thread.tags || []
        });
        
      if (error) {
        console.error(`Error creating thread "${thread.title}":`, error);
      }
    }
    
    // Add some upvotes to threads
    console.log("Adding votes to threads...");
    for (const thread of mockThreads) {
      // Random number of upvotes between 0 and 10
      const upvotes = Math.floor(Math.random() * 10);
      
      for (let i = 0; i < upvotes; i++) {
        // Use a random user ID from the mock users
        const randomUserIndex = Math.floor(Math.random() * mockUsers.length);
        const userId = mockUsers[randomUserIndex].id;
        
        const { error } = await supabase
          .from("votes")
          .insert({
            entity_id: thread.id,
            entity_type: 'thread',
            user_id: userId, 
            vote_type: 'up'
          });
          
        if (error) {
          console.error(`Error adding upvote to thread "${thread.title}":`, error);
        }
      }
      
      // Random number of downvotes between 0 and 3
      const downvotes = Math.floor(Math.random() * 3);
      
      for (let i = 0; i < downvotes; i++) {
        // Use a random user ID from the mock users
        const randomUserIndex = Math.floor(Math.random() * mockUsers.length);
        const userId = mockUsers[randomUserIndex].id;
        
        const { error } = await supabase
          .from("votes")
          .insert({
            entity_id: thread.id,
            entity_type: 'thread',
            user_id: userId,
            vote_type: 'down'
          });
          
        if (error) {
          console.error(`Error adding downvote to thread "${thread.title}":`, error);
        }
      }
    }
    
    // Add some comments to some threads
    console.log("Adding comments to threads...");
    const commentContents = [
      "Great post! I found this really helpful.",
      "I disagree with some points here. Let me explain why...",
      "Has anyone else experienced similar issues?",
      "Thanks for sharing this information.",
      "I have a follow-up question about this.",
      "This is exactly what I was looking for!",
      "Can you provide more details about this?",
      "I've been working on something similar and found that...",
      "Interesting perspective. I hadn't thought about it that way.",
      "This solved my problem. Thank you!"
    ];
    
    for (const thread of mockThreads.slice(0, Math.floor(mockThreads.length * 0.7))) {
      // Random number of comments between 0 and 5
      const commentCount = Math.floor(Math.random() * 5);
      
      for (let i = 0; i < commentCount; i++) {
        // Use a random user ID from the mock users
        const randomUserIndex = Math.floor(Math.random() * mockUsers.length);
        const userId = mockUsers[randomUserIndex].id;
        
        // Use a random comment content
        const randomContentIndex = Math.floor(Math.random() * commentContents.length);
        const content = commentContents[randomContentIndex];
        
        const { error, data: comment } = await supabase
          .from("comments")
          .insert({
            thread_id: thread.id,
            author_id: userId,
            content: content,
            is_answer: false
          })
          .select();
          
        if (error) {
          console.error(`Error adding comment to thread "${thread.title}":`, error);
        }
        
        // Add some upvotes to comments
        if (comment) {
          const upvotes = Math.floor(Math.random() * 5);
          
          for (let j = 0; j < upvotes; j++) {
            // Use a random user ID from the mock users
            const randomUserIndex = Math.floor(Math.random() * mockUsers.length);
            const userId = mockUsers[randomUserIndex].id;
            
            const { error } = await supabase
              .from("votes")
              .insert({
                entity_id: comment[0].id,
                entity_type: 'comment',
                user_id: userId,
                vote_type: 'up'
              });
              
            if (error && error.code !== "23505") { // Ignore unique constraint violations
              console.error(`Error adding upvote to comment:`, error);
            }
          }
        }
      }
    }
    
    console.log("Database population complete!");
    return { success: true, message: "Database populated successfully!" };
  } catch (error) {
    console.error("Error populating database:", error);
    return { success: false, error };
  }
};

// Add a global function to run from the console
if (typeof window !== 'undefined') {
  (window as any).populateDatabase = populateDatabase;
}
