
import { supabase } from "@/integrations/supabase/client";
import { threads as mockThreads, users as mockUsers, categories } from "@/lib/mockData";
import { toast } from "sonner";

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
    toast.error("You must be logged in to populate the database");
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
      toast.error("Error checking if threads exist");
      return;
    }
    
    console.log(`Found ${existingThreads?.length || 0} existing threads`);
    
    // Create profiles for mock users
    console.log("Creating profiles for mock users...");
    for (const user of mockUsers) {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username: user.username || user.name,
          avatar_url: user.avatar, // Using the avatar property from mock data
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
          author_id: thread.author.id, // Using the correct author.id property
          category_id: thread.categoryId, // Using the categoryId from mock data
          is_pinned: thread.isPinned || false, // Using isPinned from mock data
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
          
        if (error && error.code !== "23505") { // Ignore unique constraint violations
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
          
        if (error && error.code !== "23505") { // Ignore unique constraint violations
          console.error(`Error adding downvote to thread "${thread.title}":`, error);
        }
      }
    }
    
    // Add some comments to all threads
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
    
    // Add comments to every thread instead of just 70%
    for (const thread of mockThreads) {
      // Random number of comments between 2 and 6 (ensure we have some comments on each thread)
      const commentCount = Math.floor(Math.random() * 4) + 2;
      
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
        if (comment && comment.length > 0) {
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
          
          // Add some reply comments (nested comments)
          if (Math.random() > 0.5) {
            const replyUserIndex = Math.floor(Math.random() * mockUsers.length);
            const replyUserId = mockUsers[replyUserIndex].id;
            const replyContentIndex = Math.floor(Math.random() * commentContents.length);
            const replyContent = `In reply to that: ${commentContents[replyContentIndex]}`;
            
            const { error: replyError } = await supabase
              .from("comments")
              .insert({
                thread_id: thread.id,
                author_id: replyUserId,
                content: replyContent,
                is_answer: false,
                parent_id: comment[0].id
              });
              
            if (replyError) {
              console.error(`Error adding reply comment:`, replyError);
            }
          }
        }
      }
    }
    
    console.log("Database population complete!");
    toast.success("Database populated successfully!");
    return { success: true, message: "Database populated successfully!" };
  } catch (error) {
    console.error("Error populating database:", error);
    toast.error("Error populating database. See console for details.");
    return { success: false, error };
  }
};

// Add a global function to run from the console
if (typeof window !== 'undefined') {
  (window as any).populateDatabase = populateDatabase;
}
