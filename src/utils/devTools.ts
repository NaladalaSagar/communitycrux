
import { supabase } from "@/integrations/supabase/client";
import { populateDatabase } from "./populateDatabase";

// Helper function to clear the console
const clearConsole = () => {
  console.clear();
};

// Helper function to print console usage instructions
const printInstructions = () => {
  console.log("%cForum Development Tools", "color: #10b981; font-size: 16px; font-weight: bold;");
  console.log("%c-----------------------", "color: #10b981;");
  console.log("");
  console.log("%cAvailable commands:", "color: #ec4899; font-weight: bold;");
  console.log("");
  console.log("%cpopulateDatabase()%c - Populate the database with mock data", "color: #06b6d4; font-weight: bold;", "color: inherit;");
  console.log("%cshowCurrentUser()%c - Show the currently logged in user", "color: #06b6d4; font-weight: bold;", "color: inherit;");
  console.log("%clogout()%c - Log out the current user", "color: #06b6d4; font-weight: bold;", "color: inherit;");
  console.log("%cclearAllData()%c - CAUTION: Clear all data from the database", "color: #06b6d4; font-weight: bold;", "color: inherit;");
  console.log("");
  console.log("%cExample usage:%c", "color: #ec4899; font-weight: bold;", "color: inherit;");
  console.log("%cawait populateDatabase()%c", "color: #06b6d4;", "color: inherit;");
};

// Helper function to show the current user
const showCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    console.log("%cCurrently logged in as:", "color: #10b981; font-weight: bold;");
    console.log(session.user);
  } else {
    console.log("%cNo user is currently logged in", "color: #ef4444; font-weight: bold;");
  }
};

// Helper function to log out
const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error);
  } else {
    console.log("%cSuccessfully logged out", "color: #10b981; font-weight: bold;");
  }
};

// Helper function to clear all data
const clearAllData = async () => {
  const confirm = window.confirm("Are you sure you want to clear all data? This cannot be undone.");
  if (!confirm) return;
  
  try {
    console.log("Clearing votes...");
    await supabase.from("votes").delete().gt("id", "0");
    
    console.log("Clearing comments...");
    await supabase.from("comments").delete().gt("id", "0");
    
    console.log("Clearing threads...");
    await supabase.from("threads").delete().gt("id", "0");
    
    console.log("%cAll data has been cleared successfully", "color: #10b981; font-weight: bold;");
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};

// Export functions for use in the browser console
if (typeof window !== 'undefined') {
  (window as any).populateDatabase = populateDatabase;
  (window as any).showCurrentUser = showCurrentUser;
  (window as any).logout = logout;
  (window as any).clearAllData = clearAllData;
  (window as any).devTools = {
    populateDatabase,
    showCurrentUser,
    logout,
    clearAllData
  };
  
  // Auto-print instructions during development
  if (process.env.NODE_ENV === 'development') {
    setTimeout(printInstructions, 1000);
  }
}

export {
  populateDatabase,
  showCurrentUser,
  logout,
  clearAllData,
  printInstructions
};
