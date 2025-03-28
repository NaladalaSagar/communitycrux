import { MessageSquare, BarChart3, Briefcase, Lightbulb, BookOpen, Globe } from "lucide-react";
import { ReactNode } from "react";

// Type definitions
export interface Category {
  id: string;
  name: string;
  description: string;
  threadCount: number;
  icon: string;
  color: string;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  categoryId: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  tags: string[];
  views: number;
  isFeatured?: boolean;
  isPinned?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  threadId: string;
  upvotes: number;
  downvotes: number;
  parentId?: string;
  isAcceptedAnswer?: boolean;
  isAnswer?: boolean;
  children?: Comment[];
}

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  joinedAt: string;
  reputation: number;
  role?: "admin" | "moderator" | "user";
}

// Sample Data
export const categories: Category[] = [
  {
    id: "general",
    name: "General Discussion",
    description: "Community discussions and announcements",
    threadCount: 127,
    icon: "MessageSquare",
    color: "bg-blue-100 text-blue-500"
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    description: "Questions about data processing and visualization",
    threadCount: 89,
    icon: "BarChart3",
    color: "bg-purple-100 text-purple-500"
  },
  {
    id: "professional",
    name: "Professional Development",
    description: "Career advice and industry insights",
    threadCount: 65,
    icon: "Briefcase",
    color: "bg-amber-100 text-amber-600"
  },
  {
    id: "product-ideas",
    name: "Product Ideas",
    description: "Share your innovative product concepts",
    threadCount: 43,
    icon: "Lightbulb",
    color: "bg-yellow-100 text-yellow-600"
  },
  {
    id: "learning",
    name: "Learning Resources",
    description: "Tutorials, guides, and educational content",
    threadCount: 72,
    icon: "BookOpen",
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    id: "global-insights",
    name: "Global Insights",
    description: "Industry news and worldwide developments",
    threadCount: 58,
    icon: "Globe",
    color: "bg-indigo-100 text-indigo-500"
  }
];

// Sample users
export const users: User[] = [
  {
    id: "user1",
    username: "alex_johnson",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    joinedAt: "2023-01-15T14:30:00Z",
    reputation: 2458,
    role: "admin"
  },
  {
    id: "user2",
    username: "samantha_dev",
    name: "Samantha Dev",
    avatar: "https://i.pravatar.cc/150?img=2",
    joinedAt: "2022-11-23T09:45:00Z",
    reputation: 3721,
    role: "moderator"
  },
  {
    id: "user3",
    username: "tech_guru",
    name: "Tech Guru",
    avatar: "https://i.pravatar.cc/150?img=3",
    joinedAt: "2023-03-10T16:20:00Z",
    reputation: 1845,
    role: "user"
  },
  {
    id: "user4",
    username: "code_master",
    name: "Code Master",
    avatar: "https://i.pravatar.cc/150?img=4",
    joinedAt: "2022-08-05T11:15:00Z",
    reputation: 4562,
    role: "user"
  }
];

// Sample threads
export const threads: Thread[] = [
  {
    id: "thread1",
    title: "Introducing our new community forum!",
    content: "Welcome to our brand new community forum! We're excited to create a space where members can share ideas, ask questions, and connect with like-minded individuals. Feel free to explore the different categories and join the conversation!",
    author: users[0],
    createdAt: "2023-06-10T15:30:00Z",
    categoryId: "general",
    upvotes: 156,
    downvotes: 3,
    commentCount: 28,
    tags: ["announcement", "welcome", "community"],
    views: 2453,
    isFeatured: true,
    isPinned: true
  },
  {
    id: "thread2",
    title: "Best practices for data visualization in 2023",
    content: "I've been working on several data visualization projects recently, and I've compiled some best practices that have worked well for me. Would love to hear your thoughts and any additional tips you might have!",
    author: users[1],
    createdAt: "2023-06-08T09:45:00Z",
    categoryId: "data-analysis",
    upvotes: 87,
    downvotes: 5,
    commentCount: 19,
    tags: ["data-viz", "best-practices", "analytics"],
    views: 1285,
    isFeatured: true
  },
  {
    id: "thread3",
    title: "Transitioning from Junior to Senior Developer: My Journey",
    content: "After 5 years in the industry, I've recently been promoted to a Senior Developer position. I wanted to share my journey, the challenges I faced, and the lessons I learned along the way. Hope this helps others on a similar path!",
    author: users[2],
    createdAt: "2023-06-05T14:20:00Z",
    categoryId: "professional",
    upvotes: 213,
    downvotes: 8,
    commentCount: 45,
    tags: ["career", "professional-growth", "development"],
    views: 3576,
    isFeatured: true
  },
  {
    id: "thread4",
    title: "Innovative product idea: AI-powered content creation assistant",
    content: "I've been thinking about a tool that uses AI to help content creators brainstorm ideas, overcome writer's block, and optimize their content for different platforms. Would love to get feedback on this concept!",
    author: users[3],
    createdAt: "2023-06-03T11:10:00Z",
    categoryId: "product-ideas",
    upvotes: 68,
    downvotes: 12,
    commentCount: 31,
    tags: ["ai", "content-creation", "product-idea"],
    views: 974,
    isFeatured: true
  },
  {
    id: "thread5",
    title: "Comprehensive guide to learning React in 2023",
    content: "I've put together a comprehensive learning path for React, including resources, practice projects, and tips for avoiding common pitfalls. This guide is suitable for beginners and those looking to refresh their knowledge.",
    author: users[0],
    createdAt: "2023-06-01T16:45:00Z",
    categoryId: "learning",
    upvotes: 196,
    downvotes: 4,
    commentCount: 37,
    tags: ["react", "javascript", "frontend", "tutorial"],
    views: 2847,
    isFeatured: true
  },
  {
    id: "thread6",
    title: "The future of remote work: Trends and predictions",
    content: "As we continue to adapt to post-pandemic work styles, I've been researching emerging trends in remote and hybrid work. This post summarizes my findings and predictions for how workplace culture will evolve in the coming years.",
    author: users[1],
    createdAt: "2023-05-28T13:25:00Z",
    categoryId: "professional",
    upvotes: 142,
    downvotes: 7,
    commentCount: 23,
    tags: ["remote-work", "future-of-work", "workplace-culture"],
    views: 1693,
    isFeatured: true
  },
  {
    id: "thread7",
    title: "Building accessible web applications: A practical guide",
    content: "Accessibility is often overlooked in web development, but it's crucial for creating truly inclusive digital experiences. I've compiled practical tips, tools, and resources to help you make your web applications more accessible.",
    author: users[2],
    createdAt: "2023-05-25T10:15:00Z", 
    categoryId: "learning",
    upvotes: 178,
    downvotes: 2,
    commentCount: 29,
    tags: ["accessibility", "web-development", "inclusive-design"],
    views: 2127,
    isFeatured: true
  },
  {
    id: "thread8",
    title: "Community challenge: Build something useful in a weekend",
    content: "Let's motivate each other to create something useful in just one weekend! Share your project ideas, progress updates, and final results. This is a great opportunity to practice your skills and get feedback from the community.",
    author: users[0],
    createdAt: "2023-05-22T17:40:00Z",
    categoryId: "general",
    upvotes: 93,
    downvotes: 1,
    commentCount: 41,
    tags: ["challenge", "weekend-project", "community-activity"],
    views: 1254,
    isFeatured: true
  }
];

