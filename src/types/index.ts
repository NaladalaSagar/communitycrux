
// Profile types
export interface Profile {
  id: string;
  username?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  created_at: string;
  // Custom fields for our app
  gender?: 'male' | 'female' | 'other' | null;
  name?: string;
  email?: string;
  role?: string;
}

// Thread types - supporting both camelCase and snake_case
export interface Thread {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  tags?: string[] | null;
  
  // Computed properties
  upvotes?: number;
  downvotes?: number;
  commentCount?: number;
  author?: Profile;
  
  // Aliases for convenience (from mockData.ts)
  authorId?: string;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
  isPinned?: boolean;
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  thread_id: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  parent_id?: string | null;
  is_answer: boolean;
  
  // Computed properties
  upvotes?: number;
  downvotes?: number;
  author?: Profile;
  children?: Comment[];
}

// Vote types
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

// Export UserProfile as an alias for Profile for backwards compatibility
export type UserProfile = Profile;
