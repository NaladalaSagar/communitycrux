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
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  joinedAt: string;
  reputation: number;
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
    avatar: "https://i.pravatar.cc/150?img=1",
    joinedAt: "2023-01-15T14:30:00Z",
    reputation: 2458
  },
  {
    id: "user2",
    username: "samantha_dev",
    avatar: "https://i.pravatar.cc/150?img=2",
    joinedAt: "2022-11-23T09:45:00Z",
    reputation: 3721
  },
  {
    id: "user3",
    username: "tech_guru",
    avatar: "https://i.pravatar.cc/150?img=3",
    joinedAt: "2023-03-10T16:20:00Z",
    reputation: 1845
  },
  {
    id: "user4",
    username: "code_master",
    avatar: "https://i.pravatar.cc/150?img=4",
    joinedAt: "2022-08-05T11:15:00Z",
    reputation: 4562
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
    isFeatured: true
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
    views: 1285
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
    views: 974
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
    views: 2847
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
    downvotes: 0
  },
  {
    id: "comment2",
    content: "Great introduction! I have a question - will there be any moderation for the discussions?",
    author: users[2],
    createdAt: "2023-06-10T16:30:00Z",
    threadId: "thread1",
    upvotes: 15,
    downvotes: 0
  },
  {
    id: "comment3",
    content: "Yes, we'll have a team of moderators ensuring that discussions remain respectful and on-topic. Thanks for asking!",
    author: users[0],
    createdAt: "2023-06-10T17:00:00Z",
    threadId: "thread1",
    upvotes: 19,
    downvotes: 0,
    parentId: "comment2"
  },
  {
    id: "comment4",
    content: "Love your guide! One additional tip for data visualization - always consider color blindness when choosing your color palette.",
    author: users[3],
    createdAt: "2023-06-08T10:20:00Z",
    threadId: "thread2",
    upvotes: 32,
    downvotes: 1
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
    isAcceptedAnswer: true
  }
];

// Helper function to get icon component by name
export const getIconByName = (iconName: string): ReactNode => {
  const icons: Record<string, any> = {
    MessageSquare,
    BarChart3,
    Briefcase,
    Lightbulb,
    BookOpen,
    Globe
  };
  
  const IconComponent = icons[iconName];
  if (IconComponent) {
    return <IconComponent className="h-5 w-5" />;
  }
  return null;
};

// Helper function to get threads by category
export const getThreadsByCategory = (categoryId: string): Thread[] => {
  return threads.filter(thread => thread.categoryId === categoryId);
};

// Helper function to get featured threads
export const getFeaturedThreads = (): Thread[] => {
  return threads.filter(thread => thread.isFeatured);
};