// Sample comments
export const comments: Comment[] = [
  {
    id: "comment1",
    content: "This is exactly what our community needed! Looking forward to all the interesting discussions.",
    author: users[1],
    createdAt: "2023-06-10T16:05:00Z",
    threadId: "thread1",
    upvotes: 24,
    downvotes: 0,
    isAnswer: false
  },
  {
    id: "comment2",
    content: "Great introduction! I have a question - will there be any moderation for the discussions?",
    author: users[2],
    createdAt: "2023-06-10T16:30:00Z",
    threadId: "thread1",
    upvotes: 15,
    downvotes: 0,
    isAnswer: false
  },
  {
    id: "comment3",
    content: "Yes, we'll have a team of moderators ensuring that discussions remain respectful and on-topic. Thanks for asking!",
    author: users[0],
    createdAt: "2023-06-10T17:00:00Z",
    threadId: "thread1",
    upvotes: 19,
    downvotes: 0,
    parentId: "comment2",
    isAnswer: true
  },
  {
    id: "comment4",
    content: "Love your guide! One additional tip for data visualization - always consider color blindness when choosing your color palette.",
    author: users[3],
    createdAt: "2023-06-08T10:20:00Z",
    threadId: "thread2",
    upvotes: 32,
    downvotes: 1,
    isAnswer: false
  },
  {
    id: "comment5",
    content: "Excellent point! Accessibility should always be a primary consideration in data visualization.",
    author: users[1],
    createdAt: "2023-06-08T11:15:00Z",
    threadId: "thread2",
    upvotes: 27,
    downvotes: 0,
    parentId: "comment4",
    isAcceptedAnswer: true,
    isAnswer: true
  }
];

// Export icons for the icon utility component
export const iconSet = {
  MessageSquare,
  BarChart3,
  Briefcase,
  Lightbulb,
  BookOpen,
  Globe
};

// Helper function to get threads by category
export const getThreadsByCategory = (categoryId: string): Thread[] => {
  return threads.filter(thread => thread.categoryId === categoryId);
};

// Helper function to get featured threads
export const getFeaturedThreads = (): Thread[] => {
  return threads.filter(thread => thread.isFeatured);
};

// Helper function to get thread by ID
export const getThreadById = (threadId: string | undefined): Thread | undefined => {
  if (!threadId) return undefined;
  return threads.find(thread => thread.id === threadId);
};

// Helper function to get comments by thread ID
export const getCommentsByThreadId = (threadId: string): Comment[] => {
  // First, get all comments for this thread
  const threadComments = comments.filter(comment => comment.threadId === threadId);
  
  // Create a map to organize comments by their IDs
  const commentMap = new Map<string, Comment>();
  threadComments.forEach(comment => {
    // Initialize children array for each comment
    commentMap.set(comment.id, { ...comment, children: [] });
  });
  
  // Organize into a hierarchy (parent-child relationship)
  const rootComments: Comment[] = [];
  
  threadComments.forEach(comment => {
    const commentWithChildren = commentMap.get(comment.id)!;
    
    if (comment.parentId && commentMap.has(comment.parentId)) {
      // This is a child comment, add it to its parent's children array
      const parent = commentMap.get(comment.parentId)!;
      if (!parent.children) parent.children = [];
      parent.children.push(commentWithChildren);
    } else {
      // This is a root comment, add it to the rootComments array
      rootComments.push(commentWithChildren);
    }
  });
  
  return rootComments;
};
