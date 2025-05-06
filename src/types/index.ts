
import { Database } from "@/integrations/supabase/types";

// Profile types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Custom types for our application
export interface UserProfile extends Profile {
  gender?: 'male' | 'female' | 'other' | null;
  name?: string;
  email?: string;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  tags?: string[];
  upvotes: number;
  downvotes: number;
  comment_count: number;
  author?: UserProfile;
}

export interface Comment {
  id: string;
  content: string;
  thread_id: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  parent_id?: string | null;
  is_answer: boolean;
  upvotes: number;
  downvotes: number;
  author?: UserProfile;
  children?: Comment[];
}

export interface Vote {
  id: string;
  user_id: string;
  entity_id: string;
  entity_type: 'thread' | 'comment';
  vote_type: 'up' | 'down';
  created_at: string;
}

// Gender detection types
export type GenderPrediction = {
  gender: 'male' | 'female' | 'other';
  probability: number;
};
